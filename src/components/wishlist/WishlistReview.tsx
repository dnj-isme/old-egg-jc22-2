import { DEFAULT_THEME, getTheme, ThemeContext, ThemeType } from '@/contexts/ThemeContext';
import { Auth } from '@/controller/Auth';
import ShowNotification, { NotificationTemplate } from '@/controller/NotificationController';
import { GetStars } from '@/controller/Utility';
import { From } from '@/database/api';
import { SampleQuery } from '@/database/query';
import { Account } from '@/model/account';
import { StoreReviews } from '@/model/store';
import { Wishlist } from '@/model/wishlist';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/router';
import { FormEvent, MouseEvent, useContext, useEffect, useState } from 'react';
import { Button, Comp } from '../component';

import style from "./sidebar.module.scss"
interface Data {
  star1: number,
  star2: number,
  star3: number,
  star4: number,
  star5: number,
  average: number
}
interface Props {
  wishlist?: Wishlist
  children?: JSX.Element | JSX.Element[]
}

export default function WishlistReviewTemplate(props: Props) {
  // TODO: Your hooks starts here...
  const theme = useContext(ThemeContext) // For Theme
  
  // TODO: Put Your Custom Logic here
  
  // TODO: Your React Element starts here...
  return (
    <div className={style.component} style={{backgroundColor: theme.cardBG}}>
      <div className={style.left}>
        <Sidebar wishlist={props.wishlist} />
      </div>
      <div className={style.right}>
        {props.children}
      </div>
    </div>
  )
}

function Sidebar(props: Props) {
  const router = useRouter() // For Navigating
  
  const {wishlist} = props

  useEffect(effect, [])

  function effect() {
    
    if(wishlist) {
      let data: Data = {average: 0,star1: 0,star2: 0,star3: 0,star4: 0,star5: 0}
      let sum = 0
      wishlist.reviews.forEach(r => {
        if(r.rating == 1) {data.star1++; sum += 1}
        if(r.rating == 2) {data.star2++; sum += 2}
        if(r.rating == 3) {data.star3++; sum += 3}
        if(r.rating == 4) {data.star4++; sum += 4}
        if(r.rating == 5) {data.star5++; sum += 5}
      })
      if(wishlist.reviews.length > 0) data.average = sum / wishlist.reviews.length

      setData(data)
    }
  }

  const [rating, setRating] = useState(0)
  const [detail, setDetails] = useState('')
  const [anonymous, setAnonymous] = useState(false)
  const [data, setData] = useState<Data>({average: 0,star1: 0,star2: 0,star3: 0,star4: 0,star5: 0})

  async function handleSubmit(e?: FormEvent) {
    e?.preventDefault()

    const account = await Auth.getActiveAccount()

    if(!account) {
      ShowNotification("danger", "Error", "User must logged in order to leave review / feedback")
      return
    }
    if(!wishlist) {
      NotificationTemplate.Failed("Fetching account data or wishlist data")
      return
    }
    const res = await From.Rest.fetchData("/wishlist/feedback", "POST", {
      account_id: account.id,
      wishlist_id: wishlist.id,
      detail,
      rating,
      anonymous
    }, Auth.getToken())

    if(res.success) {
      router.reload()
    }
    else {
      ShowNotification("danger", "Failed", res.data)
    }
  }

  return <ul className={'center ' + style.list}>
    <li><Comp.H1>Write your own Review</Comp.H1></li>
    <form className='center' method='post' onSubmit={handleSubmit}>
      <li><input type="number" name="rating" id="rating" min={1} max={5} placeholder="Your Review (1 - 5)" onChange={e => setRating(parseInt(e.target.value))}/></li>
      <li><textarea name="details" id="details" placeholder="Write your details" onChange={e => setDetails(e.target.value)}/></li>
      <li>
        <Comp.Label htmlFor='anonymous'>Comment as Anonymous</Comp.Label>
        <input type="checkbox" name="anonymous" id="anonymous" onChange={e => setAnonymous(e.target.checked)}/>
      </li>
      <li>
        <Button.Submit>Save Review</Button.Submit>
      </li>
    </form>

    <li><Comp.H1>Average</Comp.H1></li>
    <Comp.H2>{GetStars(data.average)} ({data.average})</Comp.H2>

    <li><Comp.H1>Review Summary</Comp.H1></li>
    <li>
      <div><Comp.P>{GetStars(1)} : {data.star1}</Comp.P></div>
      <div><Comp.P>{GetStars(2)} : {data.star2}</Comp.P></div>
      <div><Comp.P>{GetStars(3)} : {data.star3}</Comp.P></div>
      <div><Comp.P>{GetStars(4)} : {data.star4}</Comp.P></div>
      <div><Comp.P>{GetStars(5)} : {data.star5}</Comp.P></div>
    </li>

    <li><Comp.H1>Reviews</Comp.H1></li>
    {
      wishlist?.reviews.map(r => (
        <li className='center'>
          <Comp.P>{GetStars(r.rating)}</Comp.P>
          <Comp.P>By: {r.anonymous ? "Anonymous" : r.account.first_name}</Comp.P>
          <Comp.P>{wishlist.description}</Comp.P>
        </li>
      ))
    }
  </ul>
}