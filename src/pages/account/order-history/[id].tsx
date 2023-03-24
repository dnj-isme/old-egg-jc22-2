import { DEFAULT_THEME, getTheme, Theme, ThemeContext, ThemeType } from '@/contexts/ThemeContext';
import { Auth } from '@/controller/Auth';
import { useRouter } from 'next/router';
import ShowNotification from '@/controller/NotificationController';
import { useEffect, useState } from 'react';
import Footer from '@/components/footer/footer';
import Navbar from '@/components/navbar/navbar';
import { ReactNotifications } from 'react-notifications-component';
import SidebarTemplate from '@/components/base';
import style from "./style.module.scss"
import { Comp } from '@/components/component';
import { GetServerSidePropsContext } from 'next';
import { Transaction } from '@/model/transaction';
import { SampleQuery } from '@/database/query';
import { From } from '@/database/api';
import { ProductCard } from '@/components/product/card';
interface Props {
  id: string,
  transaction?: Transaction
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const {query} = context

  let props: Props = {
    id: "",
  }

  if(query.id && !Array.isArray(query.id)) {
    const id = props.id = query.id

    const res = await From.Graphql.execute(SampleQuery.transaction, {id})
    if(res.success) {
      props.transaction = res.data
    }
  }
  
  return {props}
}

export default function OrderDetails(props: Props) {
  // TODO: Your hooks starts here
  const router = useRouter() // For Navigating

  // TODO: Your useState starts here
  const [theme, setTheme] = useState<ThemeType>(DEFAULT_THEME)

  const {transaction, id} = props

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
            <div className={style.content + ' center'}>
              <Comp.H1>Order Details</Comp.H1>
              <Comp.P>ID: {props.id}</Comp.P>
              <Comp.P>Created At : {props.transaction?.created_at}</Comp.P>
              <div className='grid'>
                {transaction?.details.map(d => <ProductCard.Transaction detail={d}/>)}
              </div>
            </div>
          </SidebarTemplate>
          <Footer />
        </div>
      </ThemeContext.Provider>
    </Auth.Protection>
  )
}