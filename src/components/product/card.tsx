import { DEFAULT_THEME, getTheme, ThemeContext, ThemeType } from '@/contexts/ThemeContext';
import { Auth } from '@/controller/Auth';
import ShowNotification, { NotificationTemplate } from '@/controller/NotificationController';
import { From } from '@/database/api';
import { CartItem } from '@/model/cart';
import { Product } from '@/model/product';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/router';
import { MouseEvent, useContext, useEffect, useState } from 'react';
import { Button, Comp } from '../component';
import style from "./style.module.scss"

interface Props {
  product: Product
  route: string
}

interface Props2 {
  index: number
  cart_item: CartItem,
  onQuantityChange: (idx: number, new_qty: number) => any
}

export const ProductCard = {
  Style1: function(props: Props){
    // TODO: Your hooks starts here...
    const theme = useContext(ThemeContext) // For Theme
    const router = useRouter() // For Navigating

    async function handleNavigate(e: MouseEvent) {
      e.preventDefault()
      
      router.push(
        props.route + 
        (!props.route.endsWith("/") ? "/" : "") +
        props.product.id
      )
    }
    
    // TODO: Put UseState Stuff here
    return (
      <div className={style.card} style={{backgroundColor: theme.cardBG}}>
        <div className={style.image}>
          <img src={props.product.product_images ? props.product.product_images[0].image_link : ""}/>
        </div>
        <div className={style.content}>
          <div className={style.rating}>
            <div className={style.stars}>
              <Icon icon="dashicons:star-filled" className='star'/>
              <Icon icon="dashicons:star-filled" className='star'/>
              <Icon icon="dashicons:star-filled" className='star'/>
              <Icon icon="dashicons:star-half" className='star'/>
              <Icon icon="dashicons:star-empty" className='star'/>
            </div>
            <div>
              <Comp.P>4.5 (20) !In Progress</Comp.P>
            </div>
          </div>
          <div className={style.title}>
            <a onClick={handleNavigate} style={{color: theme.textColor}}>{props.product.product_name}</a>
          </div>
          <div className={style.price}>
            <Comp.H1>${props.product.product_price - props.product.discount}</Comp.H1>
            {
              props.product.discount > 0 ? 
              <Comp.P className={style.discount}><del>${props.product.product_price}</del> In Progress</Comp.P>
              : null
            }
          </div>
          <div className={style.quantity}>
            {
              props.product.product_stock > 0 ?
              <Comp.P>{props.product.product_stock} Item(s) Left</Comp.P>
              : <Comp.P>Sold out</Comp.P>
            }
          </div>
        </div>
      </div>
    )
  },
  Cart: function(props: Props2) {

    const theme = useContext(ThemeContext)

    const [qty, setQty] = useState(props.cart_item.quantity);
    const [deleted, setDeleted] = useState(false)

    function handleChangeQty(num: number) {
      setQty(num)
      props.onQuantityChange(props.index, num)
    }

    async function handleDelete(e: MouseEvent) {
      e.preventDefault()

      const account = await Auth.getActiveAccount()

      if(!account) {
        ShowNotification("danger", "Account Not Exists", "Account Not Exists")
        return
      }

      const res = await From.Rest.fetchData("/account/order/cart", "DELETE", {
        account_id: account.id,
        product_id: props.cart_item.product?.id
      }, Auth.getToken())

      if(res.success) {
        ShowNotification("success", "Deleted Successfully", "Item Deleted Successfully!")
        setDeleted(true)
        props.onQuantityChange(props.index, 0)
        return
      }

      NotificationTemplate.Error()
      console.error(res.raw);
    }

    if(deleted) return null
    else
    return (
      <div className={style.cart}>
        <div className={style.left}>
          <img src={props.cart_item.product?.product_images ? props.cart_item.product?.product_images [0].image_link : ""} />
        </div>
        <div className={style.right}>
          <Comp.H1>{props.cart_item.product?.product_name}</Comp.H1>
          {props.cart_item.product && props.cart_item.product.discount > 0 ? <Comp.P><del>$ props.cart_item.product.discount</del></Comp.P> : null}
          <Comp.P>$ {props.cart_item.product?.product_price && props.cart_item.product?.product_price - props.cart_item.product?.discount}</Comp.P>
          <div className={style.quantity}>
            <label htmlFor="qty" style={{color: theme.textColor}}>Quantity</label>
            <input min={0} type="number" id='qty' name="qty" value={qty} onChange={e => handleChangeQty(parseInt(e.target.value))} />
          </div>
          <div className={style.action}>
            <Button.Delete onClick={handleDelete} />
          </div>
        </div>
      </div>
    )
  }
}