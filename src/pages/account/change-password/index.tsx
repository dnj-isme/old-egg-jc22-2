import { DEFAULT_THEME, getTheme, Theme, ThemeContext, ThemeType } from '@/contexts/ThemeContext';
import { FormEvent, FormEventHandler, useEffect, useRef, useState } from 'react';
import Logo from "@/assets/images/logo.svg"
import Image from 'next/image';
import style from './style.module.scss'
import AuthFooter from '@/components/footer/auth_footer';
import { Comp } from '@/components/component';
import ShowNotification, { NotificationTemplate } from '@/controller/NotificationController';
import { ReactNotifications } from 'react-notifications-component';
import { From } from '@/database/api';
import { useRouter } from 'next/router';
import Cookies from 'universal-cookie';
import { emailRegex, passwordRegex, phoneRegex } from '@/controller/Regex';
import { Auth } from '@/controller/Auth';
import Navbar from '@/components/navbar/navbar';
import Footer from '@/components/footer/footer';
import SidebarTemplate from '@/components/base';

export default function SignUp() {
  const router = useRouter()

  const [theme, setTheme] = useState<ThemeType>(DEFAULT_THEME)
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')

  useEffect(() => {
    const sessionTheme = getTheme(localStorage.getItem('theme'))
    localStorage.setItem('theme', sessionTheme.className)
    setTheme(sessionTheme)

    if(global.reset) {
      global.reset = false;
      ShowNotification("success", "Success", "Reset Password Succeed!")
    }
  }, [])

  function validation(input: string, regex: RegExp) {
    return regex.test(input) ? "✅" : "❌" 
  }

  async function handleSignUp(e: FormEvent) {
    e.preventDefault();

    let valid: boolean = true;

    if(valid) {
      const account = await Auth.getActiveAccount()
      if(account == null) {
        console.error("Account is null");
        console.error(account);
        router.push("/auth/signin");
        return
      }
      const res = await From.Rest.fetchData("/account/password/change", "PATCH", {
        email: account.email,
        last_password: password,
        new_password: newPassword,
      }, Auth.getToken());

      if(!res.success) {
        console.error(res.raw);
        ShowNotification("danger", "Error " + res.status, res.data)
      }
      else {
        global.reset = true
        router.reload()
      }
    }
    else {
      ShowNotification("warning", "Field Issue", "Fix some input fields before continue...")
    }
  }

  function changeTheme() {
    const newTheme = theme === Theme.DARK ? Theme.LIGHT : Theme.DARK
    localStorage.setItem('theme', newTheme.className)
    setTheme(newTheme)
    console.log(newTheme.background);
  }

  return (
    <Auth.Protection
      MustLogin
    >
      <ThemeContext.Provider value={theme}>
        <ReactNotifications />
        <div className='main'>
          <Navbar changeTheme={changeTheme} />
          <div className="content">
            <SidebarTemplate>
              <div className={'flex-column justify-space-between ' + style.base} style={{backgroundColor: theme.background}}>
                <form method="post" onSubmit={handleSignUp} className="flex-column align-center">
                  <h1 style={{color: theme.textColor}}>Change Password</h1>
                  <div>
                    <input type="password" name="password" id="password" onChange={e => setPassword(e.target.value)} placeholder="Previous Password"/>
                  </div>
                  <div id='password'>
                    <input type="password" name="password" id="password" onChange={e => setNewPassword(e.target.value)} placeholder="New Password"/>
                    <div className={style.pass_error}>
                      <div>
                        <Comp.P>Including 3 of the following:</Comp.P>
                        <div className={style.container}>
                          <div className={style.pass_element}>
                            <Comp.P className='no-select'>{validation(newPassword, passwordRegex.capital)}</Comp.P>
                            <Comp.P>ABC</Comp.P>
                          </div>
                          <div className={style.pass_element}>
                            <Comp.P className='no-select'>{validation(newPassword, passwordRegex.regular)}</Comp.P>
                            <Comp.P>abc</Comp.P>
                          </div>
                          <div className={style.pass_element}>
                            <Comp.P className='no-select'>{validation(newPassword, passwordRegex.number)}</Comp.P>
                            <Comp.P>123</Comp.P>
                          </div>
                          <div className={style.pass_element}>
                            <Comp.P className='no-select'>{validation(newPassword, passwordRegex.symbol)}</Comp.P>
                            <Comp.P>@#$</Comp.P>
                          </div>
                        </div>
                      </div>
                      <div>
                        <Comp.P>Must Contains:</Comp.P>
                        <div className={style.container}>
                          <div className={style.pass_element}>
                            <Comp.P className='no-select'>{validation(newPassword, passwordRegex.length)}</Comp.P>
                            <Comp.P>8~30 Chars</Comp.P>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <button className={style.submit} type="submit">Save</button>
                  </div>
                </form>
              </div>
            </SidebarTemplate>
          </div>
          <Footer />
        </div>
      </ThemeContext.Provider>
    </Auth.Protection>
  )
}