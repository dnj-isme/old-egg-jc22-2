import { DEFAULT_THEME, getTheme, Theme, ThemeContext, ThemeType } from '@/contexts/ThemeContext';
import { Auth } from '@/controller/Auth';
import { useRouter } from 'next/router';
import ShowNotification from '@/controller/NotificationController';
import { useEffect, useState } from 'react';
import Footer from '@/components/footer/footer';
import Navbar from '@/components/navbar/navbar';
import { ReactNotifications } from 'react-notifications-component';
import { Button, Comp } from '@/components/component';
import BannerList from '@/components/admin/promotion/banner_table';
import style from "./style.module.scss"
import SidebarTemplate from '@/components/base';

export default function index() {
  // TODO: Your hooks starts here
  const router = useRouter() // For Navigating

  // TODO: Your useState starts here
  const [theme, setTheme] = useState<ThemeType>(DEFAULT_THEME)

  // TODO: Your useEffect starts here
  useEffect(() => {
    if(global.ban) {
      global.ban = false
      ShowNotification("success", "Success", "Account Banned Successfully!")
    }
    if(global.unban) {
      global.unban = false
      ShowNotification("success", "Success", "Account Unbanned Successfully!")
    }
    const sessionTheme = getTheme(localStorage.getItem('theme'))
    localStorage.setItem('theme', sessionTheme.className)
    setTheme(sessionTheme)
  }, [])
  
  function changeTheme() {
    const newTheme = theme === Theme.DARK ? Theme.LIGHT : Theme.DARK
    localStorage.setItem('theme', newTheme.className)
    setTheme(newTheme)
    console.log(newTheme.background);
  }

  // TODO: Your React Element Starts here
  return (
    <Auth.Protection
      // TODO: Put Your Authentication Rule here...
      MustLogin
    >
      <ThemeContext.Provider value={theme}>
        <ReactNotifications />
        <div className='main' style={{backgroundColor: theme.background}}>
          <Navbar changeTheme={changeTheme}/>
          <SidebarTemplate>
            <div className={style.content} style={{backgroundColor: theme.background}}>
              <div>
                <Comp.H1>Promotion Banner</Comp.H1>
              </div>
              <div>
                <Button.Blue onClick={_ => router.push("promotion/new")}>Add Banner</Button.Blue>
              </div>
              <BannerList />
            </div>
          </SidebarTemplate>
          <Footer />
        </div>
      </ThemeContext.Provider>
    </Auth.Protection>
  )
}