import { DEFAULT_THEME, getTheme, Theme, ThemeContext, ThemeType } from '@/contexts/ThemeContext';
import { Auth } from '@/controller/Auth';
import { useRouter } from 'next/router';
import ShowNotification, { NotificationTemplate } from '@/controller/NotificationController';
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
import { Product } from '@/model/product';
import { FilterInput, Pagination } from '@/model/filtering';
import ParsePagination, { ParseFilter } from '@/controller/ParseFilter';
import { ProductCard } from '@/components/product/card';
import { PaginationLink } from '@/components/pagination/pagination';
import ProductSidebar from '@/components/product/sidebar/ProductSidebar';
import shop from '@/pages/account/profile/admin';

interface Props {
  pagination: Pagination,
  filter: FilterInput,
  id: string
  store: StoreDetail | null
  products: Product[],
  totalPages: number
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const {query} = context

  let id = ""

  if(query.id && !Array.isArray(query.id)) {
    id = query.id
  }

  let props: Props = {
    id,
    pagination: ParsePagination(query),
    filter: ParseFilter(query),
    products: [],
    store: null,
    totalPages: 0
  }

  const res = await From.Graphql.execute(SampleQuery.storeDetail, {
    id: props.id
  })
  
  if(res.success) {
    props.store = res.data
  }

  const resProduct = await From.Graphql.execute(SampleQuery.productsByStoreID, {
    pagination: props.pagination,
    filter: props.filter
  })
  
  console.log(resProduct.raw);
  console.log(resProduct.data);
  
  if(res.success) {
    props.products = resProduct.data
    const res2 = await From.Graphql.execute(SampleQuery.countProducts, {filter: props.filter})
    if(res2.success) {
      let total: number = Math.ceil(parseInt(res2.data) / props.pagination.contentsPerPage)
      console.log(total);
      props.totalPages = total
    }
  }

  return {
    props
  }
}

export default function ShopDetails(props: Props) {
  // TODO: Your hooks starts here
  const router = useRouter() // For Navigating

  const {products, store, totalPages} = props

  // TODO: Your useState starts here
  const [theme, setTheme] = useState<ThemeType>(DEFAULT_THEME)

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
                </div>
              </div>
            </div>
            <Topbar id={store ? store.account.id : '#NA'} />
            <div className={style.center}>
              <ProductSidebar route={`/shop/${props.store?.account.id}/product`} pagination={props.pagination} filter={props.filter}>
                <div className={style.center} style={{width: '70vw'}}>
                  <Comp.H1>Sold Products</Comp.H1>
                  <div className='grid'>
                    {products.map(p => (
                      <ProductCard.Style1 product={p} route="/product/" />
                    ))}
                  </div>
                  <PaginationLink pagination={props.pagination} filter={props.filter} totalPages={totalPages}/>
                </div>
              </ProductSidebar>
            </div>
          </div>
          <Footer />
        </div>
      </ThemeContext.Provider>
    </Auth.Protection>
  )
}