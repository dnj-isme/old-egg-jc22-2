import { DEFAULT_THEME, getTheme, ThemeContext, ThemeType } from '@/contexts/ThemeContext';
import { From } from '@/database/api';
import { Wishlist } from '@/model/wishlist';
import { MouseEvent, useContext, useEffect, useState } from 'react';
import { Button, Comp } from '../component';

import style from "./style.module.scss"

interface Props {
  wishlist: Wishlist
  onClick: (wishlist: Wishlist) => any
}

export default function WishlistCard(props: Props) {
  // TODO: Your hooks starts here...
  const theme = useContext(ThemeContext) // For Theme

  const {wishlist, onClick} = props
  
  // TODO: Put UseState Stuff here

  // TODO: Put UseEffect Stuff Here

  // TODO: Put Your Custom Logic here
  function handleClick(e: MouseEvent) {
    e.preventDefault()
    onClick(wishlist)
  }

  // TODO: Your React Element starts here...
  return (
    <a onClick={handleClick} className={style.component} style={{backgroundColor: theme.cardBG}}>
      <Comp.H1>{wishlist.title}</Comp.H1>
      <Comp.H2>{wishlist.public_wishlist ? "Public" : "Private"} Wishlist</Comp.H2>
      <Comp.P>By {wishlist.account.first_name}</Comp.P>
      <Comp.P>Promo: {wishlist.promo.toString()}</Comp.P>
      <Comp.P>Reviews: {wishlist.reviews.length}</Comp.P>
      <Comp.P>Total Price: ${wishlist.total_price}</Comp.P>
    </a>
  )
}