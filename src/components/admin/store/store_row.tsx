import { Button, Comp } from '@/components/component';
import { DEFAULT_THEME, getTheme, Theme, ThemeContext, ThemeType } from '@/contexts/ThemeContext';
import { Auth } from '@/controller/Auth';
import ShowNotification, { NotificationTemplate } from '@/controller/NotificationController';
import { From } from '@/database/api';
import { Account } from '@/model/account';
import { Banner } from '@/model/banner';
import { useRouter } from 'next/router';
import { MouseEvent, useContext, useEffect, useState } from 'react';
import style from "./banner.module.scss"

export interface StoreRowParams {
  idx: number,
  data: Account
}

export default function StoreRow(props: StoreRowParams) {
  const theme = useContext(ThemeContext)
  const router = useRouter()

  // TODO: Your useState starts here...

  // TODO: Your hooks starts here...

  // TODO: Your custom logic starts here...
  async function handleBan(e: MouseEvent) {
    e.preventDefault()
    // NotificationTemplate.InProgress("Ban store account")
    const res = await From.Rest.fetchData("/account/business/status","PATCH", {
      id: props.data.id,
      status: "disabled"
    }, Auth.getToken())

    if(res.success) {
      global.ban = true;
      router.reload();
    }
    else {
      console.error(res.raw);
      NotificationTemplate.Error()
    }
  }
  
  async function handleUnban(e: MouseEvent) {
    e.preventDefault()
    // NotificationTemplate.InProgress("Unban store account")
    const res = await From.Rest.fetchData("/account/business/status","PATCH", {
      id: props.data.id,
      status: "active"
    }, Auth.getToken())

    if(res.success) {
      global.unban = true;
      router.reload()
    }
    else {
      console.error(res.raw);
      NotificationTemplate.Error()
    }
  }

  // TODO: Your React Element starts here...
  return (
    <tr>
      <td><Comp.P>{props.idx + 1}</Comp.P></td>
      <td><Comp.P>{props.data.first_name}</Comp.P></td>
      <td><Comp.P>{props.data.email}</Comp.P></td>
      <td><Comp.P>{props.data.phone}</Comp.P></td>
      <td><Comp.P>{props.data.status}</Comp.P></td>
      <td>
        {
          props.data.status == "active" ?
          <BanAction data={props.data} handle={handleBan} /> :
          <UnbanAction data={props.data} handle={handleUnban} />
        }
      </td>
    </tr>
  )
}

interface BanParams {
  data: Account,
  handle: (e: MouseEvent) => void
}

function BanAction(props: BanParams) {
  const [action, setAction] = useState(false)
  return action ? 
  <>
    <Button.Red onClick={props.handle}>Confirm</Button.Red>
    <Button.Blue onClick={_ => setAction(false)}>Cancel</Button.Blue>
  </>
  :
  <>
    <Button.Red onClick={_ => setAction(true)}>Ban</Button.Red>
  </>
}

function UnbanAction(props: BanParams) {
  const [action, setAction] = useState(false)
  return action ? 
  <>
    <Button.Green onClick={props.handle}>Confirm</Button.Green>
    <Button.Red onClick={_ => setAction(false)}>Cancel</Button.Red>
  </>
  :
  <>
    <Button.Green onClick={_ => setAction(true)}>Unban</Button.Green>
  </>
}