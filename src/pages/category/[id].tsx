import { DEFAULT_THEME, getTheme, Theme, ThemeContext, ThemeType } from '@/contexts/ThemeContext';
import { Auth } from '@/controller/Auth';
import { useRouter } from 'next/router';
import ShowNotification from '@/controller/NotificationController';
import { useEffect, useState } from 'react';
import Footer from '@/components/footer/footer';
import Navbar from '@/components/navbar/navbar';
import { ReactNotifications } from 'react-notifications-component';
import { Comp } from '@/components/component';
import { Category, Product } from '@/model/product';
import { GetServerSidePropsContext } from 'next';
import { From } from '@/database/api';
import { SampleQuery } from '@/database/query';
import { ProductCard } from '@/components/product/card';
import style from "./style.module.scss"
import ParsePagination, { Pagination } from '@/controller/PaginationParser';
import { PaginationLink } from '@/components/pagination/pagination';

interface Props {
  category: Category,
  pagination: Pagination,
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const {query} = context
  const id = query.id
  
  const pagination = ParsePagination(query)

  const res = await  From.Graphql.execute(SampleQuery.categoryByID, {id, pagination})
  
  let props: Props = {
    category: {
      category_name: "",
      id: "",
      products: [],
      product_count: 0
    },
    pagination
  }
  
  if(res.success && res.data && res.data.products.length) {
    props.category = res.data
  }

  return {
    props
  }
}

export default function FindCategory(props: Props) {
  // TODO: Your hooks starts here
  const router = useRouter() // For Navigating

  // TODO: Your useState starts here
  const [theme, setTheme] = useState<ThemeType>(DEFAULT_THEME)

  // TODO: Your useEffect starts here
  useEffect(() => {    
    console.log(props);
    const sessionTheme = getTheme(localStorage.getItem('theme'))
    localStorage.setItem('theme', sessionTheme.className)
    setTheme(sessionTheme)
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
      // MustLogin
    >
      <ThemeContext.Provider value={theme}>
        <ReactNotifications />
        <div className='main' style={{backgroundColor: theme.background}}>
          <div>
            <Navbar changeTheme={changeTheme}/>
          </div>
          <div className={style.content} style={{backgroundColor: theme.background}}>
            {
              !props.category.id ? <Comp.H1>No Item</Comp.H1> : 
              <>
                <Comp.H1>{props.category.category_name}</Comp.H1>
                <div className="grid">
                  {props.category.products?.map(data => (
                    <ProductCard.Style1 product={data} />
                  ))}
                </div>
                <PaginationLink page={props.pagination.page} contensPerPage={props.pagination.contentsPerPage} totalPages={Math.ceil(props.category.product_count / props.pagination.contentsPerPage)} />
              </>
            }
          </div>
          <Footer />
        </div>
      </ThemeContext.Provider>
    </Auth.Protection>
  )
}