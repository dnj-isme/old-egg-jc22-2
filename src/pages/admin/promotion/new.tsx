import { DEFAULT_THEME, getTheme, Theme, ThemeContext, ThemeType } from '@/contexts/ThemeContext';
import { Auth } from '@/controller/Auth';
import { useRouter } from 'next/router';
import ShowNotification, { NotificationTemplate } from '@/controller/NotificationController';
import { FormEvent, MouseEvent, useEffect, useRef, useState } from 'react';
import Footer from '@/components/footer/footer';
import Navbar from '@/components/navbar/navbar';
import { ReactNotifications } from 'react-notifications-component';
import Sidebar from '@/components/admin/topbar/topbar';
import { Button, Comp } from '@/components/component';
import BannerList from '@/components/admin/promotion/banner_table';
import style from "./style.module.scss"
import uploadImage from '@/controller/FileUploader';
import { From } from '@/database/api';

export default function index() {
  // TODO: Your hooks starts here
  const router = useRouter() // For Navigating

  // TODO: Your useState starts here
  const [theme, setTheme] = useState<ThemeType>(DEFAULT_THEME)
  const [label, setLabel] = useState('')
  const [file, setFile] = useState<File | undefined | null>()
  const [src, setSrc] = useState('')
  const [link, setLink] = useState('')

  const [upload, setUpload] = useState(true)

  // TODO: Your useEffect starts here
  useEffect(() => {
    const sessionTheme = getTheme(sessionStorage.getItem('theme'))
    sessionStorage.setItem('theme', sessionTheme.className)
    setTheme(sessionTheme)
  }, [])

  // TODO: Your custom logic starts here...

  function changeTheme() {
    const newTheme = theme === Theme.DARK ? Theme.LIGHT : Theme.DARK
    sessionStorage.setItem('theme', newTheme.className)
    setTheme(newTheme)
    console.log(newTheme.background);
  }

  async function checkLinkValidity(link: string): Promise<boolean> {
    try {
      const response = await fetch(link, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  async function handleCreateBanner(e: FormEvent) {
    e.preventDefault()

    let error = false;
    if ((upload && !file) || (!upload && !src)) {
      ShowNotification("danger", "Error", "Image cannot be empty!")
      error = true;
    }
    
    if(file && upload) {
      const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
      if(!validImageTypes.includes(file.type)) {
        ShowNotification("danger", "Error", "Uploaded file must in image format!")
        error = true;
      }
    }

    if(src && !upload) {
      if(!src.match(/\.(jpeg|jpg|gif|png)$/) == null) {
        ShowNotification("danger", "Error", "Your src link must in image format")
        error = true;
      }
    }

    let srcLink = src;
    if(!error && file && upload) {
      const res = await uploadImage(file, "banner/")
      if(res.success) {
        srcLink = res.data;
      }
      else {
        NotificationTemplate.Error()
        return;
      }
    }

    const res = await From.Rest.fetchData("/admin/banner", "POST", {
      label,
      src: srcLink,
      link,
      status: "active"
    }, Auth.getToken())
    if(res.success) {
      global.bannerInsert = true;
      router.back()
    }
    else{
      NotificationTemplate.Error()
      console.error(res.raw);
    }
  }

  function changeUpload(e: MouseEvent) {
    e.preventDefault()
    setUpload(!upload)
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
          <div>
            <Navbar changeTheme={changeTheme}/>
            <Sidebar />
          </div>
          <div className={style.content} style={{backgroundColor: theme.background}}>
            <Comp.H1>Create Banner</Comp.H1>
            
            <form method="post" onSubmit={handleCreateBanner} className="flex-column align-center" >
              <table>
                <tbody>
                  <tr>
                    <td><label style={{color: theme.textColor}} htmlFor="label">Input Label (optional)</label></td>
                    <td>
                      <input type="text" name="label" id="label" onChange={e => setLabel(e.target.value)} placeholder="Label"/>
                    </td>
                  </tr>
                  <tr>
                    <td><label htmlFor="fileSrc" style={{color: theme.textColor}}>Image</label></td>
                    <td>
                      <div>
                        <div style={{display: upload? "none" : "initial"}}>
                          <input type="url" name="fileSrc" id="fileSrc" onChange={e => setSrc(e.target.value)} placeholder="Image URL"/>
                          <br />
                          <Button.Green onClick={changeUpload}>Upload image instead</Button.Green>
                        </div>
                        <div style={{display: !upload? "none" : "initial"}}>
                          <input style={{color: theme.textColor}} type="file" name="file" id="file" onChange={e => setFile(e.target.files?.item(0))}/>
                          <br />
                          <Button.Green onClick={changeUpload}>Input URL instead</Button.Green>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td><label style={{color: theme.textColor}} htmlFor="link">Input Link (optional)</label></td>
                    <td>
                      <div>
                        <input type="url" name="link" id="link" onChange={e => setLink(e.target.value)} placeholder="Link"/>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>

              <Button.Submit>Submit</Button.Submit>
            </form>
          </div>
          <Footer />
        </div>
      </ThemeContext.Provider>
    </Auth.Protection>
  )
}