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
import { GetStars } from '@/controller/Utility';
import SidebarTemplate from '@/components/base';

interface Props {
  store?: StoreDetail,
  average: number,
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const {query} = context

  const id = query.id

  let props: Props = {
    store: undefined,
    average: 0
  }

  if(id && !Array.isArray(id)) {
    const res = await From.Graphql.execute(SampleQuery.storeDetail, {id})
    if(res.success) {
      props.store = res.data

      if(props.store) {
        let sum = 0;
        let count = props.store.reviews.length
        if(count > 0) {
          props.store.reviews.forEach(r => {
            sum += r.rating
          })
          props.average = sum / count
        }
      }
    }
  }

  return {
    props
  }
}

export default function ShopDetails(props: Props) {
  // TODO: Your hooks starts here

  const {store} = props

  // TODO: Your useState starts here
  const [theme, setTheme] = useState<ThemeType>(DEFAULT_THEME)

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
              <div className={style.profile_head}>
                <div className={style.profile}>
                  <Icon icon="ic:baseline-account-circle" className={style.icon} style={{color: theme.textColor}}/>
                  <div>
                    <Comp.H1>{store?.account.first_name}</Comp.H1>
                    <Comp.P>{store?.account.email}</Comp.P>
                    <Comp.P>{store?.account.phone}</Comp.P>
                    {
                      props.average != 0 ? 
                      <Comp.P>{GetStars(props.average)} ({props.average} / 5.00)</Comp.P>
                      : null
                    }
                  </div>
                </div>
                <Comp.H2>{props.store?.sales} sale(s)</Comp.H2>
              </div>
              <div className={style.description}>
                <Comp.H1 className={style.title}>About Us</Comp.H1>
                <Comp.P>{props.store?.about}</Comp.P>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </ThemeContext.Provider>
    </Auth.Protection>
  )
}