import { DEFAULT_THEME, getTheme, ThemeContext, ThemeType } from '@/contexts/ThemeContext';
import ShowNotification from '@/controller/NotificationController';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { MouseEvent, useContext, useEffect, useState } from 'react';
import { Comp } from '@/components/component';

import style from './topbar.module.scss'
import { Auth } from '@/controller/Auth';

export default function Topbar({id}: {id: string}) {
  // TODO: Your hooks starts here...
  const theme = useContext(ThemeContext) // For Theme
  const router = useRouter() // For Navigating
  
  // TODO: Put UseState Stuff here

  // TODO: Put Your Custom Logic here
  async function handleChat(e: MouseEvent) {
    e.preventDefault()
    const acc = await Auth.getActiveAccount()

    if(!acc) {
      router.push("/auth/signin")
    }
    else {
      sessionStorage.setItem("chat-target", id)
      router.push("/account/chat")
    }
  }

  // TODO: Your React Element starts here...
  return (
    <div className={style.component} style={{backgroundColor: theme.navbar}}>
      <a style={{color: theme.textColor}} href={"/shop/" + id} className={style.link}>Store Home</a>
      <a style={{color: theme.textColor}} href={"/shop/" + id + "/product"} className={style.link}>All Products</a>
      <a style={{color: theme.textColor}} href={"/shop/" + id + "/review"} className={style.link}>Reviews</a>
      <a style={{color: theme.textColor}} href={"/shop/" + id + "/return-policy"} className={style.link}>Return Policy</a>
      <a style={{color: theme.textColor}} href={"/shop/" + id + "/about"} className={style.link}>About Us</a>
      <a style={{color: theme.textColor}} onClick={handleChat} href={"/account/chat"} className={style.link}>Contact Us</a>
    </div>
  )
}