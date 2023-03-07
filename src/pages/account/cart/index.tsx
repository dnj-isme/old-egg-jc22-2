import { DEFAULT_THEME, getTheme, Theme, ThemeContext, ThemeType } from '@/contexts/ThemeContext';
import { Auth } from '@/controller/Auth';
import { useRouter } from 'next/router';
import ShowNotification, { NotificationTemplate } from '@/controller/NotificationController';
import { MouseEvent, useEffect, useState } from 'react';
import Footer from '@/components/footer/footer';
import Navbar from '@/components/navbar/navbar';
import { ReactNotifications } from 'react-notifications-component';

import style from "./style.module.scss"
import TopProduct from '@/components/home/top_product';
import { Button, Comp } from '@/components/component';
import { From } from '@/database/api';
import { SampleQuery } from '@/database/query';
import { CartItem } from '@/model/cart';
import { ProductCard } from '@/components/product/card';
import SidebarTemplate from '@/components/base';

export default function index() {
  // TODO: Your hooks starts here
  const router = useRouter()

  // TODO: Your useState starts here
  const [theme, setTheme] = useState<ThemeType>(DEFAULT_THEME)
  const [items, setItems] = useState<CartItem[]>([])

  const [total, setTotal] = useState(formatNumber(getTotalPrice()))
  const [discounted, setDiscounted] = useState(formatNumber(getDiscountedPrice()))
  const [final, setFinal] = useState(formatNumber(getTotalPrice() - getDiscountedPrice()))

  const [voucher, setVoucher] = useState('')
  const [payment, setPayment] = useState('')
  const [delivery, setDelivery] = useState('')

  // TODO: Your useEffect starts here
  useEffect(() => {
    fetchCart()
    const sessionTheme = getTheme(localStorage.getItem('theme'))
    localStorage.setItem('theme', sessionTheme.className)
    setTheme(sessionTheme)
  }, [])

  async function fetchCart() {
    const acc = await Auth.getActiveAccount()

    if(acc) {
      const res = await From.Graphql.execute(SampleQuery.cartByID, {
        id: acc.id
      })

      if(res.success) {
        console.log(res.data);
        setItems(res.data)

        setTotal(formatNumber(getTotalPrice(res.data)))
        setDiscounted(formatNumber(getDiscountedPrice(res.data)))
        setFinal(formatNumber(getTotalPrice(res.data) - getDiscountedPrice(res.data)))
      }
    }
  }

  // TODO: Your custom logic starts here...
  function changeTheme() {
    const newTheme = theme === Theme.DARK ? Theme.LIGHT : Theme.DARK
    localStorage.setItem('theme', newTheme.className)
    setTheme(newTheme)
    console.log(newTheme.background);
  }

  function formatNumber(num: number) {
    return "$ " + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function getTotalPrice(data?: CartItem[]) {
    if(!data || data.length == 0) {
      data = items
    }

    let total = 0
    data.forEach(element => {
      if(element.product && !Number.isNaN(element.quantity)) {
        total += element.product.product_price * element.quantity
      }
    });
    return total
  }

  function getDiscountedPrice(data?: CartItem[]) {
    if(!data || data.length == 0) {
      data = items
    }

    let total = 0
    data.forEach(element => {
      if(element.product) {
        total += element.product.discount * element.quantity
      }
    });
    return total
  }

  function handleCheckout() {

    let count = 0
    items.forEach(i => {
      if(i.quantity > 0) count++
    });
    if(count == 0) {
      ShowNotification("warning", "You haven't made order yet", "Please add item to carts before continue")
    }
    else {
      setmodal({
        display: "inherit"
      })
    }
  }

  async function handleSubmit(e: MouseEvent) {
    e.preventDefault()
    const acc = await Auth.getActiveAccount()
    if(!acc) {
      ShowNotification("danger", "Error!", "Failed to fetch account details")
      return
    }
    let success = true
    for(let i = 0; i < items.length; i++) {
      const item = items[i]
      
      const res = await From.Rest.fetchData("/account/order/cart", "PATCH", {
        account_id: acc.id,
        product_id: item.product?.id,
        quantity: item.quantity
      }, Auth.getToken())

      if(!res.success) {
        success = false
        NotificationTemplate.Error()
        console.error();
      }
    }

    if(success) {
      const res = await From.Rest.fetchData("/account/order/checkout", "POST", {
        account_id: acc.id
      }, Auth.getToken())

      if(res.success) {
        global.checkout = true
        router.push("/")
      }
    }
  }

  function handleQtyChange(idx: number, new_qty: number) {
    let temp = items
    temp[idx].quantity = new_qty
    setItems(temp)

    setTotal(formatNumber(getTotalPrice(temp)))
    setDiscounted(formatNumber(getDiscountedPrice(temp)))
    setFinal(formatNumber(getTotalPrice(temp) - getDiscountedPrice(temp)))
  }

  function handleCancel(e: MouseEvent) {
    e.preventDefault()
    setmodal({display: "none"})
  }

  function handleCheckVoucher(e: MouseEvent) {
    e.preventDefault()
    NotificationTemplate.InProgress("Check Voucher")
  }



  // TODO: Your React Element Starts here
  const [modal,setmodal] = useState({
    display: "none"
  })

  return (
    <Auth.Protection
      // TODO: Put Your Authentication Rule here...
      MustLogin
    >
      <ThemeContext.Provider value={theme}>
        <div className='main' style={{backgroundColor: theme.background}}>
        <ReactNotifications />
        <Navbar changeTheme={changeTheme}/>
        <SidebarTemplate>
          <div className={style.details}>
            {
              items.length > 0 ?
              <>
                <div className={style.left}>
                  {
                    items.map((item, index) => (<ProductCard.Cart cart_item={item} index={index} onQuantityChange={handleQtyChange} />))
                  }
                </div>
                <div className={style.right}>
                  <Comp.H1>Cart Summary</Comp.H1>
                  <table>
                    <tbody>
                      <tr>
                        <td><Comp.P>Total Price</Comp.P></td>
                        <td><Comp.P>{total}</Comp.P></td>
                      </tr>
                      <tr>
                        <td><Comp.P>Discounted Price</Comp.P></td>
                        <td><Comp.P>{discounted}</Comp.P></td>
                      </tr>
                      <tr>
                        <td><Comp.P>Total Price</Comp.P></td>
                        <td><Comp.P className={style.bold}>{final}</Comp.P></td>
                      </tr>
                    </tbody>
                  </table>
                  <Button.Blue type="submit" onClick={handleCheckout}>Checkout</Button.Blue>
                </div>
              </> :
              <Comp.H1>You don't have any items in the cart</Comp.H1>
            }
          </div>
          <div className={style.popup} style={modal}>
            <div className={style.Modal}>
              <div className={style.Form}>
                <div className={style.FormContainer}>
                  <div className={style.FormSelect}>
                    <Comp.H1>Total Price</Comp.H1>
                    <Comp.P>{final}</Comp.P>
                  </div>
                  <div className={style.FormSelect}>
                    <h3>Delivery</h3>
                    <select onChange={e => setDelivery(e.target.value)} name="" id="">
                      <option value="jne">Jne</option>
                      <option value="jnt">JnT</option>
                    </select>
                  </div>
                  <div className={style.FormSelect}>
                    <h3>Payment</h3>
                    <select name="payment" id="payment" onChange={e => setPayment(e.target.value)}>
                      <option value="wallet">Wallet</option>
                      <option value="cod">CoD</option>
                      <option value="e-banking">E-Banking</option>
                    </select>
                  </div>
                  <div className={style.FormSelect}>
                    <h3>Voucher</h3>
                    <div className={style.oneline}>
                      <input type="text" placeholder='Input Voucher' onChange={e => setVoucher(e.target.value)}/>
                      <Button.Blue onClick={handleCheckVoucher}>Check</Button.Blue>
                    </div>
                  </div>
                  <div className={style.SaveButton}>
                    <Button.Blue type='submit' onClick={handleSubmit}>Submit</Button.Blue>
                    <Button.Red onClick={handleCancel}>Cancel</Button.Red>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SidebarTemplate>
        <Footer />
        </div>
      </ThemeContext.Provider>
    </Auth.Protection>
  )
}