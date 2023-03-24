import { Button, Comp } from '@/components/component';
import { DEFAULT_THEME, getTheme, ThemeContext, ThemeType } from '@/contexts/ThemeContext';
import ShowNotification from '@/controller/NotificationController';
import { GetQueryString, ParseFilter } from '@/controller/ParseFilter';
import { Pagination, WishlistFilterInput } from '@/model/filtering';
import { useRouter } from 'next/router';
import { FormEvent, MouseEvent, useContext, useEffect, useState } from 'react';

import style from "./style.module.scss"

interface Props {
  children?: JSX.Element | JSX.Element[]
  pagination?: Pagination
  filter?: WishlistFilterInput
}

export default function WishlistSidebarTemplate(props: Props) {
  // TODO: Your hooks starts here...
  const theme = useContext(ThemeContext) // For Theme
  
  // TODO: Put UseState Stuff here

  // TODO: Put UseEffect Stuff Here

  // TODO: Put Your Custom Logic here

  // TODO: Your React Element starts here...
  return (
    <div className={style.component} style={{backgroundColor: theme.background}}>
      <div className={style.left}>
        <Sidebar />
      </div>
      <div className={style.rignt}>
        {props.children}
      </div>
    </div>
  )
}

function Sidebar(props: Props) {
  const router = useRouter()

  const [search, setSearch] = useState('')

  const [item, setItem] = useState<number>(props.pagination && props.pagination.contentsPerPage ? props.pagination?.contentsPerPage : 20)

  function handleFilter(e: MouseEvent | FormEvent) {
    e.preventDefault()

    let filter: WishlistFilterInput = {
      search
    }

    let pagination = props.pagination

    if(pagination) {
      pagination.contentsPerPage = item
    }
    else {
      pagination = {
        contentsPerPage: item,
        page: 1
      }
    }

    console.log(pagination);
    

    router.push("wishlist" + GetQueryString(pagination, undefined, filter))
  }

  return (
    <ul>
      <Comp.H1>Search</Comp.H1>
      <li>
        <form onSubmit={handleFilter}>
          <input type="text" name="search" id="search" placeholder='search' onChange={e => setSearch(e.target.value)}/>
          <Button.Blue type='submit'>🔍</Button.Blue>
        </form>
      </li>
      <li>
        <Comp.H2>Display Items</Comp.H2>
        <div>
          <input type="radio" name="items" id="item1" value={15} onChange={_ => setItem(15)} checked={item == 15}/>
          <Comp.Label htmlFor='item1'>15 item(s)</Comp.Label>
        </div>
        <div>
          <input type="radio" name="items" id="default" value={20} onChange={_ => setItem(20)} checked={item == 20}/>
          <Comp.Label htmlFor='default'>20 item(s)</Comp.Label>
        </div>
        <div>
          <input type="radio" name="items" id="item2" value={30} onChange={_ => setItem(30)} checked={item == 30}/>
          <Comp.Label htmlFor='item2'>30 item(s)</Comp.Label>
        </div>
        <div>
          <input type="radio" name="items" id="item3" value={60} onChange={_ => setItem(60)} checked={item == 60}/>
          <Comp.Label htmlFor='item3'>60 item(s)</Comp.Label>
        </div>
        <div>
          <input type="radio" name="items" id="item4" value={90} onChange={_ => setItem(90)} checked={item == 90}/>
          <Comp.Label htmlFor='item4'>90 item(s)</Comp.Label>
        </div>
      </li>
    </ul>
  )
}