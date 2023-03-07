
import { DEFAULT_THEME, getTheme, Theme, ThemeContext, ThemeType } from '@/contexts/ThemeContext';
import { Auth } from '@/controller/Auth';
import { useRouter } from 'next/router';
import ShowNotification, { NotificationTemplate } from '@/controller/NotificationController';
import { FormEvent, MouseEvent, useEffect, useState } from 'react';
import Footer from '@/components/footer/footer';
import Navbar from '@/components/navbar/navbar';
import { ReactNotifications } from 'react-notifications-component';
import style from "./style.module.scss"
import Logo from "@/assets/images/logo.svg"
import Image from 'next/image';
import AuthFooter from '@/components/footer/auth_footer';
import { Comp } from '@/components/component';
import { From } from '@/database/api';

export default function index() {
  // TODO: Your hooks starts here
  const router = useRouter() // For Navigating
  const query = router.query;

  // TODO: Your useState starts here
  const [theme, setTheme] = useState<ThemeType>(DEFAULT_THEME)
  const [code, setCode] = useState("")

  // TODO: Your useEffect starts here
  useEffect(() => {
    if(!query.email || !query.id) {
      router.back()
    }
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

  async function handleOneTime(e: FormEvent) {
    e.preventDefault()
    const res = await From.Rest.fetchData("/onetime/verify", "POST", {
      id: query.id,
      code
    })

    if (res.success) {
      Auth.setToken(res.data.token)
      global.signin = true;
      router.push("/")
    }
    else {
      NotificationTemplate.Error()
    }
  }

  async function newCode(e: MouseEvent) {
    e.preventDefault()
    const email = query.email
    const res = await From.Rest.fetchData("/onetime", "POST", {email})
    if(res.success) {
      ShowNotification("success", "Code Resend Success", "Please Check Your Email for New Code")
      router.push(`onetime?id=${res.data.id}&email=${query.email}`)
    }
  }

  // TODO: Your React Element Starts here
  return (
    <Auth.Protection
      // TODO: Put Your Authentication Rule here...
      MustLogout
    >
      <ThemeContext.Provider value={theme}>
        <ReactNotifications />
        <Navbar changeTheme={changeTheme}/>
        <div className='main' style={{backgroundColor: theme.background}}>
          <div className={'main flex-column justify-space-between ' + style.base} style={{backgroundColor: theme.background}}>
            <form method="post" onSubmit={handleOneTime} className="flex-column align-center">
              <div>
                <a href='/'><Image src={Logo} alt="logo" /></a>
              </div>
              <h1 style={{color: theme.textColor}}>One Time Sign In</h1>
              <h2 style={{color: theme.textColor}}>{query.email}</h2>
              <div>
                <input type="text" placeholder="One Time Code (6 digits)" onChange={e => setCode(e.target.value)}/>
              </div>
              <div>
                <button className={style.submit} type="submit">SUBMIT</button>
              </div>
              <div>
                <Comp.P>Expired? <Comp.A onClick={newCode}>Request a new code</Comp.A></Comp.P>
              </div>
            </form>
            <AuthFooter />
          </div>
        </div>
        <Footer />
      </ThemeContext.Provider>
    </Auth.Protection>
  )
}