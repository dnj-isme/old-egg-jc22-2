import { DEFAULT_THEME, getTheme, Theme, ThemeContext, ThemeType } from '@/contexts/ThemeContext';
import { Auth } from '@/controller/Auth';
import { useRouter } from 'next/router';
import ShowNotification, { NotificationTemplate } from '@/controller/NotificationController';
import { MouseEvent, useContext, useEffect, useState } from 'react';

import style from "./base.module.scss"
import { Account } from '@/model/account';
import { Comp } from './component';
import { Icon } from '@iconify/react';

interface Props {
  children?: JSX.Element | JSX.Element[] | string,
}

export default function SidebarTemplate(props: Props) {
  // TODO: Your Hooks are here
  const theme = useContext(ThemeContext)

  // TODO: Your useState starts here
  const [account, setAccount] = useState<Account | null>(null)

  // TODO: Your useEffect starts here
  useEffect(() => {
    effect()
  }, [])

  // TODO: Your custom function here
  async function effect() {
    setAccount(await Auth.getActiveAccount())
  }
  
  return (
    <div className={style.base}>
      <div className={style.sidebar} style={{backgroundColor: theme.sidebar}}>
        <Sidebar account={account}/>
      </div>
      <div className={style.component}>
        {props.children}
      </div>
    </div>
  )
}

function Sidebar({account}: {account: Account | null}) {

  const router = useRouter()

  async function handleLogout(e: MouseEvent) {
    e.preventDefault()
    Auth.logout()
    router.push("/")
  }

  if(!account) return null
  else return (
    <div className={style.sticky}>
      <Comp.H1>Welcome, {account.first_name}</Comp.H1>
      <ul className={style.list}>
        <ListItem href='/account/profile'><Icon icon="material-symbols:account-circle" /><Comp.P>Profile</Comp.P></ListItem>
        {
          !account.business && !account.admin ?
          <>
            <ListItem href='/account/cart'><Icon icon="ic:outline-shopping-cart" /><Comp.P>View Cart</Comp.P></ListItem>
            <ListItem href='/account/order-history'><Icon icon="material-symbols:history" /><Comp.P>Order History</Comp.P></ListItem>
            <ListItem href='/account/wish-list'><Icon icon="mdi:cart-heart" /><Comp.P>Wish List</Comp.P></ListItem>
          </> : null 
        }
        {
          account.business && !account.admin ?
          <>
            <ListItem href='/account/product/create'><Icon icon="fluent-mdl2:product-release" /><Comp.P>Create Product</Comp.P></ListItem>
            <ListItem href='/account/product?contentsPerPage=50'><Icon icon="fluent-mdl2:product-list" /><Comp.P>Manage Product</Comp.P></ListItem>
          </> : null
        }
        {
          account.admin ?
          <>
            <ListItem href='/account/admin/account'><Icon icon="material-symbols:account-circle" /><Comp.P>Manage Accounts</Comp.P></ListItem>
            <ListItem href='/account/admin/store'><Icon icon="material-symbols:account-circle" /><Comp.P>Manage Store / Shops</Comp.P></ListItem>
            <ListItem href='/account/admin/promotion'><Icon icon="tabler:speakerphone" /><Comp.P>Manage Promotion Banner</Comp.P></ListItem>
            <ListItem href='/account/admin/newsletter'><Icon icon="zondicons:news-paper" /><Comp.P>Manage News Letter</Comp.P></ListItem>
          </> : null
        }
        <ListItem onClick={_ => NotificationTemplate.InProgress("Chat")}><Icon icon="material-symbols:chat-rounded" /><Comp.P>Chat</Comp.P></ListItem>
        <ListItem href='/account/change-password'><Icon icon="material-symbols:key-rounded" /><Comp.P>Change Password</Comp.P></ListItem>
        <ListItem href='/' onClick={handleLogout}><Icon icon="ri:logout-box-r-line" /><Comp.P>Logout</Comp.P></ListItem>
      </ul>
    </div>
  )
}

function ListItem({href, children, onClick}: {href?: string, children?: JSX.Element | JSX.Element[] | string, onClick?: (e: MouseEvent) => any}) {
  const theme = useContext(ThemeContext)
  return <li className={style.item}><a href={href} onClick={onClick} style={{color: theme.textColor}}>{children}</a></li>
}