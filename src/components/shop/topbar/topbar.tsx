import { DEFAULT_THEME, getTheme, ThemeContext, ThemeType } from '@/contexts/ThemeContext';
import ShowNotification from '@/controller/NotificationController';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { Comp } from '@/components/component';

import style from './topbar.module.scss'

export default function Topbar() {
  // TODO: Your hooks starts here...
  const theme = useContext(ThemeContext) // For Theme
  const router = useRouter() // For Navigating
  
  // TODO: Put UseState Stuff here

  // TODO: Put Your Custom Logic here
  function navigate(url: string) {
    router.push("/shop/" + url)
  }

  // TODO: Your React Element starts here...
  return (
    <div className={style.component} style={{backgroundColor: theme.navbar}}>
      <a style={{color: theme.textColor}} onClick={_=>navigate("")} className={style.link}>Dashboard</a>
      <a style={{color: theme.textColor}} onClick={_=>navigate("product")} className={style.link}>Product</a>
      <a style={{color: theme.textColor}} onClick={_=>navigate("chat")} className={style.link}>Live Chat</a>
      <a style={{color: theme.textColor}} onClick={_=>navigate("change-password")} className={style.link}>Change Password</a>
    </div>
  )
}