import { DEFAULT_THEME, getTheme, ThemeContext, ThemeType } from '@/contexts/ThemeContext';
import { Auth } from '@/controller/Auth';
import ShowNotification from '@/controller/NotificationController';
import { SampleQuery } from '@/database/query';
import { Account } from '@/model/account';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/router';
import { FormEvent, useContext, useEffect, useState } from 'react';
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
  const [message, setMessage] = useState('')

  const [messages, setMessages] = useState([])

  const [socket, setSocket] = useState<WebSocket | null>(null)

  // TODO: Put UseEffect Stuff Here
  useEffect(() => {
    Auth.getActiveAccount().then(acc => setAccount(acc))

    const webSocket = new WebSocket('ws://localhost:8080/api/chat');
    setSocket(webSocket)
    
    webSocket.addEventListener('open', () => {
      console.log('WebSocket connection opened');
      getAllMessages()
    });

    webSocket.addEventListener('message', (event) => {
      console.log(`Received message from WebSocket server: ${event.data}`);
    });

    webSocket.addEventListener('close', () => {
      console.log('WebSocket connection closed');
    });

    return () => {
      webSocket.close();
    };
  }, [])

  async function getAllMessages() {
    
  }

  // TODO: Put Your Custom Logic here
  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

  }

  // TODO: Your React Element starts here...
  return (
    <div className={style.chat} style={{backgroundColor: theme.background}}>
      <div className={style.left}>
        <ul>
          <Contact alt='Customer Service' />
        </ul>
      </div>
      <div className={style.right}>
        <div>
          <ul>

          </ul>
        </div>
        {
          props.admin ? null :
          <div>
            <form method='post' className={style.input} onSubmit={handleSubmit}>
              <input type="text" name="message" id="message" onChange={e => setMessage(e.target.value)}/>
              <Button.Blue type='submit'><Icon icon="material-symbols:send" /></Button.Blue>
            </form>
          </div>
        }
      </div>
    </div>
  )
}