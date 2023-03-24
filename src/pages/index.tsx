import { Button, Comp } from '@/components/component'
import Footer from '@/components/footer/footer'
import Banner from '@/components/home/banner'
import TopProduct from '@/components/home/top_product'
import Navbar from '@/components/navbar/navbar'
import { ProductCard } from '@/components/product/card'
import { DEFAULT_THEME, getTheme, Theme, ThemeContext, ThemeType } from '@/contexts/ThemeContext'
import { Auth } from '@/controller/Auth'
import ShowNotification from '@/controller/NotificationController'
import ParsePagination from '@/controller/ParseFilter'
import { emailRegex } from '@/controller/Regex'
import { From } from '@/database/api'
import { SampleQuery } from '@/database/query'
import { Product } from '@/model/product'
import { Icon } from '@iconify/react'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { FormEvent, Suspense, useEffect, useRef, useState } from 'react'
import { ReactNotifications } from 'react-notifications-component'

export default function HomePage() {
  const [theme, setTheme] = useState<ThemeType>(DEFAULT_THEME)
  const [email, setEmail] = useState('')

  useEffect(() => {
    if(global.signin && Auth.getToken() != null) {
      global.signin = false
      ShowNotification("success", "Success", "Login Succeed!")
    }
    if(global.unauthorized) {
      global.unauthorized = false;
      ShowNotification("danger", "Unauthorized", "You don't have access to the site")
    }
    if(global.checkout) {
      global.checkout = false;
      ShowNotification("success", "Checkout Completed", "Your order is saved and processed by system")
    }
    if(global.logout) {
      global.logout = false;
      ShowNotification("info", "Logout", "Your account is logged out successfully!");
    }
    if(global.forceLogout) {
      global.forceLogout = false;
      ShowNotification("danger", "Account logged out", "Your account is logged out due to inactivity")
    }

    const sessionTheme = getTheme(localStorage.getItem('theme'))
    localStorage.setItem('theme', sessionTheme.className)
    setTheme(sessionTheme)
  }, [])

  async function handleSubscribe(e: FormEvent) {
    e.preventDefault()
    
    if(email == '') {
      ShowNotification("danger", "Error", "Email cannot be empty!")
      return
    }
    if(!emailRegex.test(email)) {
      ShowNotification("danger", "Error", "Email must be in valid format!")
      return
    }

    const res = await From.Rest.fetchData("/subscribe", "POST", {
      email
    })

    if(res.success) {
      ShowNotification("success", "Success", res.data.status)
    }
    else {
      ShowNotification("danger", "Failed", res.data)
    }
  }

  function changeTheme() {
    const newTheme = theme === Theme.DARK ? Theme.LIGHT : Theme.DARK
    localStorage.setItem('theme', newTheme.className)
    setTheme(newTheme)
  }

  return (
    <ThemeContext.Provider value={theme}>
      <ReactNotifications />
      <div style={{backgroundColor: theme.background}} className='main'>
        <Navbar changeTheme={changeTheme}/>
        <div className='content' style={{backgroundColor: theme.background}}>
          <Banner />
          <div style={{padding: "3rem"}}>
            <Comp.H1>Recommended Products</Comp.H1>
            <TopProduct />
          </div>
          <form className='center' onSubmit={handleSubscribe}>
            <Comp.H2>Subscribe to newsletter</Comp.H2>
            <div>
              <input type="email" name="email" id="email" placeholder='email' onChange={e => setEmail(e.target.value)}/>
              <Button.Send />
            </div>
          </form>
        </div>
        <Footer />
      </div>
    </ThemeContext.Provider>
  )
}