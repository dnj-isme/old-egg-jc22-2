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
import { GetServerSidePropsContext } from 'next';
import { Wishlist } from '@/model/wishlist';
import { From } from '@/database/api';
import { SampleQuery } from '@/database/query';
import { ProductCard } from '@/components/product/card';
import WishlistProductCard from '@/components/wishlist/product';

interface Props {
  wishlist: Wishlist | null
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const {query} = context

  const id = query.id

  let props: Props = {
    wishlist: null
  }

  if(id && !Array.isArray(id)) {
    const res = await From.Graphql.execute(SampleQuery.wishlistByID, {id})
    if(res.success) {
      props.wishlist = res.data
    }
  }
  
  return {props}
}

export default function EditWishlist(props: Props) {
  // TODO: Your hooks starts here
  const router = useRouter() // For Navigating

  const {wishlist} = props

  // TODO: Your useState starts here
  const [theme, setTheme] = useState<ThemeType>(DEFAULT_THEME)

  // TODO: Your useEffect starts here
  useEffect(() => {
    const sessionTheme = getTheme(localStorage.getItem('theme'))
    localStorage.setItem('theme', sessionTheme.className)
    setTheme(sessionTheme)
    if(!wishlist) {
      NotificationTemplate.Failed("fetching wishlist data")
    }
    console.log(wishlist);
    
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

    const account = await Auth.getActiveAccount()

    if(!account) {
      NotificationTemplate.Failed("Fetch Account Data")
      return;
    }

    const res = await From.Rest.fetchData("/wishlist/apply", "POST", {
      wishlist_id: wishlist?.id, 
      account_id: account.id
    }, Auth.getToken())

    console.log(res.raw);
    

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
      MustLogin
    >
      <ThemeContext.Provider value={theme}>
        <ReactNotifications />
        <div className='main' style={{backgroundColor: theme.background}}>
          <Navbar changeTheme={changeTheme}/>
          <SidebarTemplate>
            <div className='center'>
              <Comp.H1>Cart Details</Comp.H1>
              {
                !wishlist ? <Comp.H2>No Data</Comp.H2> :
                <>
                  <div>
                    <Comp.P>ID: {wishlist.id}</Comp.P>
                  </div>
                  <div className='center'>
                    <div>
                      <Button.Blue onClick={_ => router.push("/search")}>Browse for Products</Button.Blue>
                      <Button.Blue onClick={handleAddToCart}>Add To Cart</Button.Blue>
                    </div>
                    {
                      wishlist.details.length == 0 ? <Comp.H2>You don't input any details</Comp.H2> : 
                      <div className='grid' style={{width: "70vw"}}>
                        {wishlist.details.map(e => (<WishlistProductCard id={wishlist.id} detail={e} />))}
                      </div>
                    }
                  </div>
                </>
              }
            </div>
          </SidebarTemplate>
          <Footer />
        </div>
      </ThemeContext.Provider>
    </Auth.Protection>
  )
}