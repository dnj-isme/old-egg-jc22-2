import { DEFAULT_THEME, getTheme, ThemeContext, ThemeType } from '@/contexts/ThemeContext';
import { Auth } from '@/controller/Auth';
import ShowNotification, { NotificationTemplate } from '@/controller/NotificationController';
import { From } from '@/database/api';
import { SampleQuery } from '@/database/query';
import { Account } from '@/model/account';
import { WishlistFilterInput } from '@/model/filtering';
import { Product } from '@/model/product';
import { Wishlist } from '@/model/wishlist';
import { useRouter } from 'next/router';
import { FormEvent, MouseEvent, useContext, useEffect, useState } from 'react';
import { Button, Comp } from '../component';

import style from "./popup.module.scss"

interface Props {
  display: string
  onExit: () => any
  product: Product
  account: Account
}

export default function AddToWishlist(props: Props) {
  // TODO: Your hooks starts here...
  const theme = useContext(ThemeContext) // For Theme
  const router = useRouter()

  const {display, product, onExit, account} = props
  
  // TODO: Put UseState Stuff here
  const [quantity, setQuantity] = useState(0)
  const [wishlists, setWishlists] = useState<Wishlist[]>([])
  const [target, setTarget] = useState('')

  // TODO: Put UseEffect Stuff Here
  useEffect(() => {effect()}, [])

  async function effect() {
    const filter: WishlistFilterInput = {
      account_id: account.id
    }

    const res = await From.Graphql.execute(SampleQuery.wishlists, {filter})

    if(res.success) {
      setWishlists(res.data)
    }
  }

  // TODO: Put Your Custom Logic here
  function handleExit(e?: MouseEvent) {
    e?.preventDefault()
    onExit()
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const res = await From.Rest.fetchData("/wishlist/detail", "POST", {
      wishlist_id: target,
      product_id: product.id,
      quantity
    }, Auth.getToken())

    if(res.success) {
      NotificationTemplate.Success()
      handleExit()
    }
    else {
      ShowNotification("danger", "Failed", res.data)
    }
  }

  // TODO: Your React Element starts here...
  return (
    <div className={style.popup} style={{display}}>
      <div className={'center ' + style.modal} style={{backgroundColor: theme.background}}>
        <Comp.H1>Add to Cart</Comp.H1>
        <div className={style.exit}>
          <Button.Red onClick={handleExit}>X</Button.Red>
        </div>
        <form onSubmit={handleSubmit}>
          <table>
            <tbody>
              <tr>
                <td><Comp.Label className='quantity'>Quantity</Comp.Label></td>
                <td><input type="number" min={0} step={1} max={product.product_stock} name="quantity" id="quantity" value={quantity} onChange={e => setQuantity(parseInt(e.target.value))} /></td>
              </tr>
              <tr>
                <td><Comp.Label htmlFor='wishlist'>Wishlist Target</Comp.Label></td>
                <td>
                  <select onChange={e => setTarget(e.target.value)}>
                    <option value="">[CHOOSE WISHLIST]</option>
                    {wishlists.map(e => (
                      <option value={e.id}>{e.title}</option>
                    ))}
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
          <div className='center'>
            <Button.Yellow onClick={_ => router.push("/account/wishlist/create")}>Create new Wishlist</Button.Yellow>
            <Button.Submit>Add to Wishlist</Button.Submit>
          </div>
        </form>
      </div>
    </div>
  )
}