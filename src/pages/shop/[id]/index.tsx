import { DEFAULT_THEME, getTheme, Theme, ThemeContext, ThemeType } from '@/contexts/ThemeContext';
import { Auth } from '@/controller/Auth';
import { useRouter } from 'next/router';
import ShowNotification from '@/controller/NotificationController';
import { useEffect, useState } from 'react';
import Footer from '@/components/footer/footer';
import Navbar from '@/components/navbar/navbar';
import { ReactNotifications } from 'react-notifications-component';
import { Button, Comp } from '@/components/component';
import { StoreDetail } from '@/model/store';
import { From } from '@/database/api';
import { GetServerSidePropsContext } from 'next';
import { SampleQuery } from '@/database/query';

import style from "./style.module.scss"
import { Icon } from '@iconify/react';
import Topbar from '@/components/shop/topbar/topbar';
import CategoryCard from '@/components/shop/category/category';
import { ProductCard } from '@/components/product/card';
import { GetStars } from '@/controller/Utility';

interface Props {
  store: StoreDetail | null
  rating: number
  total: number
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const {query} = context

  const id = query.id

  let props: Props = {
    store: null,
    rating: 0,
    total: 0
  }

  if(id && !Array.isArray(id)) {
    const res = await From.Graphql.execute(SampleQuery.storeDetail, {id})
    if(res.success) {
      props.store = res.data
    }

    if(props.store && props.store.reviews) {
      let sum = 0
      props.total = props.store.reviews.length

      if(props.total > 0) {
        props.store.reviews.forEach(rev => {
          sum += rev.rating
        });
        props.rating = Math.round(sum / props.total * 100) / 100
      }
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

  // TODO: Your useEffect starts here
  useEffect(() => {
    const sessionTheme = getTheme(localStorage.getItem('theme'))
    localStorage.setItem('theme', sessionTheme.className)
    setTheme(sessionTheme)
    console.log({store, props});

    (async function test() {
      console.log((await From.Graphql.execute(SampleQuery.storeDetail, {id: "0980acde-8e55-47e7-956c-bd6ad81849c8"})).data)
    })()
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
            <div className={style.profile_container}>
              <div className={style.profile}>
                <Icon icon="ic:baseline-account-circle" className={style.icon} style={{color: theme.textColor}}/>
                <div>
                  <Comp.H1>{store?.account.first_name}</Comp.H1>
                  <Comp.P>{store?.account.email}</Comp.P>
                  <Comp.P>{store?.account.phone}</Comp.P>
                  {
                    props.rating != 0 ? 
                    <Comp.P>{GetStars(props.rating)} ({props.rating} / 5.00)</Comp.P>
                    : null
                  }
                </div>
              </div>
            </div>
            <Topbar id={store ? store.account.id : '#NA'} />
            <div className={style.center}>
              <div className={style.center}>
                <Comp.H1>Store by Category ID</Comp.H1>
                {
                  store ?
                  <div className='grid' style={{width: '100vw'}}>
                    {store.categories?.map(e => {
                      return <CategoryCard category={e} shop={store} />
                    })}
                  </div>
                  : <></>
                }
              </div>
            </div>
            <div className={style.center}>
              <Comp.H1>Recomended Products</Comp.H1>
              <div className='grid' style={{width: '100vw'}}>
                {store?.products?.map((product, index) => {
                  if(index < 5) 
                    return <ProductCard.Style1 product={product} route={"/product/"}/> 
                })}
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </ThemeContext.Provider>
    </Auth.Protection>
  )
}