import { DEFAULT_THEME, getTheme, Theme, ThemeContext, ThemeType } from '@/contexts/ThemeContext';
import { Auth } from '@/controller/Auth';
import { useRouter } from 'next/router';
import ShowNotification from '@/controller/NotificationController';
import { useEffect, useState } from 'react';
import Footer from '@/components/footer/footer';
import Navbar from '@/components/navbar/navbar';
import { ReactNotifications } from 'react-notifications-component';
import { Comp } from '@/components/component';
import { StoreDetail } from '@/model/store';
import { From } from '@/database/api';
import { GetServerSidePropsContext } from 'next';
import { SampleQuery } from '@/database/query';

import style from "./style.module.scss"
import { Icon } from '@iconify/react';
import Topbar from '@/components/shop/topbar/topbar';

interface Props {
  store?: StoreDetail
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const {query} = context

  const id = query.id

  let props: Props = {
    store: undefined
  }

  if(id && !Array.isArray(id)) {
    const res = await From.Graphql.execute(SampleQuery.storeDetail, {id})
    if(res.success) {
      props.store = res.data
    }
  }

  return {
    props
  }
}

export default function ShopDetails(props: Props) {
  // TODO: Your hooks starts here
  const router = useRouter() // For Navigating

  const {store} = props

  // TODO: Your useState starts here
  const [theme, setTheme] = useState<ThemeType>(DEFAULT_THEME)
  const [storeDetail, setStoreDetail] = useState<StoreDetail | null>()

  // TODO: Your useEffect starts here
  useEffect(() => {
    const sessionTheme = getTheme(localStorage.getItem('theme'))
    localStorage.setItem('theme', sessionTheme.className)
    setTheme(sessionTheme)
    console.log({store, props});
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
      // MustLogin
    >
      <ThemeContext.Provider value={theme}>
        <ReactNotifications />
        <div className='main' style={{backgroundColor: theme.background}}>
          <Navbar changeTheme={changeTheme}/>
          <div className={style.content}>
            <div>
              <img src={store?.banner} className={style.banner}/>
            </div>
            <div>
              <Topbar id={store ? store.account.id : '#NA'} />
            </div>
            <div className={style.about}>
              <Comp.H1>Return Policy</Comp.H1>
              <Comp.P>{props.store?.return_policy}</Comp.P>
            </div>
          </div>
          <Footer />
        </div>
      </ThemeContext.Provider>
    </Auth.Protection>
  )
}