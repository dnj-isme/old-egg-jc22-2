import { DEFAULT_THEME, getTheme, ThemeContext, ThemeType } from '@/contexts/ThemeContext';
import { FormEvent, FormEventHandler, useEffect, useRef, useState } from 'react';
import Logo from "@/assets/images/logo.svg"
import Image from 'next/image';
import style from './style.module.scss'
import AuthFooter from '@/components/footer/auth_footer';
import { Comp } from '@/components/component';
import ShowNotification from '@/controller/NotificationController';
import { ReactNotifications } from 'react-notifications-component';
import { From } from '@/database/api';
import { useRouter } from 'next/router';
import Cookies from 'universal-cookie';

export default function SignUp() {
  const router = useRouter()

  const [theme, setTheme] = useState<ThemeType>(DEFAULT_THEME)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [subscribe, setSubscribe] = useState(false)

  const firstNameErr = useRef<HTMLParagraphElement>(null)
  const lastNameErr = useRef<HTMLParagraphElement>(null)
  const phoneErr = useRef<HTMLParagraphElement>(null)
  const emailErr = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const sessionTheme = getTheme(sessionStorage.getItem('theme'))
    sessionStorage.setItem('theme', sessionTheme.className)
    setTheme(sessionTheme)
  }, [])

  const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/
  const passwordRegex = {
    capital: /[A-Z]/,
    regular: /[a-z]/,
    number: /[0-9]/,
    symbol: /[\`\~\!\@\#\$\%\^\&\*\(\)\-\_\=\+\[\]\\\|\;\:\'\"\,\<\.\>\/\?]/,
    length: /^.{8,30}$/,
    all: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\`\~\!\@\#\$\%\^\&\*\(\)\-\_\=\+\[\]\\\|\;\:\'\"\,\<\.\>\/\?]).{8,30}$/
  }

  const phoneRegex = /^(0|\+)[1-9]\d{8,}$/

  function validation(input: string, regex: RegExp) {
    return regex.test(input) ? "✅" : "❌" 
  }

  async function handleSignUp(e: FormEvent) {
    e.preventDefault();

    let valid: boolean = true;
    
    if(firstName == "") {
      valid = false;
      if(firstNameErr.current) {
        firstNameErr.current.innerText = "First name must not empty!"
      }
    }
    
    if(lastName == "") {
      valid = false;
      if(lastNameErr.current) {
        lastNameErr.current.innerText = "Last name must not empty"
      }
    }

    if(phone == "") {
      valid = false;
      if(phoneErr.current) {
        phoneErr.current.innerText = "Phone must not empty"
      }
    }
    else if (!phoneRegex.test(phone)) {
      valid = false;
      if(phoneErr.current) {
        phoneErr.current.innerText = "Phone format isn't valid (should start with 0 or +)"
      }
    }

    if(email == "") {
      valid = false;
      if(emailErr.current) {
        emailErr.current.innerText = "Email must not empty"
      }
    }
    else if (!emailRegex.test(email)) {
      valid = false;
      if(emailErr.current) {
        emailErr.current.innerText = "Email format isn't valid"
      }
    }

    if(!passwordRegex.all.test(password)) {
      valid = false;
    }

    if(valid) {
      const res = await From.Rest.fetchData("/account/register", "POST", {
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone: phone,
        password: password,
        subscribe: subscribe
      });

      if(!res.success) {
        if(res.status === 412) 
          ShowNotification("danger", "Registration Error", res.data)
        else if(global.debug)
          ShowNotification("danger", "Error " + res.status, "Look console for details")
      }
      else {
        const cookie = new Cookies()
        cookie.set("token", res.data.token)
        global.register = true
        router.push("/auth/verify")
      }
    }
    else {
      ShowNotification("warning", "Field Issue", "Fix some input fields before continue...")
    }
  }

  return (
    <ThemeContext.Provider value={theme}>
      <ReactNotifications />
      <div className={'main flex-column justify-space-between ' + style.base} style={{backgroundColor: theme.background}}>
        <form method="post" onSubmit={handleSignUp} className="flex-column align-center">
          <div>
            <Comp.A href='/'><Image src={Logo} alt="logo" /></Comp.A>
          </div>
          <h1 style={{color: theme.textColor}}>Create Account</h1>
          <div>
            <Comp.P>Shopping for your business? <a style={{color: "#cc4e00"}} href='/business/signup'>Create a free business account</a>.</Comp.P>
          </div>
          <div>
            <input type="text" name="firstName" id="firstName" onChange={e => setFirstName(e.target.value)} placeholder="First Name"/>
            <p className='error' id='FirstNameError' ref={firstNameErr}></p>
          </div>
          <div>
            <input type="text" name="lastName" id="lastName" onChange={e => setLastName(e.target.value)} placeholder="Last Name"/>
            <p className='error' id='LastNameError' ref={lastNameErr}></p>
          </div>
          <div>
            <input type="text" name="phone" id="phone" onChange={e => setPhone(e.target.value)} placeholder="Phone Number"/>
            <p className='error' id='PhoneError' ref={phoneErr}></p>
          </div>
          <div>
            <input type="email" name="email" id="email" onChange={e => setEmail(e.target.value)} placeholder="Email Address"/>
            <p className='error' id='EmailError' ref={emailErr}></p>
          </div>
          <div id='password'>
            <input type="password" name="password" id="password" onChange={e => setPassword(e.target.value)} placeholder="Password"/>
            <div className={style.pass_error}>
              <div>
                <Comp.P>Including 3 of the following:</Comp.P>
                <div className={style.container}>
                  <div className={style.pass_element}>
                    <Comp.P className='no-select'>{validation(password, passwordRegex.capital)}</Comp.P>
                    <Comp.P>ABC</Comp.P>
                  </div>
                  <div className={style.pass_element}>
                    <Comp.P className='no-select'>{validation(password, passwordRegex.regular)}</Comp.P>
                    <Comp.P>abc</Comp.P>
                  </div>
                  <div className={style.pass_element}>
                    <Comp.P className='no-select'>{validation(password, passwordRegex.number)}</Comp.P>
                    <Comp.P>123</Comp.P>
                  </div>
                  <div className={style.pass_element}>
                    <Comp.P className='no-select'>{validation(password, passwordRegex.symbol)}</Comp.P>
                    <Comp.P>@#$</Comp.P>
                  </div>
                </div>
              </div>
              <div>
                <Comp.P>Must Contains:</Comp.P>
                <div className={style.container}>
                  <div className={style.pass_element}>
                    <Comp.P className='no-select'>{validation(password, passwordRegex.length)}</Comp.P>
                    <Comp.P>8~30 Chars</Comp.P>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <input className={style.checkbox} type="checkbox" name="subs" id="subs" onChange={_ => setSubscribe(!subscribe)}/>
            <label htmlFor='subs'><Comp.P className={style.inline}>Subscribe for exclusive e-mail offers and discounts</Comp.P></label>
          </div>
          <div>
            <Comp.P>By creating an account, you agree to Newegg’s <a>Privacy Notice</a> and <a>Terms of Use</a>.</Comp.P>
          </div>
          <div>
            <button className={style.submit} type="submit">SIGN UP</button>
          </div>
          <div>
            <Comp.P>Have an account? <Comp.A href='/auth/signin'>Sign In</Comp.A></Comp.P>
          </div>
        </form>
        <AuthFooter />
      </div>
    </ThemeContext.Provider>
  )
}