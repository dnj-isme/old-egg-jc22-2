import { DEFAULT_THEME, getTheme, Theme, ThemeContext, ThemeType } from '@/contexts/ThemeContext';
import { Auth } from '@/controller/Auth';
import { useRouter } from 'next/router';
import ShowNotification, { NotificationTemplate } from '@/controller/NotificationController';
import { FormEvent, useEffect, useState } from 'react';
import Footer from '@/components/footer/footer';
import Navbar from '@/components/navbar/navbar';
import { ReactNotifications } from 'react-notifications-component';
import SidebarTemplate from '@/components/base';
import { Button, Comp } from '@/components/component';
import { From } from '@/database/api';
import { SampleQuery } from '@/database/query';
import { Voucher } from '@/model/voucher';

import style from "./style.module.scss"

export default function index() {
  // TODO: Your hooks starts here
  const router = useRouter() // For Navigating

  // TODO: Your useState starts here
  const [theme, setTheme] = useState<ThemeType>(DEFAULT_THEME)
  const [id, setId] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [value, setValue] = useState(0)
  const [valid, setValid] = useState('')
  const [one_time, setOneTime] = useState(false)
  const [vouchers, setVouchers] = useState<Voucher[]>([])

  // TODO: Your useEffect starts here
  useEffect(() => {
    const sessionTheme = getTheme(localStorage.getItem('theme'))
    localStorage.setItem('theme', sessionTheme.className)
    setTheme(sessionTheme)
    fetchVouchers()
  }, [])

  async function fetchVouchers() {
    const res = await From.Graphql.execute(SampleQuery.vouchers)
    if(res.success) {
      setVouchers(res.data)
    }
    else {
      NotificationTemplate.Failed("Fetch Voucher Data")
    }
  }

  // TODO: Your custom logic starts here...

  function changeTheme() {
    const newTheme = theme === Theme.DARK ? Theme.LIGHT : Theme.DARK
    localStorage.setItem('theme', newTheme.className)
    setTheme(newTheme)
    console.log(newTheme.background);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const valid_until = new Date(valid).toJSON()
    const res = await From.Rest.fetchData("/voucher", "POST", {
      id,
      title,
      description,
      value,
      one_time,
      valid_until
    }, Auth.getToken())
    if(res.success) {
      ShowNotification("success", "Success", res.data.status)
      fetchVouchers()
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
      MustAdmin
    >
      <ThemeContext.Provider value={theme}>
        <ReactNotifications />
        <div className='main' style={{backgroundColor: theme.background}}>
          <Navbar changeTheme={changeTheme}/>
          <SidebarTemplate>
            <div className='center'>
              <div>
                <Comp.H1>Generate Voucher</Comp.H1>
                <form method='post' className='center' onSubmit={handleSubmit}>
                  <table>
                    <tbody>
                      <tr>
                        <td><Comp.Label htmlFor='id'>ID (Access Code)</Comp.Label></td>
                        <td><input type="text" name="id" id="id" required onChange={e => setId(e.target.value)} placeholder="6 digit of number"/></td>
                      </tr>
                      <tr>
                        <td><Comp.Label htmlFor='title'>Title</Comp.Label></td>
                        <td><input type="text" name="title" id="title" required onChange={e => setTitle(e.target.value)} /></td>
                      </tr>
                      <tr>
                        <td><Comp.Label htmlFor='description'>Description</Comp.Label></td>
                        <td><input type="text" name="description" id="description" onChange={e => setDescription(e.target.value)} /></td>
                      </tr>
                      <tr>
                        <td><Comp.Label htmlFor='value'>Value</Comp.Label></td>
                        <td><input type="number" name="value" id="value" required onChange={e => setValue(parseInt(e.target.value))} /></td>
                      </tr>
                      <tr>
                        <td><Comp.Label htmlFor='valid'>Valid Until</Comp.Label></td>
                        <td><input type="date" name="valid" id="valid" required onChange={e => setValid(e.target.value)} /></td>
                      </tr>
                      <tr>
                        <td><Comp.Label htmlFor='onetime'>One Time Use</Comp.Label></td>
                        <td><input type="checkbox" name="onetime" id="onetime" onChange={e => setOneTime(e.target.checked)} /></td>
                      </tr>
                    </tbody>
                  </table>
                  <Button.Blue type='submit'>Add</Button.Blue>
                </form>
              </div>
              <div>
                <Comp.H1>Voucher List</Comp.H1>
                {
                  vouchers.length == 0 ? <Comp.H2>No Voucher</Comp.H2> :
                  <table className={style.table}>
                    <thead>
                      <tr>
                        <td><Comp.P>No</Comp.P></td>
                        <td><Comp.P>Access Code</Comp.P></td>
                        <td><Comp.P>Title</Comp.P></td>
                        <td><Comp.P>Description</Comp.P></td>
                        <td><Comp.P>Value</Comp.P></td>
                        <td><Comp.P>Valid Until</Comp.P></td>
                        <td><Comp.P>Used</Comp.P></td>
                        <td><Comp.P>One Time Use</Comp.P></td>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        vouchers.map((v, idx) => (
                          <tr>
                            <td><Comp.P>{idx + 1}</Comp.P></td>
                            <td><Comp.P>{v.id}</Comp.P></td>
                            <td><Comp.P>{v.title}</Comp.P></td>
                            <td><Comp.P>{v.description}</Comp.P></td>
                            <td><Comp.P>{v.value}</Comp.P></td>
                            <td><Comp.P>{v.valid_until}</Comp.P></td>
                            <td><Comp.P>{v.used.toString()}</Comp.P></td>
                            <td><Comp.P>{v.one_time.toString()}</Comp.P></td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
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