import { DEFAULT_THEME, getTheme, ThemeContext, ThemeType } from '@/contexts/ThemeContext';
import ShowNotification from '@/controller/NotificationController';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { Comp } from '@/components/component';

import style from './sidebar.module.scss'

export default function Topbar() {
  // TODO: Your hooks starts here...
  const theme = useContext(ThemeContext) // For Theme
  const router = useRouter() // For Navigating
  
  // TODO: Put UseState Stuff here

  // TODO: Put Your Custom Logic here

  // TODO: Your React Element starts here...
  return (
    <div className={style.component} style={{backgroundColor: theme.navbar}}>
      <Comp.A href="dashboard" className={style.link}>Dashboard</Comp.A>
      <Comp.A href="shop" className={style.link}>Shop</Comp.A>
      <Comp.A href="user" className={style.link}>User</Comp.A>
      <Comp.A href="chat" className={style.link}>Chat</Comp.A>
      <Comp.A href="promotion" className={style.link}>Promotion</Comp.A>
    </div>
  )
}