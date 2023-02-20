import { DEFAULT_THEME, getTheme, ThemeContext, ThemeType } from '@/contexts/ThemeContext';
import { FormEvent, FormEventHandler, useEffect, useState } from 'react';
import Logo from "@/assets/images/logo.svg"
import Image from 'next/image';
import style from './style.module.scss'
import AuthFooter from '@/components/footer/auth_footer';
import { Auth } from '@/controller/Auth';
import ShowNotification from '@/controller/NotificationController';
import { ReactNotifications } from 'react-notifications-component';
import Cookies from 'universal-cookie/cjs/Cookies';
import { EmailRegex } from '@/controller/FormatController';
import { useRouter } from 'next/router';
import { Comp } from '@/components/component';

export default function login() {
  const [theme, setTheme] = useState<ThemeType>(DEFAULT_THEME)
  const [email, setEmail] = useState('')
  const router = useRouter()

  useEffect(() => {
    const sessionTheme = getTheme(sessionStorage.getItem('theme'))
    sessionStorage.setItem('theme', sessionTheme.className)
    setTheme(sessionTheme)
    if(router.query.email != undefined && !Array.isArray(router.query.email)) {
      setEmail(router.query.email)
    }
  }, [])

  function handleVerify(e: FormEvent) {
    e.preventDefault()
  }

  return (
    <Auth.Protection MustLogout={true}>
      <ThemeContext.Provider value={theme}>
        <ReactNotifications />
        <div className={'main flex-column justify-space-between ' + style.base} style={{backgroundColor: theme.background}}>
          <form method="post" onSubmit={handleVerify} className="flex-column align-center">
            <div>
              <a href='/'><Image src={Logo} alt="logo" /></a>
            </div>
            <h1 style={{color: theme.textColor}}>Sign In Assistance</h1>
            <div>
              <input type="email" name="email" id="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email Address" />
              <p className='error' id='EmailError'> </p>
            </div>
            <div>
              <button className={style.submit} type="submit">SIGN IN</button>
            </div>
            <div>
              <Comp.P>
                Need Help?
                <Comp.A href='#'>Contact Customer Service</Comp.A>
              </Comp.P>
            </div>
          </form>
          <AuthFooter />
        </div>
      </ThemeContext.Provider>
    </Auth.Protection>
  )
}