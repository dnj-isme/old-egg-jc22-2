import { DEFAULT_THEME, getTheme, Theme, ThemeContext, ThemeType } from '@/contexts/ThemeContext';
import { Auth } from '@/controller/Auth';
import { useRouter } from 'next/router';
import ShowNotification, { NotificationTemplate } from '@/controller/NotificationController';
import { useEffect, useState } from 'react';
import Footer from '@/components/footer/footer';
import Navbar from '@/components/navbar/navbar';
import { ReactNotifications } from 'react-notifications-component';
import Sidebar from '@/components/admin/topbar/topbar';
import { Button, Comp } from '@/components/component';
import style from "./style.module.scss"
import StoreList from '@/components/admin/store/store_table';
import { From } from '@/database/api';
import { SampleQuery } from '@/database/query';
import { Account } from '@/model/account';
import { GetServerSidePropsContext } from 'next';
import { PaginationLink } from '@/components/pagination/pagination';
import CustomerList from '@/components/admin/Customers/customer_table';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const {query} = context
  
  let page = 1;
  let contentsPerPage = 20;
  if(query?.page) {
    if(!Array.isArray(query.page)) {
      page = parseInt(query.page)
    }
  }

  if(query?.contentsPerPage) {
    contentsPerPage = parseInt(query.contentsPerPage[0])
  }

  const res2 = await From.Rest.fetchData("/account/customers/count", "GET")

  let totalPages = 1;
  if(res2.success) {
    console.log(res2.data);
    totalPages = Math.ceil(res2.data.length / contentsPerPage)
  }
  else {
    console.error(res2.raw);
  }

  if(page < 0) {
    return {
      redirect: {
        permanent: false,
        destination: "/admin/customers?page=1"
      },
      props: {
        contentsPerPage
      }
    }
  }

  if(page > totalPages) {
    return {
      redirect: {
        permanent: false,
        destination: "/admin/customers?page=" + totalPages
      },
      props: {
        contentsPerPage
      }
    }
  }

  const res = await From.Graphql.execute(SampleQuery.customers, {
    pagination: {
      page,
      contentsPerPage
    }
  })

  let stores: Account[] = []
  if(res.success) {
    stores = res.data
  }
  else {
    NotificationTemplate.Error()
    console.error(res.raw);
  }

  const props: Params = {
    accounts: stores,
    page,
    totalPages
  }

  return {
    props // will be passed to the page component as props
  }
}

interface Params {
  accounts: Account[]
  page: number,
  totalPages: number
}

export default function Customers(props: Params) {
  // TODO: Your hooks starts here
  const router = useRouter() // For Navigating

  useEffect(() => console.log(props), [])

  // TODO: Your useState starts here
  const [theme, setTheme] = useState<ThemeType>(DEFAULT_THEME)

  // TODO: Your useEffect starts here
  useEffect(() => {
    const sessionTheme = getTheme(sessionStorage.getItem('theme'))
    sessionStorage.setItem('theme', sessionTheme.className)
    setTheme(sessionTheme)
  }, [])

  // TODO: Your custom logic starts here...

  function changeTheme() {
    const newTheme = theme === Theme.DARK ? Theme.LIGHT : Theme.DARK
    sessionStorage.setItem('theme', newTheme.className)
    setTheme(newTheme)
    console.log(newTheme.background);
  }

  // TODO: Your React Element Starts here
  return (
    <Auth.Protection
      // TODO: Put Your Authentication Rule here...
      MustAdmin
    >
      <ThemeContext.Provider value={theme}>
        <ReactNotifications />
        <div className='main' style={{backgroundColor: theme.background}}>
          <div>
            <Navbar changeTheme={changeTheme}/>
            <Sidebar />
          </div>
          <div className={style.content} style={{backgroundColor: theme.background}}>
            <div>
              <Comp.H1>Customer Accounts</Comp.H1>
            </div>
            <CustomerList customers={props.accounts} />
            <PaginationLink page={props.page} totalPages={props.totalPages} route="/admin/shop/"/>
          </div>
          <Footer />
        </div>
      </ThemeContext.Provider>
    </Auth.Protection>
  )
}