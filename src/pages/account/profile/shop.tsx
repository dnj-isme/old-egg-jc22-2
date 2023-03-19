import { DEFAULT_THEME, getTheme, Theme, ThemeContext, ThemeType } from '@/contexts/ThemeContext';
import { Auth } from '@/controller/Auth';
import { useRouter } from 'next/router';
import ShowNotification, { NotificationTemplate } from '@/controller/NotificationController';
import { FormEvent, MouseEvent, useEffect, useState } from 'react';
import Footer from '@/components/footer/footer';
import Navbar from '@/components/navbar/navbar';
import { ReactNotifications } from 'react-notifications-component';
import SidebarTemplate from '@/components/base';
import { StoreDetail } from '@/model/store';
import { From } from '@/database/api';
import { SampleQuery } from '@/database/query';

import style from "./profile.module.scss"
import { Button, Comp } from '@/components/component';
import uploadImage from '@/controller/FileUploader';

export default function shop() {
  // TODO: Your hooks starts here
  const router = useRouter() // For Navigating

  // TODO: Your useState starts here
  const [theme, setTheme] = useState<ThemeType>(DEFAULT_THEME)
  const [storeDetail, setStoreDetail] = useState<StoreDetail | null>()
  const [file, setFile] = useState<File | null>()

  const [about, setAbout] = useState('')
  const [policy, setPolicy] = useState('')

  // TODO: Your useEffect starts here
  useEffect(() => {
    const sessionTheme = getTheme(localStorage.getItem('theme'))
    localStorage.setItem('theme', sessionTheme.className)
    setTheme(sessionTheme)

    fetchStoreDetails()
  }, [])

  async function fetchStoreDetails() {
    const acc = await Auth.getActiveAccount()
    if(acc != null) {
      console.log(acc.id);
      const res = await From.Graphql.execute(SampleQuery.storeDetail, {id: acc.id})
      console.log(res.data);
      if(res.success) {
        setStoreDetail(res.data)
        
        setAbout(res.data.about)
        setPolicy(res.data.return_policy)
      }
    }
    else {
      ShowNotification("danger", "Error", "Unable to fetch account")
    }
  }

  // TODO: Your custom logic starts here...

  function changeTheme() {
    const newTheme = theme === Theme.DARK ? Theme.LIGHT : Theme.DARK
    localStorage.setItem('theme', newTheme.className)
    setTheme(newTheme)
    console.log(newTheme.background);
  }

  async function changeImage(e: FormEvent) {
    e.preventDefault()

    const acc = await Auth.getActiveAccount()
    if(!acc) {
      ShowNotification("danger", "Error", "Unable to fetch Account Data!")
      return
    }

    if(!file) {
      ShowNotification("danger", "Error", "You don't input any file!")
      return
    }
    
    const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
    if(!validImageTypes.includes(file.type)) {
      ShowNotification("danger", "Error", "Uploaded file must in image format!")
      return
    }
    
    const res = await uploadImage(file, "shop/banner/")
    if(res.success) {
      const fetchRes = await From.Rest.fetchData("/shop/banner", "PATCH", {
        account_id: acc.id,
        banner: res.data
      }, Auth.getToken())

      if(fetchRes.success) {
        router.reload()
      } else {
        NotificationTemplate.Error()
        console.error(fetchRes);
      }
    }
    else {
      NotificationTemplate.Error()
      return;
    }
  }

  async function navigateProfile(e: MouseEvent) {
    e.preventDefault()

    const acc = await Auth.getActiveAccount()

    if(acc != null) {
      router.push("/shop/" + acc.id)
    }
    else {
      ShowNotification("danger", "error", "Error in fetching active account")
    }
  }

  async function changeProfile(e: FormEvent) {
    e.preventDefault()
    
    const acc = await Auth.getActiveAccount()
    if(!acc) {
      ShowNotification("danger", "Error", "Unable to fetch Account Data!")
      return
    }

    let a = about
    let p = policy

    if(a == "") a = "The store doesn't decide to put store"
    if(p == "") p = "The store doesn't decide to put policy"

    const res = await From.Rest.fetchData("/shop/profile", "PATCH", {
      account_id: acc.id,
      about: a,
      return_policy: p
    }, Auth.getToken())

    if(res.success) {
      ShowNotification("success", "Success", "Data updated successfully!")
    }
    else {
      ShowNotification("danger", "error", "Error in updating data")
    }  
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
            <div className={style.content}>
              <div>
                <img src={storeDetail?.banner} className={style.banner}/>
                <form onSubmit={changeImage}>
                  <div>
                    <input type="file" style={{color: theme.textColor}} multiple onChange={e => setFile(e.target.files?.item(0))} />
                  </div>
                  <Button.Green type="submit">Change Image</Button.Green>
                </form>
                <Comp.H1>{storeDetail?.account.first_name}</Comp.H1>
                <form onSubmit={changeProfile}>
                  <table>
                    <tbody>
                      <tr>
                        <td><label htmlFor="about" style={{color: theme.textColor}}>About Us</label></td>
                        <td>
                          <textarea id='about' cols={100} rows={10} onChange={e => setAbout(e.target.value)} value={about}/>
                        </td>
                      </tr>
                      <tr>
                        <td><label htmlFor="about" style={{color: theme.textColor}}>Return Policy</label></td>
                        <td>
                          <textarea id='about' cols={100} rows={10} onChange={e => setPolicy(e.target.value)} value={policy}/>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <Button.Submit>Save Changes</Button.Submit>
                  <Button.Yellow onClick={navigateProfile}>View Profile</Button.Yellow>
                </form>
              </div>
            </div>
          </SidebarTemplate>
          <Footer />
        </div>
      </ThemeContext.Provider>
    </Auth.Protection>
  )
}