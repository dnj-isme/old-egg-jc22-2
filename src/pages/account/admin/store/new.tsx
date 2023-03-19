import { DEFAULT_THEME, getTheme, Theme, ThemeContext, ThemeType } from '@/contexts/ThemeContext';
import { Auth } from '@/controller/Auth';
import { useRouter } from 'next/router';
import ShowNotification, { NotificationTemplate } from '@/controller/NotificationController';
import { FormEvent, MouseEvent, useEffect, useRef, useState } from 'react';
import Footer from '@/components/footer/footer';
import Navbar from '@/components/navbar/navbar';
import { ReactNotifications } from 'react-notifications-component';
import { Button, Comp } from '@/components/component';
import style from "./style.module.scss"
import { APIResponse, From } from '@/database/api';
import { emailRegex, passwordRegex, phoneRegex } from '@/controller/Regex';

export default function index() {
  // TODO: Your hooks starts here
  const router = useRouter() // For Navigating

  // TODO: Your useState starts here
  const [theme, setTheme] = useState<ThemeType>(DEFAULT_THEME)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

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

  async function handleCreateAccount(e: FormEvent) {
    e.preventDefault()

    let valid: boolean = true;
    
    if(name == "") {
      valid = false;
      ShowNotification("danger", "Error", "Name must not empty")
    }
    
    if(phone == "") {
      valid = false;
      ShowNotification("danger", "Error", "Phone must not empty")
    }
    else if (!phoneRegex.test(phone)) {
      valid = false;
      ShowNotification("danger", "Error", "Phone must in valid format")
    }
    
    if(email == "") {
      valid = false;
      ShowNotification("danger", "Error", "Email must in valid format")
    }
    else if (!emailRegex.test(email)) {
      valid = false;
      ShowNotification("danger", "Error", "Email format isn't valid")
    }

    if(!passwordRegex.length.test(password)) {
      valid = false;
      ShowNotification("danger", "Error", "Password length must between 8 to 30")
    }

    if(valid) {
      let res: APIResponse = await From.Rest.fetchData("/account/business/", "POST", {
        name: name,
        email: email,
        phone: phone,
        password: password,
      }, Auth.getToken())

      if(!res.success) {
        if(res.status === 412) 
          ShowNotification("danger", "Registration Error", res.data)
        else if(global.debug)
          ShowNotification("danger", "Error " + res.status, "Look console for details")
      }
      else {
        global.register = true
        router.back()
      }
    }
    else {
      ShowNotification("warning", "Field Issue", "Fix some input fields before continue...")
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
          <div className={style.content} style={{backgroundColor: theme.background}}>
            <Comp.H1>Create Account</Comp.H1>
            
            <form method='POST' onSubmit={handleCreateAccount} className="flex-column align-center" >
              <table> <tbody>
                <tr>
                  <td><label htmlFor='name' style={{color: theme.textColor}}>Business Name</label></td>
                  <td><input type="text" name="name" id="name" onChange={e => setName(e.target.value)} placeholder="Business Name"/></td>
                </tr>
                <tr>
                  <td><label htmlFor='phone' style={{color: theme.textColor}}>Phone Number</label></td>
                  <td><input type="text" name="phone" id="phone" onChange={e => setPhone(e.target.value)} placeholder="Phone Number"/></td>
                </tr>
                <tr>
                  <td><label htmlFor='email' style={{color: theme.textColor}}>Email</label></td>
                  <td><input type="text" name="email" id="email" onChange={e => setEmail(e.target.value)} placeholder="Email"/></td>
                </tr>
                <tr>
                  <td><label htmlFor='password' style={{color: theme.textColor}}>Password</label></td>
                  <td><input type="password" name="password" id="password" onChange={e => setPassword(e.target.value)} placeholder="Email"/></td>
                </tr>
              </tbody> </table>

              <Button.Submit>Submit</Button.Submit>
            </form>
          </div>
          <Footer />
        </div>
      </ThemeContext.Provider>
    </Auth.Protection>
  )
}