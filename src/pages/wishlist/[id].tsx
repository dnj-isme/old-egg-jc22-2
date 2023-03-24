import { DEFAULT_THEME, getTheme, Theme, ThemeContext, ThemeType } from '@/contexts/ThemeContext';
import { Auth } from '@/controller/Auth';
import { useRouter } from 'next/router';
import ShowNotification, { NotificationTemplate } from '@/controller/NotificationController';
import { MouseEvent, useEffect, useState } from 'react';
import Footer from '@/components/footer/footer';
import Navbar from '@/components/navbar/navbar';
import { ReactNotifications } from 'react-notifications-component';
import { GetServerSidePropsContext } from 'next';
import { Wishlist } from '@/model/wishlist';
import { From } from '@/database/api';
import { SampleQuery } from '@/database/query';
import { Button, Comp } from '@/components/component';
import WishlistProductCard from '@/components/wishlist/product';
import { Account } from '@/model/account';
import WishlistReviewTemplate from '@/components/wishlist/WishlistReview';
interface Props {
  wishlist?: Wishlist
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const {query} = context

  const id = query.id

  let props: Props = {}
  
  if(id && !Array.isArray(id)) {
    const res = await From.Graphql.execute(SampleQuery.wishlistByID, {id})

    if(res.success) {
      props.wishlist = res.data
    }
  }

  return {props}
}

export default function WishlistDetails(props: Props) {
  // TODO: Your hooks starts here
  const router = useRouter() // For Navigating

  // TODO: Your useState starts here
  const [theme, setTheme] = useState<ThemeType>(DEFAULT_THEME)
  const [account, setAccount] = useState<Account | null>(null)

  const {wishlist} = props

  // TODO: Your useEffect starts here
  useEffect(() => {
    const sessionTheme = getTheme(localStorage.getItem('theme'))
    localStorage.setItem('theme', sessionTheme.className)
    setTheme(sessionTheme)
    Auth.getActiveAccount().then(res => setAccount(res))
  }, [])

  // TODO: Your custom logic starts here...

  function changeTheme() {
    const newTheme = theme === Theme.DARK ? Theme.LIGHT : Theme.DARK
    localStorage.setItem('theme', newTheme.className)
    setTheme(newTheme)
    console.log(newTheme.background);
  }

  async function handleAddToCart(e: MouseEvent) {
    e.preventDefault()
    if(!account) {
      router.push("/auth/signin")
      return;
    }

    const res = await From.Rest.fetchData("/wishlist/apply", "POST", {
      wishlist_id: wishlist?.id, 
      account_id: account.id
    }, Auth.getToken())

    console.log(res.raw);
    

    if(res.success) {
      ShowNotification("success", "Success", res.data)
    }
    else {
      ShowNotification("danger", "Failed", res.data)
    }
  }

  async function handleDuplicate(e: MouseEvent) {
    e.preventDefault()
    if(!account) {
      router.push("/auth/signin")
      return;
    }

    const res = await From.Rest.fetchData("/wishlist/duplicate", "POST", {
      wishlist_id: wishlist?.id, 
      account_id: account.id
    }, Auth.getToken())
    
    if(res.success) {
      ShowNotification("success", "Success", res.data.status)
    }
    else {
      // ShowNotification("danger", "Failed", res.data)
      console.error(res.data);
    }
  }

  async function handleFollow(e: MouseEvent) {
    e.preventDefault()
    if(!account) {
      router.push("/auth/signin")
      return;
    }
    const res = await From.Rest.fetchData("/wishlist/follow", "POST", {
      account_id: account.id,
      wishlist_id: wishlist?.id,
      note: ''
    }, Auth.getToken())
    if(res.success) {
      ShowNotification("success", "Success", res.data.status)
    }
    else {
      ShowNotification("danger", "Failed", res.data)
    }
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
          <WishlistReviewTemplate wishlist={props.wishlist}>
            <div className='center'>
              <Comp.H1>Wishlist Details</Comp.H1>
              <Comp.H2>{wishlist?.title}</Comp.H2>
              <Comp.H2>By: {wishlist?.account.first_name}</Comp.H2>
              <div>
                {
                  account?.id != wishlist?.account.id ? 
                  <>
                    <Button.Blue onClick={handleFollow}>Follow</Button.Blue>
                    <Button.Blue onClick={handleDuplicate}>Duplicate Wishlist</Button.Blue>
                  </> : null
                }
                <Button.Blue onClick={handleAddToCart}>Add to Cart</Button.Blue>
              </div>
              {
                !wishlist ? <Comp.H2>No Data</Comp.H2> :
                <>
                  <div className='center'>
                    {
                      wishlist.details.length == 0 ? <Comp.H2>No Product</Comp.H2> : 
                      <div className='grid' style={{width: "70vw"}}>
                        {wishlist.details.map(e => (<WishlistProductCard id={wishlist.id} detail={e} />))}
                      </div>
                    }
                  </div>
                </>
              }
            </div>
          </WishlistReviewTemplate>
          <Footer />
        </div>
      </ThemeContext.Provider>
    </Auth.Protection>
  )
}