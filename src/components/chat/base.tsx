import { DEFAULT_THEME, getTheme, ThemeContext, ThemeType } from '@/contexts/ThemeContext';
import { Auth } from '@/controller/Auth';
import ShowNotification, { NotificationTemplate } from '@/controller/NotificationController';
import { From } from '@/database/api';
import { SampleQuery } from '@/database/query';
import { Account } from '@/model/account';
import { Message } from '@/model/chat';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/router';
import { FormEvent, forwardRef, useContext, useEffect, useState } from 'react';
import { Button, Comp } from '../component';
import ChatBubble from './bubble';
import Contact from './contact';

import style from "./style.module.scss"

interface Props {
  admin?: boolean
}

export default function ChatElement(props: Props) {
  // TODO: Your hooks starts here...
  const theme = useContext(ThemeContext) // For Theme
  const router = useRouter() // For Navigating

  // TODO: Put UseState Stuff here
  const [account, setAccount] = useState<Account | null>(null)
  const [chats, setChats] = useState<Message[]>([])
  const [socket, setSocket] = useState<WebSocket | null>(null)

  const [targets, setTargets] = useState<Account[]>([])
  const [admin, setAdmin] = useState<Account | null>(null)
  const [store, setStore] = useState<Account | null>(null)

  const [selected, setSelected] = useState<Account | null>(null)

  const [password, setPassword] = useState('')

  const [message, setMessage] = useState('')

  // TODO: Put UseEffect Stuff Here
  useEffect(() => {
    fetchStore()
    Auth.getActiveAccount().then(acc => setAccount(acc))
  }, [])

  useEffect(() => {
    if(account) {
      const webSocket = new WebSocket('ws://localhost:8080/api/chat', account.id);
      console.warn(account.id);
      
      setSocket(webSocket)
      
      webSocket.addEventListener('open', () => {
        console.warn('WebSocket connection opened');

        getAllMessages()
      })
  
  
      webSocket.addEventListener('close', () => {
        console.warn('WebSocket connection closed');
      });
  
      return () => {
        webSocket.close();
      };
    }
  }, [account])

  async function fetchStore() {
    const id = sessionStorage.getItem("chat-target") 
    if(id) {
      const res = await From.Graphql.execute(SampleQuery.accountByID, {id})
      if(res.success) {
        setStore(res.data)
      }
      sessionStorage.removeItem("chat-target")
    }

  }

  useEffect(() => {
    if(socket) {
      socket.onmessage = event => {
        console.log(`Received message from WebSocket server: ${event.data}`);
        getAllMessages()
      };
    } 
  }, [socket])

  useEffect(getTargets, [chats])

  function unique(targets: Account[], search: Account) {
    const len = targets.length

    for(let i = 0; i < len; i++) {
      if(search.id == targets[i].id) return false;
    }
    return true;
  }

  function getTargets() {    
    let t: Account[] = []
    if(account) {
      chats.forEach(chat => {
        if(chat.sender && chat.sender.id != account.id && unique(t, chat.sender)) {
          t.push(chat.sender)
        }
        if(chat.receiver && chat.receiver.id != account.id && unique(t, chat.receiver)) {
          t.push(chat.receiver)
        }
      })
    }

    console.log(t);

    setTargets(t)
  }

  async function getAllMessages() {
    const account = await Auth.getActiveAccount()
    if(!account) {
      NotificationTemplate.Failed("fetch account data")
      return;
    }

    let query = SampleQuery.messages
    let params = {id: account.id}

    const res = await From.Graphql.execute(query, params)
    console.log(res.data);
    
    if(res.success) {
      let c: Message[] = res.data;

      console.log({message: "CHATs", c});

      if(!props.admin) {
        const fetchCS = await From.Rest.fetchData("/cs", "GET", {}, Auth.getToken())
        if(!fetchCS.success) {
          ShowNotification("danger", "Failed", fetchCS.data)
          return
        }

        console.log("ID : " + fetchCS.data.id);

        // const admin: Account
        const adm = await From.Graphql.execute(SampleQuery.accountByID, {id: fetchCS.data.id})

        if(!adm.success) {
          NotificationTemplate.Error()
          return
        }

        console.warn({msg: "TEST", data: adm.data});

        setAdmin(adm.data)
      }

      console.log(c);
      setChats(c)
    }
    else {
      console.error({message: "ERROR", data: res.raw});
      NotificationTemplate.Error()
    }
    getTargets()
  }

  function getMessages(): Message[] {
    let output: Message[] = []

    chats.forEach(c => {
      if(!c.sender || !c.receiver) return

      if(
        (c.sender.id == account?.id || c.receiver.id == account?.id) &&
        (c.sender.id == selected?.id || c.receiver.id == selected?.id)
      ) {
        output.push(c)
      }
    })

    console.log({output, chats});

    return output
  }

  // TODO: Put Your Custom Logic here
  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    
    const data={
      sender: account?.id,
      receiver: selected?.id,
      message
    }
    
    console.log(data);
    
    socket?.send(JSON.stringify(data))
  }

  function changeSelected(acc: Account | null) {
    console.warn(acc)
    setSelected(acc)
  }

  // TODO: Your React Element starts here...
  return (
    <div className={style.chat} style={{backgroundColor: theme.background}}>
      <div className={style.left}>
        <ul>
          {
            account?.admin ? null : 
            <Contact alt='Customer Service' account={admin} onClick={_ => changeSelected(admin)}/>
          }
          {
            !store ? null : 
            <Contact account={store} onClick={_ => changeSelected(store)} />
          }
          {
            targets.map(acc => 
              (acc.id == store?.id || acc.id == admin?.id) ? null : 
              <Contact account={acc} onClick={_ => changeSelected(acc)} />
            )
          }
        </ul>
      </div>
      <div className={style.right}>
        <div>
          <ul>
            {getMessages().map(msg => (
              <ChatBubble message={msg.message} account={msg.sender} class={msg.sender.id == account?.id ? style.sender : style.receiver}/>
            ))}
          </ul>
        </div>
        {
          props.admin ? null :
          <div>
            <form method='post' className={style.input} onSubmit={handleSubmit}>
              <input type="text" name="message" id="message" value={message} onChange={e => setMessage(e.target.value)}/>
              <Button.Blue type='submit'><Icon icon="material-symbols:send" /></Button.Blue>
            </form>
          </div>
        }
      </div>
    </div>
  )
}