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

interface Props {
  store?: StoreDetail
  reviews: StoreReviews[]
  pagination: Pagination,
  reviewReport: {
    total: number
    star5: number
    star4: number
    star3: number
    star2: number
    star1: number
    average: number
  }
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const {query} = context

  const id = query.id

  let pagination = ParsePagination(query)
  let props: Props = {
    store: undefined,
    reviews: [],
    pagination,
    reviewReport: {
      star1: 0,
      star2: 0,
      star3: 0,
      star4: 0,
      star5: 0,
      total: 0,
      average: 0
    }
  }

  if(id && !Array.isArray(id)) {
    const res = await From.Graphql.execute(SampleQuery.storeDetail, {id})
    if(res.success) {
      props.store = res.data
    }
    const reviewRes = await From.Graphql.execute(SampleQuery.storeReviewsByStoreID, {
      pagination,
      store_id: props.store?.account.id
    })

    if(reviewRes.success) {
      props.reviews = reviewRes.data
      props.reviewReport.total = props.reviews.length
      let sum = 0
      props.reviews.forEach(r => {
        if(r.rating == 1) {props.reviewReport.star1++; sum += 1}
        if(r.rating == 2) {props.reviewReport.star2++; sum += 2}
        if(r.rating == 3) {props.reviewReport.star3++; sum += 3}
        if(r.rating == 4) {props.reviewReport.star4++; sum += 4}
        if(r.rating == 5) {props.reviewReport.star5++; sum += 5}
      })
      if(props.reviewReport.total > 0) props.reviewReport.average = sum / props.reviewReport.total
    }
  }

  return {
    props
  }
}

export default function ShopDetails(props: Props) {
  // TODO: Your hooks starts here
  const router = useRouter() // For Navigating

  const {store} = props

  // TODO: Your useState starts here
  const [theme, setTheme] = useState<ThemeType>(DEFAULT_THEME)
  const [account, setAccount] = useState<Account | null>()
  const [description, setDescription] = useState('')
  const [rating, setRating] = useState(5)

  // TODO: Your useEffect starts here
  useEffect(() => {
    const sessionTheme = getTheme(localStorage.getItem('theme'))
    localStorage.setItem('theme', sessionTheme.className)
    setTheme(sessionTheme)
    fetchAccount()
    console.log(props);
    
  }, [])

  async function fetchAccount() {
    setAccount(await Auth.getActiveAccount())
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
            <div>
              <Topbar id={store ? store.account.id : '#NA'} />
              <div>
                {
                account && !account.business ? 
                  <form className={style.center} method="POST" onSubmit={handleSubmitFeedback}>
                    <Comp.H1>Give Feedback</Comp.H1>
                    <table>
                      <tbody>
                        <tr>
                          <td><label htmlFor="rating" style={{color: theme.textColor}}>Rating</label></td>
                          <td><input className={style.fill} type="number" name="rating" id="rating" value={rating} max={5} min={1} step={1} onChange={e => setRating(parseInt(e.target.value))}/></td>
                        </tr>
                        <tr>
                          <td><label htmlFor="description" style={{color: theme.textColor}}>Feedback Details</label></td>
                          <td><textarea className={style.fill} id="description" rows={10} value={description} onChange={e => setDescription(e.target.value)}/></td>
                        </tr>
                      </tbody>
                    </table>
                    <Button.Submit>Submit</Button.Submit>
                  </form>
                : null
                }
                {
                  props.reviews.length > 0 ? 
                    <div className={style.center}>
                      <Comp.H1>User Review</Comp.H1>
                      <div className={style.progress}>
                        <div className={style.entry}>
                          <Comp.P className={style.title}>5<Icon icon="dashicons:star-filled" className='star'/></Comp.P>
                          <div className={style.bar}>
                            <progress value={props.reviewReport.star5} max={props.reviewReport.total}/>
                            <Comp.P>{`${props.reviewReport.star5} (${format(getRatio(props.reviewReport.star5 * 100, props.reviewReport.total))}%)`}</Comp.P>
                          </div>
                        </div>
                        <div className={style.entry}>
                          <Comp.P className={style.title}>4<Icon icon="dashicons:star-filled" className='star'/></Comp.P>
                          <div className={style.bar}>
                            <progress value={props.reviewReport.star4} max={props.reviewReport.total}/>
                            <Comp.P>{`${props.reviewReport.star4} (${format(getRatio(props.reviewReport.star4 * 100, props.reviewReport.total))}%)`}</Comp.P>
                          </div>
                        </div>
                        <div className={style.entry}>
                          <Comp.P className={style.title}>3<Icon icon="dashicons:star-filled" className='star'/></Comp.P>
                          <div className={style.bar}>
                            <progress value={props.reviewReport.star3} max={props.reviewReport.total}/>
                            <Comp.P>{`${props.reviewReport.star3} (${format(getRatio(props.reviewReport.star3 * 100, props.reviewReport.total))}%)`}</Comp.P>
                          </div>
                        </div>
                        <div className={style.entry}>
                          <Comp.P className={style.title}>2<Icon icon="dashicons:star-filled" className='star'/></Comp.P>
                          <div className={style.bar}>
                            <progress value={props.reviewReport.star2} max={props.reviewReport.total}/>
                            <Comp.P>{`${props.reviewReport.star2} (${format(getRatio(props.reviewReport.star2 * 100, props.reviewReport.total))}%)`}</Comp.P>
                          </div>
                        </div>
                        <div className={style.entry}>
                          <Comp.P className={style.title}>1<Icon icon="dashicons:star-filled" className='star'/></Comp.P>
                          <div className={style.bar}>
                            <progress value={props.reviewReport.star1} max={props.reviewReport.total}/>
                            <Comp.P>{`${props.reviewReport.star1} (${format(getRatio(props.reviewReport.star1 * 100, props.reviewReport.total))}%)`}</Comp.P>
                          </div>
                        </div>
                      </div>
                      <Comp.H2>Average: {format(props.reviewReport.average)}<Icon icon="dashicons:star-filled" className='star'/></Comp.H2>
                      <div>
                        {props.reviews.map(r => (
                          <StoreReview review={r} />
                        ))}
                      </div>
                    </div>
                  : null
                }
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </ThemeContext.Provider>
    </Auth.Protection>
  )
}