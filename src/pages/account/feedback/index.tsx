import { DEFAULT_THEME, getTheme, Theme, ThemeContext, ThemeType } from '@/contexts/ThemeContext';
import { Auth } from '@/controller/Auth';
import { useRouter } from 'next/router';
import ShowNotification, { NotificationTemplate } from '@/controller/NotificationController';
import { FormEvent, useEffect, useState } from 'react';
import Footer from '@/components/footer/footer';
import Navbar from '@/components/navbar/navbar';
import { ReactNotifications } from 'react-notifications-component';
import { Button, Comp } from '@/components/component';
import { StoreDetail, StoreReviews } from '@/model/store';
import { From } from '@/database/api';
import { GetServerSidePropsContext } from 'next';
import { SampleQuery } from '@/database/query';

import style from "./style.module.scss"
import { Icon } from '@iconify/react';
import Topbar from '@/components/shop/topbar/topbar';
import { Account } from '@/model/account';
import { Pagination } from '@/model/filtering';
import ParsePagination from '@/controller/ParseFilter';
import StoreReview from '@/components/review/StoreReview';
import SidebarTemplate from '@/components/base';

interface Props {
  pagination: Pagination
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const {query} = context

  let props: Props = {
    pagination: ParsePagination(query)
  }
  return {props}
}

export default function ShopDetails(props: Props) {
  // TODO: Your hooks starts here
  const router = useRouter() // For Navigating

  const {pagination} = props

  // TODO: Your useState starts here
  const [theme, setTheme] = useState<ThemeType>(DEFAULT_THEME)
  const [account, setAccount] = useState<Account | null>()
  const [description, setDescription] = useState('')
  const [rating, setRating] = useState(5)

  const [store, setStore] = useState<StoreDetail | null>(null)
  const [reviews, setReviews] = useState<StoreReviews[]>([])
  const [sum, setSum] = useState(0)
  const [average, setAverage] = useState(0)
  const [star1, setStar1] = useState(0)
  const [star2, setStar2] = useState(0)
  const [star3, setStar3] = useState(0)
  const [star4, setStar4] = useState(0)
  const [star5, setStar5] = useState(0)

  // TODO: Your useEffect starts here
  useEffect(() => {
    const sessionTheme = getTheme(localStorage.getItem('theme'))
    localStorage.setItem('theme', sessionTheme.className)
    setTheme(sessionTheme)
    fetchAccount()
    
  }, [])

  async function fetchAccount() {
    const account = await Auth.getActiveAccount() 
    
    if(!account) {
      NotificationTemplate.Failed("fetch account")
      return
    }
    
    setAccount(account)

    const res = await From.Graphql.execute(SampleQuery.storeDetail, {id: account.id})
    if(res.success) {
      setStore(res.data)
    }

    const reviewRes = await From.Graphql.execute(SampleQuery.storeReviewsByStoreID, {
      pagination,
      store_id: account.id
    })

    if(reviewRes.success) {
      const reviews: StoreReviews[] = reviewRes.data
      setReviews(reviews)
      let sum = 0
      let star1 = 0
      let star2 = 0
      let star3 = 0
      let star4 = 0
      let star5 = 0
      let average = 0
      reviews.forEach(r => {
        if(r.rating == 1) {star1++; sum += 1}
        if(r.rating == 2) {star2++; sum += 2}
        if(r.rating == 3) {star3++; sum += 3}
        if(r.rating == 4) {star4++; sum += 4}
        if(r.rating == 5) {star5++; sum += 5}
      })
      if(reviews.length > 0) average = sum / reviews.length

      setSum(sum)
      setAverage(average)
      setStar1(star1)
      setStar2(star2)
      setStar3(star3)
      setStar4(star4)
      setStar5(star5)
    }
  }

  // TODO: Your custom logic starts here...

  function changeTheme() {
    const newTheme = theme === Theme.DARK ? Theme.LIGHT : Theme.DARK
    localStorage.setItem('theme', newTheme.className)
    setTheme(newTheme)
    console.log(newTheme.background);
  }

  async function handleSubmitFeedback(e: FormEvent) {
    e.preventDefault()

    if(!rating || rating < 1 || rating > 5) {
      ShowNotification("danger", "Error", "Rating should have in range 1 to 5")
      return
    }

    if(account && store) {
      const res = await From.Rest.fetchData("/shop/review", "POST", {
        account_id: account.id,
        store_id: store.account.id,
        rating,
        description
      }, Auth.getToken())

      if(res.success) {
        router.reload()
      }
      else {
        console.error(res.raw);
        NotificationTemplate.Error()
      }
    }
  }

  function format(num: number) {
    return Math.round(num * 100) / 100
  }

  function getRatio(m: number, n: number) {
    if(n > 0) return m / n
    else return 0
  }

  // TODO: Your React Element Starts here
  return (
    <Auth.Protection
      // TODO: Put Your Authentication Rule here...
      MustLogin
      MustBusiness
    >
      <ThemeContext.Provider value={theme}>
        <ReactNotifications />
        <div className='main' style={{backgroundColor: theme.background}}>
          <Navbar changeTheme={changeTheme}/>
          <SidebarTemplate>
            <div className={style.content + ' center'}>
              <Comp.H1>Feedback Page</Comp.H1>
              <div>
                {
                  reviews.length > 0 ? 
                    <div className={style.center}>
                      <Comp.H1>User Review</Comp.H1>
                      <div className={style.progress}>
                        <div className={style.entry}>
                          <Comp.P className={style.title}>5<Icon icon="dashicons:star-filled" className='star'/></Comp.P>
                          <div className={style.bar}>
                            <progress value={star5} max={reviews.length}/>
                            <Comp.P>{`${star5} (${format(getRatio(star5 * 100, reviews.length))}%)`}</Comp.P>
                          </div>
                        </div>
                        <div className={style.entry}>
                          <Comp.P className={style.title}>4<Icon icon="dashicons:star-filled" className='star'/></Comp.P>
                          <div className={style.bar}>
                            <progress value={star4} max={reviews.length}/>
                            <Comp.P>{`${star4} (${format(getRatio(star4 * 100, reviews.length))}%)`}</Comp.P>
                          </div>
                        </div>
                        <div className={style.entry}>
                          <Comp.P className={style.title}>3<Icon icon="dashicons:star-filled" className='star'/></Comp.P>
                          <div className={style.bar}>
                            <progress value={star3} max={reviews.length}/>
                            <Comp.P>{`${star3} (${format(getRatio(star3 * 100, reviews.length))}%)`}</Comp.P>
                          </div>
                        </div>
                        <div className={style.entry}>
                          <Comp.P className={style.title}>2<Icon icon="dashicons:star-filled" className='star'/></Comp.P>
                          <div className={style.bar}>
                            <progress value={star2} max={reviews.length}/>
                            <Comp.P>{`${star2} (${format(getRatio(star2 * 100, reviews.length))}%)`}</Comp.P>
                          </div>
                        </div>
                        <div className={style.entry}>
                          <Comp.P className={style.title}>1<Icon icon="dashicons:star-filled" className='star'/></Comp.P>
                          <div className={style.bar}>
                            <progress value={star1} max={reviews.length}/>
                            <Comp.P>{`${star1} (${format(getRatio(star1 * 100, reviews.length))}%)`}</Comp.P>
                          </div>
                        </div>
                      </div>
                      <Comp.H2>Average: {format(average)}<Icon icon="dashicons:star-filled" className='star'/></Comp.H2>
                      <div>
                        {reviews.map(r => (
                          <StoreReview review={r} />
                        ))}
                      </div>
                    </div>
                  : <Comp.H2>No Feedbacks available</Comp.H2>
                }
              </div>
            </div>
          </SidebarTemplate>
          <Footer />
        </div>
      </ThemeContext.Provider>
    </Auth.Protection>
  )
}