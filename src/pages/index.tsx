import Footer from '@/components/footer/footer'
import Banner from '@/components/home/banner'
import Navbar from '@/components/navbar/navbar'
import { Account, AccountContext } from '@/contexts/AccountContext'
import { DEFAULT_THEME, getTheme, Theme, ThemeContext, ThemeType } from '@/contexts/ThemeContext'
import { Auth } from '@/controller/Auth'
import ShowNotification from '@/controller/NotificationController'
import { useEffect, useState } from 'react'
import { ReactNotifications } from 'react-notifications-component'


export default function HomePage() {
  const [theme, setTheme] = useState<ThemeType>(DEFAULT_THEME)
  const [account, setAccount] = useState<Account | null>(null)
  let hasDone = false;
  
  useEffect(() => {
    if(global.signin && Auth.getToken() != null) {
      hasDone = true
      global.signin = false
      ShowNotification("success", "Success", "Login Succeed!")
    }
    if(global.unauthorized) {
      global.unauthorized = false;
      ShowNotification("danger", "Unauthorized", "You don't have access to the site")
    }
    if(global.logout) {
      global.logout = false;
      ShowNotification("info", "Logout", "Your account is logged out successfully!");
    }
    getUserContext()
    const sessionTheme = getTheme(sessionStorage.getItem('theme'))
    sessionStorage.setItem('theme', sessionTheme.className)
    setTheme(sessionTheme)
  }, [])

  async function getUserContext() {
    const active = await Auth.getActiveAccount();
    setAccount(active)
  }  

  function changeTheme() {
    const newTheme = theme === Theme.DARK ? Theme.LIGHT : Theme.DARK
    sessionStorage.setItem('theme', newTheme.className)
    setTheme(newTheme)
  }

  return (
    <AccountContext.Provider value={account}>
      <ThemeContext.Provider value={theme}>
        <ReactNotifications />
        <div style={{backgroundColor: theme.background}} className='main'>
          <Navbar changeTheme={changeTheme}/>
          <div className='content' style={{backgroundColor: theme.background}}>
            <Banner />
          </div>
          <Footer />
        </div>
      </ThemeContext.Provider>
    </AccountContext.Provider>
  )
}