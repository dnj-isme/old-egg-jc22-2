import { DEFAULT_THEME, getTheme, ThemeContext, ThemeType } from '@/contexts/ThemeContext';
import { Auth } from '@/controller/Auth';
import ShowNotification, { NotificationTemplate } from '@/controller/NotificationController';
import { GetStars } from '@/controller/Utility';
import { From } from '@/database/api';
import { WishlistDetail } from '@/model/wishlist';
import { useRouter } from 'next/router';
import { MouseEvent, useContext, useEffect, useState } from 'react';
import { Button, Comp } from '../component';

import style from "./style.module.scss"

interface Props {
  detail : WishlistDetail
  id: string
}

export default function WishlistProductCard (props: Props){
  // TODO: Your hooks starts here...
  const theme = useContext(ThemeContext) // For Theme
  const router = useRouter() // For Navigating

  const {product, quantity} = props.detail
  
  const [q, setQ] = useState(quantity)
  const [display, setDisplay] = useState('block')

  async function handleQuantity(qty: number) {
    setQ(qty)

    const res = await From.Rest.fetchData("/wishlist/detail", "POST", {
      wishlist_id: props.id,
      product_id: product.id,
      quantity: qty
    }, Auth.getToken())

    if(!res.success) {
      ShowNotification("danger", "Error", res.data)
      console.error(res.data);
    }
  }

  async function handleDelete(e: MouseEvent) {
    e.preventDefault()
    setDisplay("none")

    const res = await From.Rest.fetchData("/wishlist/detail", "DELETE", {
      wishlist_id: props.id,
      product_id: product.id,
    }, Auth.getToken())

    if(res.success) {
      ShowNotification("success", "Success", res.data.status)
      setDisplay("none")
    }
    else {
      ShowNotification("danger", "Failed", res.data)
    }
  }

  // TODO: Put UseState Stuff here
  return (
    <div className={style.component} style={{backgroundColor: theme.cardBG, display}}>
      <div className={style.image}>
        <img src={product.product_images ? product.product_images[0].image_link : ""}/>
      </div>
      <div className={style.content}>
        <div className={style.rating}>
          <div className={style.stars}>
            {GetStars(3.5)}
          </div>
          <div>
            <Comp.P>4.5 (20) !In Progress</Comp.P>
          </div>
        </div>
        <div className={style.title}>
          <Comp.H1>
            {product.product_name}
          </Comp.H1>
        </div>
        <div className={style.price}>
          <Comp.H1>${product.product_price - product.discount}</Comp.H1>
          {
            product.discount > 0 ? 
            <Comp.P className={style.discount}><del>${product.product_price}</del> In Progress</Comp.P>
            : null
          }
        </div>
        <div className={style.quantity}>
          <Comp.Label htmlFor='quantity'>Quantity</Comp.Label>
          <input min={1} step={1} type="number" name="quantity" id="quantity" value={q} onChange={e => handleQuantity(parseInt(e.target.value))}/>
        </div>
        <div className='center'>
          <Button.Blue onClick={_ => router.push("/product/" + product.id)}>View Product</Button.Blue>
          <Button.Delete onClick={handleDelete}/>
        </div>
      </div>
    </div>
  )
}