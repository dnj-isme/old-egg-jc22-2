import { DEFAULT_THEME, getTheme, ThemeContext, ThemeType } from '@/contexts/ThemeContext';
import { Auth } from '@/controller/Auth';
import ShowNotification, { NotificationTemplate } from '@/controller/NotificationController';
import { GetStars } from '@/controller/Utility';
import { From } from '@/database/api';
import { SampleQuery } from '@/database/query';
import { Account } from '@/model/account';
import { StoreReviews } from '@/model/store';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/router';
import { MouseEvent, useContext, useEffect, useState } from 'react';
import { Button, Comp } from '../component';

import style from "./style.module.scss"

interface Props {
  review: StoreReviews
}

export default function StoreReview(props: Props) {
  // TODO: Your hooks starts here...
  const theme = useContext(ThemeContext) // For Theme
  const router = useRouter() // For Navigating

  const {review} = props
  
  // TODO: Put UseState Stuff here

  const [helpful, setHelpful] = useState(review.helpful)
  const [notHelpful, setNotHelpful] = useState(review.notHelpful)
  const [account, setAccount] = useState<Account | null>(null)

  const [status, setStatus] = useState(0)

  // TODO: Put UseEffect Stuff Here
  useEffect(() => {effect()}, [])

  async function effect() {
    const acc = await Auth.getActiveAccount()
    setAccount(acc)
    if(acc) {
      const res = await From.Graphql.execute(SampleQuery.viewStoreReviewUsefulness, {
        account_id: acc.id,
        store_review_id: review.id 
      })
      if(res.success) {
        const s = res.data
        if(s == 'helpful') setStatus(1)
        if(s == '') setStatus(0)
        if(s == 'not helpful') setStatus(-1)
      }
    }
  }

  // TODO: Put Your Custom Logic here

  function handleHelpful(e: MouseEvent) {
    if(!account) {
      router.push("/auth/signin")
      return
    }
    
    e.preventDefault()
    let newStatus = 0
    if(status == -1) {
      setHelpful(helpful + 1)
      setNotHelpful(notHelpful - 1)
      newStatus = 1
    }
    if(status == 0) {
      setHelpful(helpful + 1)
      newStatus = 1
    }
    if(status == 1) {
      setHelpful(helpful - 1)
      newStatus = 0
    }
    setStatus(newStatus)
    updateAPI(newStatus)
  }
  
  function handleNotHelpful(e: MouseEvent) {
    if(!account) {
      router.push("/auth/signin")
      return
    }

    e.preventDefault()
    let newStatus = 0
    if(status == 1) {
      setNotHelpful(notHelpful + 1)
      setHelpful(helpful - 1)
      newStatus = -1
    }
    if(status == 0) {
      setNotHelpful(notHelpful + 1)
      setStatus(-1)
      newStatus = -1
    }
    if(status == -1) {
      setNotHelpful(notHelpful - 1)
      newStatus = 0
    }
    setStatus(newStatus)
    updateAPI(newStatus)
  }

  async function updateAPI(status: number) {
    let statusText = ''
    if(status == 1) statusText = "helpful"
    if(status == -1) statusText = "not helpful"

    if(account) {
      const res = await From.Rest.fetchData("/shop/review/helpful", "POST", {
        store_review_id: review.id,
        account_id: account.id,
        status: statusText
      }, Auth.getToken())

      if (!res.success) {
        console.error(res.raw);
        NotificationTemplate.Error()
      }
    }
    else {
      ShowNotification("danger", "Error", "Failed Attempt to get account data")
    }
  }

  // TODO: Your React Element starts here...
  return (
    <div className={style.component} style={{backgroundColor: theme.cardBG}}>
      <div className={style.left}>
        <Icon icon="ic:baseline-account-circle" className={style.icon} style={{color: theme.textColor}}/>
        <Comp.P>{review.account.first_name}</Comp.P>
      </div>
      <div className={style.right}>
        {GetStars(review.rating)}
        <Comp.P>{review.created_at}</Comp.P>
        <Comp.P>{review.description}</Comp.P>
        <div>
          <Button.Blue onClick={handleHelpful}><>👍 {helpful}</></Button.Blue>
          <Button.Blue onClick={handleNotHelpful}><>👎 {notHelpful}</></Button.Blue>
        </div>
      </div>
    </div>
  )
}