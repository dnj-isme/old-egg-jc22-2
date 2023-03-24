import { DEFAULT_THEME, getTheme, Theme, ThemeContext, ThemeType } from '@/contexts/ThemeContext';
import { Auth } from '@/controller/Auth';
import { useRouter } from 'next/router';
import ShowNotification, { NotificationTemplate } from '@/controller/NotificationController';
import { FormEvent, MouseEvent, useEffect, useState } from 'react';
import Footer from '@/components/footer/footer';
import Navbar from '@/components/navbar/navbar';
import { ReactNotifications } from 'react-notifications-component';
import SidebarTemplate from '@/components/base';
import { Button, Comp } from '@/components/component';

import style from "./style.module.scss"
import { GetServerSidePropsContext } from 'next';
import { Wishlist } from '@/model/wishlist';
import { From } from '@/database/api';
import { SampleQuery } from '@/database/query';
import { WishlistFilterInput } from '@/model/filtering';
import WishlistCard from '@/components/wishlist/wishlist';

export default function index() {
  // TODO: Your hooks starts here
  const router = useRouter() // For Navigating

  // TODO: Your useState starts here
  const [theme, setTheme] = useState<ThemeType>(DEFAULT_THEME)
  const [wishlists, setWishlists] = useState<Wishlist[]>([])
  const [display, setDisplay] = useState('none')

  const [activeWishlist, setActiveWishlist] = useState<Wishlist | null>(null)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [public_wishlist, setPublicWishlist] = useState(false)

  // TODO: Your useEffect starts here
  useEffect(effect, [])

  function effect() {
    const sessionTheme = getTheme(localStorage.getItem('theme'))
    localStorage.setItem('theme', sessionTheme.className)
    setTheme(sessionTheme)

    if(global.wishlist) {
      global.wishlist = false
      ShowNotification("success", "Success", "Wishlist inserted successfully!")
    }

    fetchWishlist()
  }

  async function fetchWishlist() {
    const account = await Auth.getActiveAccount()
    if(account == null) {
      NotificationTemplate.Failed("fetch account details")
      return
    }

    const filter: WishlistFilterInput = {
      account_id: account.id,
    }

    const res = await From.Graphql.execute(SampleQuery.wishlists, {filter})
    if(res.success) {
      setWishlists(res.data)
      console.log(res.data);
      
    }
    else {
      ShowNotification("danger", "Error", res.data)
    }
  }

  // TODO: Your custom logic starts here...

  function changeTheme() {
    const newTheme = theme === Theme.DARK ? Theme.LIGHT : Theme.DARK
    localStorage.setItem('theme', newTheme.className)
    setTheme(newTheme)
    console.log(newTheme.background);
  }

  function handleClick(wishlist: Wishlist) {
    setActiveWishlist(wishlist)
    setDisplay("block")
    setTitle(wishlist.title)
    setDescription(wishlist.description)
    setPublicWishlist(wishlist.public_wishlist)
  }

  function handleExit(e?: MouseEvent) {
    e?.preventDefault()
    setDisplay("none")
    setActiveWishlist(null)
    setTitle('')
    setDescription('')
    setPublicWishlist(false)
  }

  async function handleDelete(e: MouseEvent) {
    e.preventDefault()
    const res = await From.Rest.fetchData("/wishlist/", "DELETE", {id: activeWishlist?.id}, Auth.getToken())
    if(res.success) {
      ShowNotification("success", "Success", res.data.status)
      handleExit()
      fetchWishlist()
    }
    else {
      NotificationTemplate.Failed("deleting wishlist")
      console.error(res.data);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    const res = await From.Rest.fetchData("/wishlist/", "PATCH", {
      id: activeWishlist?.id,
      title,
      description,
      public_wishlist
    }, Auth.getToken())

    if (res.success) {
      NotificationTemplate.Success()
      effect()
    }
    else {
      console.error(res.data);
      NotificationTemplate.Failed("Saving changes")
    }

    setTitle('')
    setDescription('')
    setPublicWishlist(false)
    handleExit()
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
              <Comp.H1>My Wish List</Comp.H1>
              <Button.Green onClick={_ => router.push("wishlist/create")}>New Wishlist</Button.Green>
              <div className='grid' style={{width: "70vw", marginTop: "1.6rem"}}>
                {wishlists.map(w => (
                  <WishlistCard 
                    wishlist={w} 
                    onClick={handleClick}
                  />
                ))}
              </div>
            </div>
          </SidebarTemplate>
          <Footer />
          <div className={style.popup} style={{display}}>
            <Comp.Div className={style.detail + ' center'}>
              <Comp.H1>Wishlist</Comp.H1>
              <div className={style.exit} onClick={handleExit}><Button.Red>X</Button.Red></div>
              <form method='post' className='center' onSubmit={handleSubmit}>
                <table>
                  <tbody>
                    <tr>
                      <td><Comp.Label htmlFor='title'>Title</Comp.Label></td>
                      <td><input type="text" name="title" id="title" value={title} onChange={e => setTitle(e.target.value)} /></td>
                    </tr>
                    <tr>
                      <td><Comp.Label htmlFor='description'>Description</Comp.Label></td>
                      <td><textarea name='description' id="description" rows={7} value={description} onChange={e => setDescription(e.target.value)}/></td>
                    </tr>
                    <tr>
                      <td><Comp.Label htmlFor='public'>Visible to Public</Comp.Label></td>
                      <td><input type="checkbox" name="public" id="public" checked={public_wishlist} onChange={e => setPublicWishlist(e.target.checked)} /></td>
                    </tr>
                    <tr>
                      <td><Comp.P>Total Price</Comp.P></td>
                      <td><Comp.P>$ {activeWishlist?.total_price}</Comp.P></td>
                    </tr>
                    <tr>
                      <td><Comp.P>Total Reviews</Comp.P></td>
                      <td><Comp.P>{activeWishlist?.reviews.length}</Comp.P></td>
                    </tr>
                  </tbody>
                </table>
                <div>
                  <Button.Yellow type='button' onClick={_ => router.push("wishlist/" + activeWishlist?.id)}>View Details</Button.Yellow>
                  <Button.Submit>Save Changes</Button.Submit>
                  <Button.Delete onClick={handleDelete}/>
                </div>
              </form>
            </Comp.Div>
          </div>
        </div>
      </ThemeContext.Provider>
    </Auth.Protection>
  )
}