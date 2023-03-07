import { DEFAULT_THEME, getTheme, Theme, ThemeContext, ThemeType } from '@/contexts/ThemeContext';
import { Auth } from '@/controller/Auth';
import { useRouter } from 'next/router';
import ShowNotification from '@/controller/NotificationController';
import { useEffect, useState } from 'react';
import Footer from '@/components/footer/footer';
import Navbar from '@/components/navbar/navbar';
import { ReactNotifications } from 'react-notifications-component';
import { Button, Comp } from '@/components/component';
import Topbar from '@/components/shop/topbar/topbar';
import { Icon } from '@iconify/react';
import { ProductCard } from '@/components/product/card';

import style from "./index.module.scss"
import { Product } from '@/model/product';
import { From } from '@/database/api';
import { SampleQuery } from '@/database/query';
import { GetServerSidePropsContext } from 'next';

interface Props {
  products: Product[]
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const {query} = context
  
  let page = 1;
  let contentsPerPage = 20;
  if(query?.page && !Array.isArray(query.page)) {
    page = parseInt(query.page)
  }

  if(query?.contentsPerPage && !Array.isArray(query.contentsPerPage)) {
    contentsPerPage = parseInt(query.contentsPerPage)
  }
  
  let props: Props = {
    products: []
  }
  
  const res = await From.Graphql.execute(SampleQuery.products, {
    pagination: {
      page,
      contentsPerPage
    }
  })

  if(res.success) {
    props.products = res.data
  }

  return {
    props
  }
}

export default function index(props: Props) {
  // TODO: Your hooks starts here
  const router = useRouter() // For Navigating

  // TODO: Your useState starts here
  const [theme, setTheme] = useState<ThemeType>(DEFAULT_THEME)

  // TODO: Your useEffect starts here
  useEffect(() => {
    const sessionTheme = getTheme(localStorage.getItem('theme'))
    localStorage.setItem('theme', sessionTheme.className)
    setTheme(sessionTheme)
    console.log(props.products);  
  }, [])

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
      MustBusiness
    >
      <ThemeContext.Provider value={theme}>
        <div className='main'>
          <ReactNotifications />
          <div>
            <Navbar changeTheme={changeTheme}/>
            <Topbar />
          </div>
          <div className={style.content} style={{backgroundColor: theme.background}}>
            <Button.Blue onClick={_ => router.push("product/create")}>Create Product</Button.Blue>
            <div className={style.grid}>
              {/* Card Here */}
              {props.products.map(data => (
                <ProductCard.Style1 product={data} />
              ))}
            </div>
          </div>
          <Footer />
        </div>
      </ThemeContext.Provider>
    </Auth.Protection>
  )
}