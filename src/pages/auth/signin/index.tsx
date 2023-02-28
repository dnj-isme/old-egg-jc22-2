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
import { emailRegex } from '@/controller/Regex';
import { useRouter } from 'next/router';
import { Comp } from '@/components/component';

export default function login() {
  const [theme, setTheme] = useState<ThemeType>(DEFAULT_THEME)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errEmail, setErrEmail] = useState<HTMLElement | null>()
  const router = useRouter()

  useEffect(() => {
    const sessionTheme = getTheme(sessionStorage.getItem('theme'))
    sessionStorage.setItem('theme', sessionTheme.className)
    setTheme(sessionTheme)
  }, [])

  async function handleLogin(e: FormEvent) {
    e.preventDefault()
    
    if(!email || !password) {
      ShowNotification("danger", "Error", "You have empty fields")
    }
    const res = await Auth.attemptLogin(email, password)
    if(res.success) {
      ShowNotification("success", "Success", "Login Successfull!");
      global.signin = true
      router.push("/")
    }
    else {
      ShowNotification("danger", "Failed", res.data);
    }
  } 

  function handleOneTime(e: FormEvent) {
    e.preventDefault()

    if(emailRegex.test(email)) {
      // TODO: Handle One Time Login
      ShowNotification("info", "In Progress", "Handling One Time Login is in progress...");
    }
    // TODO: Show Error Message
    else {
      ShowNotification("danger", "Error", "Invalid Email Format");
    }
  }

  return (
    <Auth.Protection MustLogout={true}>
      <ThemeContext.Provider value={theme}>
        <ReactNotifications />
        <div className={'main flex-column justify-space-between ' + style.base} style={{backgroundColor: theme.background}}>
          <form method="post" onSubmit={handleLogin} className="flex-column align-center">
            <div>
              <a href='/'><Image src={Logo} alt="logo" /></a>
            </div>
            <h1 style={{color: theme.textColor}}>Sign In</h1>
            <div>
              <input type="email" name="email" id="email" onChange={e => setEmail(e.target.value)} placeholder="Email Address"/>
              <p className='error' id='EmailError'> </p>
            </div>
            <div className='invisible' id='password'>
              <input type="password" name="password" id="password" onChange={e => setPassword(e.target.value)} placeholder="Password"/>
            </div>
            <div>
              <button className={style.submit} type="submit">SIGN IN</button>
            </div>
            <div>
              <a onClick={(e:any)=>{
                e.preventDefault()
                const encode = encodeURIComponent(email)
                router.push(`forgot/[email]`,`forgot/${encode}`)
              }}>Forgot Password?</a>
            </div>
            <div>
              <button style={{color: theme.textColor, backgroundColor: theme.button}} onClick={handleOneTime}>GET ONE-TIME SIGN IN CODE</button>
            </div>
            <div>
              <a style={{color: theme.textColor}} >What's the One-Time Code?</a>
            </div>
            <div>
              <p style={{color: theme.textColor}} >New to Oldegg? <a href='/auth/signup' style={{color: theme.textColor}}>Sign Up</a></p>
            </div>
          </form>
          <AuthFooter />
        </div>
      </ThemeContext.Provider>
    </Auth.Protection>
  )
}