import { DEFAULT_THEME, getTheme, Theme, ThemeContext, ThemeType } from '@/contexts/ThemeContext';
import { Auth } from '@/controller/Auth';
import { useRouter } from 'next/router';
import ShowNotification, { NotificationTemplate } from '@/controller/NotificationController';
import { useEffect, useState } from 'react';
import Footer from '@/components/footer/footer';
import Navbar from '@/components/navbar/navbar';
import { ReactNotifications } from 'react-notifications-component';
import { Button, Comp } from '@/components/component';
import style from "./style.module.scss"
import StoreList from '@/components/admin/store/store_table';
import { From } from '@/database/api';
import { SampleQuery } from '@/database/query';
import { Account } from '@/model/account';
import { GetServerSidePropsContext } from 'next';
import { PaginationLink } from '@/components/pagination/pagination';
import ParsePagination, { ParseFilter } from '@/controller/ParseFilter';
import SidebarTemplate from '@/components/base';
import { FilterInput, Pagination } from '@/model/filtering';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const {query} = context
  
  const pagination = ParsePagination(query)
  const filter = ParseFilter(query)

  const res2 = await From.Rest.fetchData("/account/business/count", "GET")

  let totalPages = 1;
  if(res2.success) {
    console.log(res2.data);
    totalPages = Math.ceil(res2.data.length / pagination.contentsPerPage)
  }
  else {
    console.error(res2.raw);
  }

  if(pagination.page < 0) {
    return {
      redirect: {
        permanent: false,
        destination: "?page=1"
      },
      props: {
        contentsPerPage: pagination.contentsPerPage
      }
    }
  }

  if(pagination.page > totalPages) {
    return {
      redirect: {
        permanent: false,
        destination: "?page=" + totalPages
      },
      props: {
        contentsPerPage: pagination.contentsPerPage
      }
    }
  }

  const res = await From.Graphql.execute(SampleQuery.stores, {
    pagination
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
    pagination,
    totalPages,
    filter
  }

  return {
    props 
  }
}

interface Params {
  accounts: Account[],
  pagination: Pagination,
  totalPages: number,
  filter: FilterInput
}

export default function Shop(props: Params) {
  // TODO: Your hooks starts here
  const router = useRouter() // For Navigating

  useEffect(() => console.log(props), [])

  // TODO: Your useState starts here
  const [theme, setTheme] = useState<ThemeType>(DEFAULT_THEME)

  // TODO: Your useEffect starts here
  useEffect(() => {
    if(global.ban) {
      ShowNotification("success", "Success", "Shop Banned Successfully!")
      global.ban = false;
    }
    if(global.unban) {
      ShowNotification("success", "Success", "Shop Unbanned Successfully!")
      global.unban = false;
    }
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
      MustAdmin
    >
      <ThemeContext.Provider value={theme}>
        <ReactNotifications />
        <div className='main' style={{backgroundColor: theme.background}}>
          <Navbar changeTheme={changeTheme}/>
          <SidebarTemplate>
            <div className={style.content} style={{backgroundColor: theme.background}}>
              <div>
                <Comp.H1>Shop Account</Comp.H1>
              </div>
              <div>
                <Button.Blue onClick={_ => router.push("store/new")}>Add Shop</Button.Blue>
              </div>
              <StoreList stores={props.accounts} />
              <PaginationLink pagination={props.pagination} totalPages={props.totalPages} filter={props.filter}/>
            </div>
          </SidebarTemplate>
          <Footer />
        </div>
      </ThemeContext.Provider>
    </Auth.Protection>
  )
}