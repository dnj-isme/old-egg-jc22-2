import { DEFAULT_THEME, getTheme, ThemeContext, ThemeType } from '@/contexts/ThemeContext';
import { From } from '@/database/api';
import { FollowedWishlist, Wishlist } from '@/model/wishlist';
import { MouseEvent, useContext, useEffect, useState } from 'react';
import { Button, Comp } from '../component';

import style from "./style.module.scss"

interface Props {
  followed: FollowedWishlist
  onClick: (wishlist: FollowedWishlist) => any
}

export default function FollowedWishlistCard(props: Props) {
  // TODO: Your hooks starts here...
  const theme = useContext(ThemeContext) // For Theme

  const {followed, onClick} = props
  
  // TODO: Put UseState Stuff here

  // TODO: Put UseEffect Stuff Here

  // TODO: Put Your Custom Logic here
  function handleClick(e: MouseEvent) {
    e.preventDefault()
    onClick(followed)
  }

  // TODO: Your React Element starts here...
  return (
    <a onClick={handleClick} className={style.component} style={{backgroundColor: theme.cardBG}}>
      <Comp.H1>{followed.wishlist.title}</Comp.H1>
      <Comp.H2>{followed.wishlist.public_wishlist ? "Public" : "Private"} Wishlist</Comp.H2>
      <Comp.P>By {followed.wishlist.account.first_name}</Comp.P>
      <Comp.P>Promo: {followed.wishlist.promo.toString()}</Comp.P>
      <Comp.P>Reviews: {followed.wishlist.reviews.length}</Comp.P>
      <Comp.P>Total Price: ${followed.wishlist.total_price}</Comp.P>
      <br />
      <Comp.H2>Note</Comp.H2>
      <Comp.P>{followed.note}</Comp.P>
    </a>
  )
}