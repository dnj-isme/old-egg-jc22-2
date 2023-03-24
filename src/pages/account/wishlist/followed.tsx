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
import { FollowedWishlist } from '@/model/wishlist';
import { From } from '@/database/api';
import { SampleQuery } from '@/database/query';
import WishlistCard from '@/components/wishlist/FollowedWishlist';
import FollowedWishlistCard from '@/components/wishlist/FollowedWishlist';

import style from "./style.module.scss"

export default function followed() {
  // TODO: Your hooks starts here
  const router = useRouter() // For Navigating

  // TODO: Your useState starts here
  const [theme, setTheme] = useState<ThemeType>(DEFAULT_THEME)
  const [data, setData] = useState<FollowedWishlist[]>([])
  const [selected, setSelected] = useState<FollowedWishlist | null>(null)
  const [note, setNote] = useState('')

  // TODO: Your useEffect starts here
  useEffect(() => {
    const sessionTheme = getTheme(localStorage.getItem('theme'))
    localStorage.setItem('theme', sessionTheme.className)
    setTheme(sessionTheme)

    fetchData()
  }, [])

  async function fetchData() {
    const account = await Auth.getActiveAccount()

    if(account) {
      const res = await From.Graphql.execute(SampleQuery.followedWishlists, {account_id: account.id})
      if(res.success) {
        setData(res.data)
        console.log(res.data);
      }
    }
    else {
      NotificationTemplate.Failed("Fetch Account data")
    }
  }

  // TODO: Your custom logic starts here...

  function changeTheme() {
    const newTheme = theme === Theme.DARK ? Theme.LIGHT : Theme.DARK
    localStorage.setItem('theme', newTheme.className)
    setTheme(newTheme)
    console.log(newTheme.background);
  }

  function handleClick(selected: FollowedWishlist) {
    setSelected(selected)
    setNote(selected.note)
  }

  function handleExit() {
    setSelected(null)
    setNote("")
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const acc = await Auth.getActiveAccount()
    if(acc) {
      const res = await From.Rest.fetchData("/wishlist/follow", "PATCH", {
        account_id: acc.id,
        wishlist_id: selected?.wishlist.id,
        note
      }, Auth.getToken())

      if(res.success) {
        ShowNotification("success", "Success", res.data.status)
        fetchData()
        handleExit()
      }
      else {
        ShowNotification("danger", "Failed", res.data)
      }
    }
    else {
      NotificationTemplate.Failed("fetch account data")
    }
  }

  async function handleUnfollow(e: MouseEvent) {
    e.preventDefault()
    const acc = await Auth.getActiveAccount()
    if(acc) {
      const res = await From.Rest.fetchData("/wishlist/follow", "DELETE", {
        account_id: acc.id,
        wishlist_id: selected?.wishlist.id
      }, Auth.getToken())

      if(res.success) {
        ShowNotification("success", "Success", res.data.status)
        fetchData()
        handleExit()
      }
      else {
        ShowNotification("danger", "Failed", res.data)
      }
    }
    else {
      NotificationTemplate.Failed("fetch account data")
    }
  }

  async function handleDuplicate(e: MouseEvent) {
    e.preventDefault()
    const acc = await Auth.getActiveAccount()
    if(acc) {
      const res = await From.Rest.fetchData("/wishlist/duplicate", "POST", {
        wishlist_id: selected?.wishlist.id, 
        account_id: acc.id
      }, Auth.getToken())

      if(res.success) {
        ShowNotification("success", "Success", res.data.status)
        handleExit()
      }
      else {
        ShowNotification("danger", "Failed", res.data)
      }
    }
    else {
      NotificationTemplate.Failed("fetch account data")
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
              <Comp.H1>My Followed Wishlist</Comp.H1>
              {
                data.map(res => <FollowedWishlistCard followed={res} onClick={handleClick}/>)
              }
            </div>
          </SidebarTemplate>
          <Footer />
        </div>
        <div className={style.popup} style={{display: selected ? "block" : "none"}}>
          <div className={style.detail + " center"} style={{backgroundColor: theme.background2}}>
            <div className={style.exit}>
              <Button.Red onClick={handleExit}>X</Button.Red>
            </div>
            <Comp.H1>Followed Wishlist</Comp.H1>
            <div>
              <form method='post' onSubmit={handleSubmit}>
                <div>
                  <Comp.Label htmlFor='note'>Notes</Comp.Label>
                </div>
                <div>
                  <textarea name="note" id="note" value={note} rows={7} onChange={e => setNote(e.target.value)}/>
                </div>
                <Button.Save />
              </form>
              <div>
                <Comp.H2>Action</Comp.H2>
                <div>
                  <Button.Blue onClick={handleDuplicate}>Duplicate Wishlist</Button.Blue>
                </div>
                <div>
                  <Button.Blue onClick={handleUnfollow}>Unfollow Wishlist</Button.Blue>
                </div>
                <div>
                  <Button.Blue onClick={_ => router.push("/wishlist/" + selected?.wishlist.id)}>View Details</Button.Blue>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ThemeContext.Provider>
    </Auth.Protection>
  )
}