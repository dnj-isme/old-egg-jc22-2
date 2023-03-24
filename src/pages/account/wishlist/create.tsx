import { DEFAULT_THEME, getTheme, Theme, ThemeContext, ThemeType } from '@/contexts/ThemeContext';
import { Auth } from '@/controller/Auth';
import { useRouter } from 'next/router';
import ShowNotification, { NotificationTemplate } from '@/controller/NotificationController';
import { FormEvent, useEffect, useState } from 'react';
import Footer from '@/components/footer/footer';
import Navbar from '@/components/navbar/navbar';
import { ReactNotifications } from 'react-notifications-component';
import SidebarTemplate from '@/components/base';
import { Button, Comp } from '@/components/component';

import style from "./style.module.scss"
import { From } from '@/database/api';

export default function index() {
  // TODO: Your hooks starts here
  const router = useRouter() // For Navigating

  // TODO: Your useState starts here
  const [theme, setTheme] = useState<ThemeType>(DEFAULT_THEME)
  const [public_wishlist, setPublic] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  // TODO: Your useEffect starts here
  useEffect(() => {
    const sessionTheme = getTheme(localStorage.getItem('theme'))
    localStorage.setItem('theme', sessionTheme.className)
    setTheme(sessionTheme)
  }, [])

  // TODO: Your custom logic starts here...

  function changeTheme() {
    const newTheme = theme === Theme.DARK ? Theme.LIGHT : Theme.DARK
    localStorage.setItem('theme', newTheme.className)
    setTheme(newTheme)
    console.log(newTheme.background);
  }

  async function handleSubmit (e: FormEvent) {
    e.preventDefault()
    const acc = await Auth.getActiveAccount()
    if(!acc) {
      NotificationTemplate.Failed("Fetch Account Data")
      return
    }
    const res = await From.Rest.fetchData("/wishlist/", "POST", {
      public_wishlist,
      title,
      description,
      account_id: acc.id
    }, Auth.getToken())
    if(res.success) {
      global.wishlist = true
      router.push("/account/wishlist")
    }
    else {
      ShowNotification("danger", "Failed", res.data)
    }
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
            <div className='center'>
              <Comp.H1>Create Wishlist</Comp.H1>
              <form className={'center ' + style.form} method='post' onSubmit={handleSubmit}>
                <div>
                  <input type="text" name="name" id="name" placeholder='Wishlist Title' onChange={e => setTitle(e.target.value)}/>
                </div>
                <div>
                  <input type="text" name="note" id="note" placeholder='Wishlist Description' onChange={e => setDescription(e.target.value)}/>
                </div>
                <div>
                  <Comp.Label htmlFor="public">Public Wishlist</Comp.Label>
                  <input type="checkbox" name="public" id="public" className={style.na} checked={public_wishlist} onChange={e => setPublic(e.target.checked)}/>
                </div>
                <div>
                  <button type="submit" className={style.submit}>Create</button>
                </div>
              </form>
            </div>
          </SidebarTemplate>
          <Footer />
        </div>
      </ThemeContext.Provider>
    </Auth.Protection>
  )
}