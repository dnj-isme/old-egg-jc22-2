import { DEFAULT_THEME, getTheme, Theme, ThemeContext, ThemeType } from '@/contexts/ThemeContext';
import { Auth } from '@/controller/Auth';
import { useRouter } from 'next/router';
import ShowNotification from '@/controller/NotificationController';
import { useEffect, useState } from 'react';
import Footer from '@/components/footer/footer';
import Navbar from '@/components/navbar/navbar';
import { ReactNotifications } from 'react-notifications-component';
import SidebarTemplate from '@/components/base';

export default function index() {
  // TODO: Your hooks starts here
  const router = useRouter() // For Navigating

  // TODO: Your useState starts here
  const [theme, setTheme] = useState<ThemeType>(DEFAULT_THEME)

  // TODO: Your useEffect starts here
  useEffect(() => {
    const sessionTheme = getTheme(localStorage.getItem('theme'))
    localStorage.setItem('theme', sessionTheme.className)
    setTheme(sessionTheme)
    ShowNotification('info', 'In Progress', 'This Page is still in progress...')
  }, [])

  // TODO: Your custom logic starts here...
  function test() {
    return 'Hello World!'
  }

  function changeTheme() {
    const newTheme = theme === Theme.DARK ? Theme.LIGHT : Theme.DARK
    localStorage.setItem('theme', newTheme.className)
    setTheme(newTheme)
    console.log(newTheme.background);
  }

  // TODO: Your React Element Starts here
  return (
    <Auth.Protection
      // TODO: Put Your Authentication Rule here...
      MustLogin
      MustBusiness
    >
      <ThemeContext.Provider value={theme}>
        <div className='main'>
          <ReactNotifications />
          <Navbar changeTheme={changeTheme}/>
          <SidebarTemplate>
            <div className='content' style={{backgroundColor: theme.background}}>
              
            </div>
          </SidebarTemplate>
          <Footer />
        </div>
      </ThemeContext.Provider>
    </Auth.Protection>
  )
}