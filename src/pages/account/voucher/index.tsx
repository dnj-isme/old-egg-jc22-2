import { DEFAULT_THEME, getTheme, Theme, ThemeContext, ThemeType } from '@/contexts/ThemeContext';
import { Auth } from '@/controller/Auth';
import { useRouter } from 'next/router';
import ShowNotification, { NotificationTemplate } from '@/controller/NotificationController';
import { FormEvent, useEffect, useState } from 'react';
import Footer from '@/components/footer/footer';
import Navbar from '@/components/navbar/navbar';
import { ReactNotifications } from 'react-notifications-component';
import SidebarTemplate from '@/components/base';
import { Comp } from '@/components/component';

import style from "./style.module.scss"
import { From } from '@/database/api';

export default function index() {
  // TODO: Your hooks starts here
  const router = useRouter() // For Navigating

  // TODO: Your useState starts here
  const [theme, setTheme] = useState<ThemeType>(DEFAULT_THEME)
  const [id, setID] = useState('')

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

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const acc = await Auth.getActiveAccount()

    if(!acc) {
      NotificationTemplate.Failed("Fetch Account Data")
      return;
    }
    const res = await From.Rest.fetchData("/voucher/apply", "POST", {
      id,
      account_id: acc.id
    }, Auth.getToken())

    if(res.success) {
      ShowNotification("success", "Success!", res.data.status)
      Auth.extendSession()
    }
    else {
      ShowNotification("danger", "Failed!", res.data)
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
            <div className={'center ' + style.main}>
              <Comp.H1>Apply Voucher</Comp.H1>
              <form onSubmit={handleSubmit}>
                <div>
                  <Comp.H2>Voucher Code</Comp.H2>
                  <input type="text" name="code" id="code" required onChange={e => setID(e.target.value)}/>
                </div>
                <div>
                  <button type="submit" className={style.submit}>SUBMIT</button>
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