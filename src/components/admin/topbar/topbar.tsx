import { DEFAULT_THEME, getTheme, ThemeContext, ThemeType } from '@/contexts/ThemeContext';
import ShowNotification from '@/controller/NotificationController';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { Comp } from '@/components/component';

import style from './topbar.module.scss'

export default function SideBar() {
  // TODO: Your hooks starts here...
  const theme = useContext(ThemeContext) // For Theme
  const router = useRouter() // For Navigating
  
  // TODO: Put UseState Stuff here

  // TODO: Put Your Custom Logic here
  function navigate(url: string) {
    router.push(url)
  }

  // TODO: Your React Element starts here...
  return (
    <div className={style.component} style={{backgroundColor: theme.navbar}}>
      <a style={{color: theme.textColor}} onClick={_=>navigate("/admin/dashboard")} className={style.link}>Dashboard</a>
      <a style={{color: theme.textColor}} onClick={_=>navigate("/admin/customers")} className={style.link}>Customers</a>
      <a style={{color: theme.textColor}} onClick={_=>navigate("/admin/shop")} className={style.link}>Shop</a>
      <a style={{color: theme.textColor}} onClick={_=>navigate("/admin/chat")} className={style.link}>Chat</a>
      <a style={{color: theme.textColor}} onClick={_=>navigate("/admin/promotion")} className={style.link}>Promotion</a>
    </div>
  )
}