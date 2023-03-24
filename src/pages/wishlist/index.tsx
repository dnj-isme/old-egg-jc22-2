import { DEFAULT_THEME, getTheme, Theme, ThemeContext, ThemeType } from '@/contexts/ThemeContext';
import { Auth } from '@/controller/Auth';
import { useRouter } from 'next/router';
import ShowNotification from '@/controller/NotificationController';
import { useEffect, useState } from 'react';
import Footer from '@/components/footer/footer';
import Navbar from '@/components/navbar/navbar';
import { ReactNotifications } from 'react-notifications-component';
import { Comp } from '@/components/component';
import { GetServerSidePropsContext } from 'next';
import { Wishlist } from '@/model/wishlist';
import { From } from '@/database/api';
import { SampleQuery } from '@/database/query';
import WishlistCard from '@/components/wishlist/wishlist';
import { PaginationLink } from '@/components/pagination/pagination';
import { Pagination } from '@/model/filtering';
import ParsePagination from '@/controller/ParseFilter';
import WishlistSidebarTemplate from '../../components/wishlist/sidebar/sidebar';
interface Props {
  wishlists: Wishlist[],
  pagination: Pagination,
  totalPages: number
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const {query} = context

  const pagination = ParsePagination(query)
  let search = ''

  let props: Props = {
    wishlists: [],
    pagination,
    totalPages: 0
  }

  if(query.search && !Array.isArray(query.search)) {
    search = query.search
  }

  const res = await From.Graphql.execute(SampleQuery.wishlists, {pagination, filter: {search}})
  
  if(res.success) {
    props.wishlists = res.data
  }

  const res2 = await From.Graphql.execute(SampleQuery.countWishlist,{filter: {search}})

  if(res2.success) {
    props.totalPages = Math.ceil(res2.data / pagination.contentsPerPage)
  }

  return {props}
}

export default function index(props: Props) {
  // TODO: Your hooks starts here
  const router = useRouter() // For Navigating

  const {wishlists} = props

  // TODO: Your useState starts here
  const [theme, setTheme] = useState<ThemeType>(DEFAULT_THEME)

  // TODO: Your useEffect starts here
  useEffect(() => {
    const sessionTheme = getTheme(localStorage.getItem('theme'))
    localStorage.setItem('theme', sessionTheme.className)
    setTheme(sessionTheme)
    console.log(props);

    
    From.Graphql.execute(SampleQuery.countWishlist).then(res => console.log(res.data))

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
          <WishlistSidebarTemplate>
            <div className='center'>
              <Comp.H1>Public Wish List</Comp.H1>
              {
                wishlists.length == 0 ? <Comp.H2>No Data</Comp.H2> : 
                <div className='grid' style={{width: "70vw"}}>
                  {
                    wishlists.map(e => <WishlistCard wishlist={e} onClick={_ => router.push("/wishlist/" + e.id)}/>)
                  }
                </div>
              }
              <PaginationLink pagination={props.pagination} totalPages={props.totalPages} />
            </div>
          </WishlistSidebarTemplate>
          <Footer />
        </div>
      </ThemeContext.Provider>
    </Auth.Protection>
  )
}