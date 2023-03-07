import { DEFAULT_THEME, getTheme, Theme, ThemeContext, ThemeType } from '@/contexts/ThemeContext';
import { Auth } from '@/controller/Auth';
import { useRouter } from 'next/router';
import ShowNotification from '@/controller/NotificationController';
import { useEffect, useState } from 'react';
import Footer from '@/components/footer/footer';
import Navbar from '@/components/navbar/navbar';
import { ReactNotifications } from 'react-notifications-component';
import { GetServerSidePropsContext } from 'next';
import { Product } from '@/model/product';
import { From } from '@/database/api';
import { SampleQuery } from '@/database/query';
import { Account } from '@/model/account';
import SidebarTemplate from '@/components/base';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const {query} = context

  const id = query.id

  const res = await From.Graphql.execute(SampleQuery.productByID, {id});

  let props: Product = {
    category_id: "",
    description: "",
    discount: 0,
    product_name: "",
    product_price: 0,
    product_stock: 0,
    store_id: "",
  }

  if(res.success && res.data) {
    props = res.data
  }

  return {
    props
  }
}

export default function ManageProductDetails(props: Product) {
  // TODO: Your hooks starts here
  const router = useRouter()

  // TODO: Your useState starts here
  const [theme, setTheme] = useState<ThemeType>(DEFAULT_THEME)
  const [account, setAccount] = useState<Account | null>(null)
  const [loading, setLoading] = useState(true)

  // TODO: Your useEffect starts here
  useEffect(() => {
    if(props.id == "") router.back()
    const sessionTheme = getTheme(localStorage.getItem('theme'))
    localStorage.setItem('theme', sessionTheme.className)
    setTheme(sessionTheme)

    fetchAccount()
  }, [])

  async function fetchAccount() {
    setLoading(true)
    setAccount(await Auth.getActiveAccount())
    setLoading(false)
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
      MustLogin
      MustBusiness
      CustomRule={loading || (account != null && account.id == props.id)}
    >
      <ThemeContext.Provider value={theme}>
        <ReactNotifications />
        <div className='main' style={{backgroundColor: theme.background}}>
          <Navbar changeTheme={changeTheme}/>
          <SidebarTemplate>
            
          </SidebarTemplate>
          <Footer />
        </div>
      </ThemeContext.Provider>
    </Auth.Protection>
  )
}