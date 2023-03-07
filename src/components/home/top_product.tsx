import { DEFAULT_THEME, getTheme, ThemeContext, ThemeType } from '@/contexts/ThemeContext';
import ShowNotification, { NotificationTemplate } from '@/controller/NotificationController';
import { Pagination } from '@/controller/PaginationParser';
import { From } from '@/database/api';
import { SampleQuery } from '@/database/query';
import { Product } from '@/model/product';
import { useRouter } from 'next/router';
import { Suspense, useContext, useEffect, useRef, useState } from 'react';
import { Button, Comp } from '../component';
import { ProductCard } from '../product/card';

const contentsPerPage = 10

export default function TopProduct() {
  // TODO: Your hooks starts here...
  
  // TODO: Put UseState Stuff here
  const [products, setProducts] = useState<Product[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)

  // TODO: Put UseEffect Stuff Here
  async function fetchProducts() {
    setLoading(true)

    const res = await From.Graphql.execute(SampleQuery.topProducts, {
      pagination: {
        page,
        contentsPerPage
      }
    })

    if(res.success) {
      const data: Product[] = res.data
      if(Array.isArray(data)) {
        setProducts([...products, ...data]);
      }
      else {
        NotificationTemplate.Error()
      }
    }
    else {
      NotificationTemplate.Error()
    }

    setLoading(false)
  }

  function handleScroll() {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight && !loading) {
      setPage(page + 1);
    }
  }

  useEffect(() => {
    fetchProducts()

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [page])

  return(
    <>
      <div className='grid'>
        {products.map(prod => (<ProductCard.Style1 product={prod} />))}
      </div>
      <div style={{alignSelf: "center"}}>
        <Button.Blue onClick={_ => setPage(page + 1)}>Show More</Button.Blue>
      </div>
    </>
  )
}