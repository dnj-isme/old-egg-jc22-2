import {useState, useEffect} from 'react'
import AccountAuthentication from '../controller/AccountAuthentication'
import { Account, AccountRole } from '../model/Account'
import Footer from './footer'
import Navbar from './navbar'

export const Template = (function() {
  function WithAuth({role, children, ...args} : {role: AccountRole | undefined, children: JSX.Element}) {
    const [account, setAccount] = useState<undefined | Account>(undefined)

    useEffect(effect, [])
    
    function effect() {
      fetchAccount()
    }

    async function fetchAccount() {
      // TODO: Find a way to get the account
      
    }
  
    return (
      <AccountAuthentication currentAccount={account} expectedRole={role}>
        <body>
          <Navbar />
          <div className='content' {...args}>
            {children}
          </div>
          <Footer />
        </body>
      </AccountAuthentication>
    )
  }
  
  function NoAuth({children, ...args} : {children: JSX.Element}) {
    return (
      <>
        <Navbar />
        <div className='content' {...args}>
          {children}
        </div>
        <Footer />
      </>
    )
  }

  return {
    NoAuth, WithAuth
  }
})()
