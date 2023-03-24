import { DEFAULT_THEME, getTheme, Theme, ThemeContext, ThemeType } from '@/contexts/ThemeContext';
import { Auth } from '@/controller/Auth';
import { useRouter } from 'next/router';
import ShowNotification, { NotificationTemplate } from '@/controller/NotificationController';
import { MouseEvent, useEffect, useState } from 'react';
import Footer from '@/components/footer/footer';
import Navbar from '@/components/navbar/navbar';
import { ReactNotifications } from 'react-notifications-component';
import SidebarTemplate from '@/components/base';
import { Button, Comp } from '@/components/component';
import { Account } from '@/model/account';
import { StoreReviews } from '@/model/store';
import { WishlistReview } from '@/model/wishlist';
import { From } from '@/database/api';
import { SampleQuery } from '@/database/query';
import { GetStars } from '@/controller/Utility';

export default function index() {
  // TODO: Your hooks starts here
  const router = useRouter() // For Navigating

  // TODO: Your useState starts here
  const [theme, setTheme] = useState<ThemeType>(DEFAULT_THEME)
  const [account, setAccount] = useState<Account | null>(null)

  const [storeReviews, setStoreReviews] = useState<StoreReviews[]>([])
  const [wishlistReviews, setWishlistReviews] = useState<WishlistReview[]>([])

  // TODO: Your useEffect starts here
  useEffect(() => {
    const sessionTheme = getTheme(localStorage.getItem('theme'))
    localStorage.setItem('theme', sessionTheme.className)
    setTheme(sessionTheme)
    fetchData()
  }, [])

  async function fetchData() {
    const acc = await Auth.getActiveAccount()

    if(acc) {
      setAccount(acc)

      const res1 = await From.Graphql.execute(SampleQuery.storeReviewsByAccount, {id: acc.id})

      if(res1.success) {
        setStoreReviews(res1.data)
      }
      else {
        NotificationTemplate.Error()
        console.error(res1.data);
      }

      const res2 = await From.Graphql.execute(SampleQuery.wishlistReviewsByAccount, {id: acc.id})

      if(res2.success) {
        setWishlistReviews(res2.data)
      }
      else {
        NotificationTemplate.Error()
        console.error(res2.data);
      }
    }
    else {
      NotificationTemplate.Failed("fetch account data")
    }
  }

  async function deleteStoreReview(e: MouseEvent, id: string) {
    e.preventDefault()

    if(!account) {
      NotificationTemplate.Failed("fetch account details")
      return
    }

    const res = await From.Rest.fetchData("/shop/review", "DELETE", {
      id,
      account_id: account.id
    }, Auth.getToken())

    if(res.success) {
      ShowNotification("success", "Success", res.data.status)
      fetchData()
    }
    else {
      ShowNotification("danger", "Failed!", res.data)
    }
  }

  async function deleteWishlistReview(e: MouseEvent, id: string) {
    e.preventDefault()

    if(!account) {
      NotificationTemplate.Failed("fetch account details")
      return
    }

    const res = await From.Rest.fetchData("/wishlist/feedback", "DELETE", {
      id,
      account_id: account.id
    }, Auth.getToken())

    if(res.success) {
      ShowNotification("success", "Success", res.data.status)
      fetchData()
    }
    else {
      ShowNotification("danger", "Failed!", res.data)
    }
    e.preventDefault()
  }

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
      MustLogin
    >
      <ThemeContext.Provider value={theme}>
        <ReactNotifications />
        <div className='main' style={{backgroundColor: theme.background}}>
          <Navbar changeTheme={changeTheme}/>
          <SidebarTemplate>
            <div className='center'>
              <div className='center'>
                <Comp.H1>Shop Reviews</Comp.H1>
                {
                  storeReviews.length == 0 ? <Comp.H2>No Feedbacks</Comp.H2> : 
                  <div className='grid' style={{width: "70vw"}}>
                    {
                      storeReviews.map((sr, idx) => (
                        <div style={{backgroundColor: theme.cardBG, padding:"1rem 2rem", borderRadius:"1.2rem", minHeight:"5rem", width : "12rem"}}>
                          <Comp.H2>Review #{idx + 1}</Comp.H2>
                          <Comp.A href={`/shop/${sr.store?.account.id}/review`}>{sr.store?.account.first_name}</Comp.A>
                          <Comp.P>{GetStars(sr.rating)}</Comp.P>
                          <Comp.P>{sr.description}</Comp.P>
                          <Button.Delete onClick={e => deleteStoreReview(e, sr.id)} />
                        </div>
                      ))
                    }
                  </div>
                }
              </div>
              <div className='center'>
                <Comp.H1>Wishlist Reviews</Comp.H1>
                {
                  wishlistReviews.length == 0 ? <Comp.H2>No Feedbacks</Comp.H2> : 
                  <div className='grid' style={{width: "70vw"}}>
                    {
                      wishlistReviews.map((wr, idx) => (
                        <div style={{backgroundColor: theme.cardBG, padding:"1rem 2rem", borderRadius:"1.2rem", minHeight:"5rem", width : "12rem"}}>
                          <Comp.H2>Review #{idx + 1}</Comp.H2>
                          <Comp.A href={`/wishlist/${wr.wishlist.id}`}>From {wr.wishlist.title}</Comp.A>
                          <Comp.P>{GetStars(wr.rating)}</Comp.P>
                          <Comp.P>{wr.detail}</Comp.P>
                          <Button.Delete onClick={e => deleteWishlistReview(e, wr.id)} />
                        </div>
                      ))
                    }
                  </div>
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