import { DEFAULT_THEME, getTheme, Theme, ThemeContext, ThemeType } from '@/contexts/ThemeContext';
import { Auth } from '@/controller/Auth';
import { useRouter } from 'next/router';
import ShowNotification from '@/controller/NotificationController';
import { useEffect, useState } from 'react';
import Footer from '@/components/footer/footer';
import Navbar from '@/components/navbar/navbar';
import { ReactNotifications } from 'react-notifications-component';
import SidebarTemplate from '@/components/base';
import { Comp } from '@/components/component';
import { Account } from '@/model/account';

export default function customer() {
  // TODO: Your hooks starts here
  const router = useRouter() // For Navigating

  // TODO: Your useState starts here
  const [theme, setTheme] = useState<ThemeType>(DEFAULT_THEME)
  const [account, setAccount] = useState<Account | null>()

  // TODO: Your useEffect starts here
  useEffect(() => {
    const sessionTheme = getTheme(localStorage.getItem('theme'))
    localStorage.setItem('theme', sessionTheme.className)
    setTheme(sessionTheme)
    fetchAccount()
  }, [])

  async function fetchAccount() {
    const account = await Auth.getActiveAccount()
    setAccount(account)

    if(!account) {
      ShowNotification("danger", "Error", "failed to fetch data!")
    }
  }

  // TODO: Your custom logic starts here...

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
    >
      <ThemeContext.Provider value={theme}>
        <ReactNotifications />
        <div className='main' style={{backgroundColor: theme.background}}>
          <Navbar changeTheme={changeTheme}/>
          <SidebarTemplate>
            <div className='center'>
              <Comp.H1>Profile Page</Comp.H1>
              <table>
                <tbody>
                  <tr>
                    <td><label htmlFor="first_name">First Name</label></td>
                    <td><input id='first_name' type="text" value={account?.first_name}/></td>
                  </tr>
                  <tr>
                    <td><label htmlFor="last_name">Last Name</label></td>
                    <td><input id='last_name' type="text" value={account?.last_name}/></td>
                  </tr>
                  <tr>
                    <td><label htmlFor="email">Email</label></td>
                    <td><input id='email' type="text" value={account?.email}/></td>
                  </tr>
                  <tr>
                    <td><label htmlFor="phone">Phone</label></td>
                    <td><input id='phone' type="text" value={account?.first_name}/></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </SidebarTemplate>
          <Footer />
        </div>
      </ThemeContext.Provider>
    </Auth.Protection>
  )
}