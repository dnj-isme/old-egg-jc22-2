import { DEFAULT_THEME, getTheme, ThemeContext, ThemeType } from '@/contexts/ThemeContext';
import { FormEvent, FormEventHandler, MouseEvent, useEffect, useState } from 'react';
import Logo from "@/assets/images/logo.svg"
import Image from 'next/image';
import style from './style.module.scss'
import AuthFooter from '@/components/footer/auth_footer';
import { Auth } from '@/controller/Auth';
import ShowNotification from '@/controller/NotificationController';
import { ReactNotifications } from 'react-notifications-component';
import Cookies from 'universal-cookie/cjs/Cookies';
import { useRouter } from 'next/router';
import { Button, Comp } from '@/components/component';
import { GetServerSidePropsContext } from 'next';
import { From } from '@/database/api';

interface Props {
  email: string
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const {query} = context

  let props: Props = {
    email: ""
  }

  if(query.email && !Array.isArray(query.email)) {
    props.email = query.email
  }

  return {
    props
  }
}

export default function login(props: Props) {
  const [theme, setTheme] = useState<ThemeType>(DEFAULT_THEME)
  const [email, setEmail] = useState(props.email)
  const [code, setCode] = useState(0)
  const [step, setStep] = useState(1)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const sessionTheme = getTheme(localStorage.getItem('theme'))
    localStorage.setItem('theme', sessionTheme.className)
    setTheme(sessionTheme)
  }, [])

  async function handleRequest(e: FormEvent | MouseEvent) {
    e.preventDefault()
    const res = await From.Rest.fetchData("/account/reset", "POST", {email})
    if(res.success) {
      setStep(2)
      ShowNotification("success", "Success", res.data.status)
    }
    else {
      ShowNotification("danger", "Failed", res.data)
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const res = await From.Rest.fetchData("/account/reset/verify", "POST", {email, code})
    if(res.success) {
      setStep(2)
      ShowNotification("success", "Success", res.data.status)
      setSuccess(true)
    }
    else {
      ShowNotification("danger", "Failed", res.data)
    }
  }

  return (
    <Auth.Protection MustLogout={true}>
      <ThemeContext.Provider value={theme}>
        <ReactNotifications />
        <div className={'main flex-column justify-space-between ' + style.base} style={{backgroundColor: theme.background}}>
          {
            step == 1 ?
            <form method="post" onSubmit={handleRequest} className="flex-column align-center">
              <div>
                <a href='/'><Image src={Logo} alt="logo" /></a>
              </div>
              <h1 style={{color: theme.textColor}}>Sign In Assistance</h1>
              <div>
                <input type="email" name="email" id="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email Address" />
              </div>
              <div>
                <button className={style.submit} type="submit">Send Code</button>
              </div>
              <div>
                <Comp.A onClick={_ => setStep(2)}>Input Code</Comp.A>
              </div>
              <div>
                <Comp.P>
                  Need Help?
                  <Comp.A href='#'>Contact Customer Service</Comp.A>
                </Comp.P>
              </div>
            </form> : null
          }
          {
            step == 2 ?
            <form method="post" onSubmit={handleSubmit} className="flex-column align-center">
              <div>
                <a href='/'><Image src={Logo} alt="logo" /></a>
              </div>
              <h1 style={{color: theme.textColor}}>Sign In Assistance</h1>
              <Comp.P>Input code sent through your email ({email})</Comp.P>
              <div>
                <input type="text" name="code" id="code" onChange={e => setCode(parseInt(e.target.value))} placeholder="Input Code" />
              </div>
              <div>
                <button className={style.submit} type="submit">SUBMIT</button>
              </div>
              <div>
                <Comp.P>
                  Don't see the email? 
                  <Comp.A onClick={handleRequest}>Resend code</Comp.A> OR
                  <Comp.A onClick={_ => setStep(1)}>Change Email Address</Comp.A>
                </Comp.P>
                <Comp.P>
                  Need Help?
                  <Comp.A href='#'>Contact Customer Service</Comp.A>
                </Comp.P>
              </div>
            </form> : null
          }
          {
            success ? <Button.Blue onClick={_ => router.push("/auth/signin")}>Back to Login Page</Button.Blue> : null
          }
          <AuthFooter />
        </div>
      </ThemeContext.Provider>
    </Auth.Protection>
  )
}