import { DEFAULT_THEME, getTheme, Theme, ThemeContext, ThemeType } from '@/contexts/ThemeContext';
import { Auth } from '@/controller/Auth';
import { useRouter } from 'next/router';
import ShowNotification from '@/controller/NotificationController';
import { MouseEvent, useEffect, useState } from 'react';
import Footer from '@/components/footer/footer';
import Navbar from '@/components/navbar/navbar';
import { ReactNotifications } from 'react-notifications-component';
import { GetServerSidePropsContext } from 'next';
import { From } from '@/database/api';
import { SampleQuery } from '@/database/query';
import { Product } from '@/model/product';

import style from "./style.module.scss"
import { Button, Comp } from '@/components/component';
import { Icon } from '@iconify/react';
import { Account } from '@/model/account';
import { ProductCard } from '@/components/product/card';
import { ProductDisplay } from '@/components/product/product';
import { CartController } from '@/controller/CartController';

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

export default function ProductDetails(props: Product) {
  // TODO: Your hooks starts here
  const router = useRouter() // For Navigating

  // TODO: Your useState starts here
  const [theme, setTheme] = useState<ThemeType>(DEFAULT_THEME)

  // TODO: Your useEffect starts here
  useEffect(() => {
    if(!props.id) router.back()
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
      // MustLogin
    >
      <ThemeContext.Provider value={theme}>
        <div className='main' style={{backgroundColor: theme.background}}>
        <ReactNotifications />
        <Navbar changeTheme={changeTheme}/>
          {/* TODO: Your HTML code starts here */}
          <div className={style.content}>
            <div className={style.product}>
              <ProductDisplay.Detail product={props} />
            </div>
            <Comp.H1>You might also like</Comp.H1>
            <br />
            <div className={`${style.recommendation} grid`}>
              {props.category?.products?.map(product => {
                if (product.id != props.id)
                return (<ProductCard.Style1 product={product} />)
                else return null
              })}
            </div>
          </div>
        <Footer />
        </div>
      </ThemeContext.Provider>
    </Auth.Protection>
  )
}