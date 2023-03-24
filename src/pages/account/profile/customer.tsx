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
import { Account } from '@/model/account';
import { From } from '@/database/api';

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

  useEffect(() => {
    if(account) {
      setFirstName(account.first_name)
      setLastName(account.last_name)
      setEmail(account.email)
      setPhone(account.phone)
    }
  }, [account])

  async function fetchAccount() {
    const account = await Auth.getActiveAccount()
    setAccount(account)

    if(!account) {
      ShowNotification("danger", "Error", "failed to fetch data!")
    }
  }

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')

  // TODO: Your custom logic starts here...

  function changeTheme() {
    const newTheme = theme === Theme.DARK ? Theme.LIGHT : Theme.DARK
    localStorage.setItem('theme', newTheme.className)
    setTheme(newTheme)
    console.log(newTheme.background);
  }

  async function saveNewProfile(e: FormEvent) {
    e.preventDefault()

    const res = await From.Rest.fetchData("/account", "PATCH", {
      account_id: account?.id,
      password,
      first_name: firstName,
      last_name: lastName,
      email,
      phone
    })

    if(res.success) {
      ShowNotification("success", "Success", res.data.status)
      Auth.setToken(res.data.token)
    }
    else {
      ShowNotification("danger", "Failed!", res.data)
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
          <SidebarTemplate>
            <div className='center'>
              <Comp.H1>Profile Page</Comp.H1>
              <form onSubmit={saveNewProfile} className="center">
                <table>
                  <tbody>
                    <tr>
                      <td><Comp.Label htmlFor="first_name">First Name</Comp.Label></td>
                      <td><input id='first_name' type="text" value={firstName} onChange={e => setFirstName(e.target.value)}/></td>
                    </tr>
                    <tr>
                      <td><Comp.Label htmlFor="last_name">Last Name</Comp.Label></td>
                      <td><input id='last_name' type="text" value={lastName} onChange={e => setLastName(e.target.value)}/></td>
                    </tr>
                    <tr>
                      <td><Comp.Label htmlFor="email">Email</Comp.Label></td>
                      <td><input id='email' type="text" value={email} onChange={e => setEmail(e.target.value)}/></td>
                    </tr>
                    <tr>
                      <td><Comp.Label htmlFor="phone">Phone</Comp.Label></td>
                      <td><input id='phone' type="text" value={phone} onChange={e => setPhone(e.target.value)}/></td>
                    </tr>
                    <tr>
                      <td><Comp.Label htmlFor="password">Password</Comp.Label></td>
                      <td><input id='password' type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder='Input Password to Proceed'/></td>
                    </tr>
                    <tr>
                      <td><Comp.P>Egg Currency</Comp.P></td>
                      <td><Comp.P>{account?.egg_currency}</Comp.P></td>
                    </tr>
                  </tbody>
                </table>
                <Button.Save />
              </form>
            </div>
          </SidebarTemplate>
          <Footer />
        </div>
      </ThemeContext.Provider>
    </Auth.Protection>
  )
}