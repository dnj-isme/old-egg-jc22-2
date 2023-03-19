import { DEFAULT_THEME, getTheme, Theme, ThemeContext, ThemeType } from '@/contexts/ThemeContext';
import { Auth } from '@/controller/Auth';
import { useRouter } from 'next/router';
import ShowNotification from '@/controller/NotificationController';
import { useEffect, useState } from 'react';
import Footer from '@/components/footer/footer';
import Navbar from '@/components/navbar/navbar';
import { ReactNotifications } from 'react-notifications-component';
import ProductSidebar from '@/components/product/sidebar/ProductSidebar';
import { GetServerSidePropsContext } from 'next';
import { FilterInput, Pagination } from '@/model/filtering';
import ParsePagination, { ParseFilter } from '@/controller/ParseFilter';
import { Comp } from '@/components/component';
import { Product } from '@/model/product';
import { From } from '@/database/api';
import { SampleQuery } from '@/database/query';
import { ProductCard } from '@/components/product/card';
import { PaginationLink } from '@/components/pagination/pagination';

interface Props {
  pagination: Pagination
  filter: FilterInput
  products: Product[]
  total: number
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const {query} = context
  
  let props: Props = {
    filter: ParseFilter(query),
    pagination: ParsePagination(query),
    products: [],
    total: 0
  }

  const res = await From.Graphql.execute(SampleQuery.products, {
    pagination: props.pagination,
    filter: props.filter
  })

  if(res.success) {
    props.products = res.data
  }

  const countRes = await From.Graphql.execute(SampleQuery.countProducts, {
    pagination: props.pagination,
    filter: props.filter
  })

  if(countRes.success) {
    const total = countRes.data
    
    props.total = Math.ceil(total / props.pagination.contentsPerPage)
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
    console.log(props);
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
          <ProductSidebar filter={props.filter} pagination={props.pagination} route='/search'>
            <div className='center'>
              <Comp.H1>Discover Product</Comp.H1>
              <div className='grid' style={{width: "70vw"}}>
                {
                  props.products.map(p => (
                    <ProductCard.Style1 product={p} route="/product" />
                  ))
                }
              </div>
              <PaginationLink filter={props.filter} pagination={props.pagination} totalPages={props.total} />
            </div>
          </ProductSidebar>
          <Footer />
        </div>
      </ThemeContext.Provider>
    </Auth.Protection>
  )
}