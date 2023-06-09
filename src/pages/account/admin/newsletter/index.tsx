import { DEFAULT_THEME, getTheme, Theme, ThemeContext, ThemeType } from '@/contexts/ThemeContext';
import { Auth } from '@/controller/Auth';
import { useRouter } from 'next/router';
import ShowNotification from '@/controller/NotificationController';
import { FormEvent, useEffect, useState } from 'react';
import Footer from '@/components/footer/footer';
import Navbar from '@/components/navbar/navbar';
import { ReactNotifications } from 'react-notifications-component';
import SidebarTemplate from '@/components/base';
import { Button, Comp } from '@/components/component';
import { From } from '@/database/api';

export default function index() {
  // TODO: Your hooks starts here
  const router = useRouter() // For Navigating

  // TODO: Your useState starts here
  const [theme, setTheme] = useState<ThemeType>(DEFAULT_THEME)
  const [header, setHeader] = useState('')
  const [body, setBody] = useState('')

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
    const res = await From.Rest.fetchData("/newsletter", "POST", {
      header,
      body
    }, Auth.getToken())
    if(res.success) {
      ShowNotification("success", "Success", res.data.status)
    }
    else {
      ShowNotification("danger", "Error", res.data)
      console.error(res.data);
    }
  }

  // TODO: Your React Element Starts here
  return (
    <Auth.Protection
      // TODO: Put Your Authentication Rule here...
      MustLogin
      MustAdmin
    >
      <ThemeContext.Provider value={theme}>
        <ReactNotifications />
        <div className='main' style={{backgroundColor: theme.background}}>
          <Navbar changeTheme={changeTheme}/>
          <SidebarTemplate>
            <div className='center'>
              <Comp.H1>Manage News Letter</Comp.H1>
              <form className='center' onSubmit={handleSubmit}>
                <table>
                  <tbody>
                    <tr>
                      <td><Comp.Label htmlFor="header">Email Header</Comp.Label></td>
                      <td><input type="text" name="header" id="header" onChange={e => setHeader(e.target.value)} /></td>
                    </tr>
                    <tr>
                      <td><Comp.Label htmlFor="body">Email Body</Comp.Label></td>
                      <td><textarea id='body' onChange={e => setBody(e.target.value)}/></td>
                    </tr>
                  </tbody>
                </table>
                <Button.Blue type='submit'>Send Email</Button.Blue>
              </form>
            </div>
          </SidebarTemplate>          
          <Footer />
        </div>
      </ThemeContext.Provider>
    </Auth.Protection>
  )
}