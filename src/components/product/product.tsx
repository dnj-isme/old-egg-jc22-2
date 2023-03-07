import { DEFAULT_THEME, getTheme, ThemeContext, ThemeType } from '@/contexts/ThemeContext';
import { Auth } from '@/controller/Auth';
import { CartController } from '@/controller/CartController';
import ShowNotification from '@/controller/NotificationController';
import { Account } from '@/model/account';
import { Product } from '@/model/product';
import { useRouter } from 'next/router';
import { FormEvent, useContext, useEffect, useState } from 'react';
import { Button, Comp } from '../component';

import style from './product.module.scss'

interface Props {
  product: Product
}

export const ProductDisplay = {
  Detail: function(props: Props) {
    // TODO: Your hooks starts here...
    const theme = useContext(ThemeContext) // For Theme
    const router = useRouter() // For Navigating

    // TODO: Your React Element starts here...
    return (
      <div className={style.information} style={{backgroundColor: theme.background}}>
        <div className={style.left}>
          <img src={props.product.product_images?.at(0)?.image_link} />
        </div>
        <div className={style.right}>
          <div className={style.data}>
            <div className={style.title}>
              <Comp.H1>{props.product.product_name}</Comp.H1>
            </div>
            <div className={style.store}>
              <Comp.A href={props.product.store ? "/shop/" + props.product.store.id : ""}>{props.product.store?.first_name}</Comp.A>
            </div>
            <div className={style.rating}>
              <Comp.P>Rating In Progress</Comp.P>
            </div>
            <div className={style.details}>
              <div className={style.description}>
                <Comp.P>{props.product.description}</Comp.P>
              </div>
              <div className={style.specs}>
                <table>
                  <thead>
                    <tr>
                      <td style={{color: theme.textColor}}>Specs</td>
                      <td style={{color: theme.textColor}}>Details</td>
                    </tr>
                  </thead>
                  <tbody>
                    {props.product.product_specs?.map(spec => (
                      <tr>
                        <td style={{color: theme.textColor}}>{spec.key}</td>
                        <td style={{color: theme.textColor}}>{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className={style.action}>
            <ProductDisplay.Action product={props.product} />  
          </div>
        </div>
      </div>
    )
  },
  Action: function(props: Props) {
    const theme = useContext(ThemeContext) // For Theme
    const router = useRouter() // For Navigating

    const [qty, setQty] = useState(0)
    const [account, setAccount] = useState<Account | null>(null)
    const [added, setAdded] = useState(false)

    useEffect(() => {effect()}, [])

    async function effect() {
      setAccount(await Auth.getActiveAccount())
    }

    async function handleAddToCart(e: FormEvent) {
      e.preventDefault()

      if(qty == 0) {
        ShowNotification("danger", "Error", "Quantity must more than 0")
        return
      }

      if(account) {
        if(account.id == props.product.store?.id) {
          ShowNotification("warning", "Error", "You cannot add your own product to the cart")
          return
        }
        else {
          CartController.AddToCart(account, props.product, qty)
          setAdded(true)
        }
      }
      else {
        router.push("/auth/signin")
      }
    }

    return (
      <div className={style.action}>
        <div className={style.price}>
          <Comp.H1>Price</Comp.H1>
          <Comp.P> {props.product.discount > 0 ? <del className={style.smaller}>$ {props.product.product_price}</del> : null } ${props.product.product_price - props.product.discount} </Comp.P>
        </div>
        <form onSubmit={handleAddToCart} className={style.input}>
          <div>
            <input type="number" value={qty} name="qty" id="qty" min={0} step={1} onChange={e => setQty(parseInt(e.target.value))} />
          </div>
          <Button.Yellow onClick={handleAddToCart}>{account ? `Add to Cart ›` : "Sign in to add to cart"}</Button.Yellow>
          <div>
            {added ? <Comp.A href="/account/cart">View Cart</Comp.A> : null}
          </div>
        </form>
      </div>
    )
  }
}