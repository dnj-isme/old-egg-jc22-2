import { DEFAULT_THEME, getTheme, ThemeContext, ThemeType } from '@/contexts/ThemeContext';
import { Auth } from '@/controller/Auth';
import ShowNotification, { NotificationTemplate } from '@/controller/NotificationController';
import { From } from '@/database/api';
import { Transaction } from '@/model/transaction';
import { useRouter } from 'next/router';
import { MouseEvent, useContext, useEffect, useState } from 'react';
import { Button, Comp } from '../component';

interface Props {
  index: number
  transaction: Transaction
}

export default function TransactionCard(props: Props) {
  // TODO: Your hooks starts here...
  const theme = useContext(ThemeContext) // For Theme
  const router = useRouter() // For Navigating

  const {index, transaction} = props

  async function handleViewDetails(e: MouseEvent) {
    e.preventDefault()

    router.push("order-history/" + transaction.id)
  }
  
  async function handleReOrder(e: MouseEvent) {
    e.preventDefault()

    const acc = await Auth.getActiveAccount()
    
    let error = ""
    if(acc) {
      const len = transaction.details.length
      for(let i = 0; i < len; i++) {
        const d = transaction.details.at(i)
        if(d) {
          const res = await From.Rest.fetchData("/account/order/cart", "PATCH", {
            account_id: acc.id,
            product_id: d.product?.id,
            quantity: d.quantity
          }, Auth.getToken())

          if(!res.success) {
            error = res.data
          }
        }
        else {
          error = "Unable to fetch transaction details"
          break;
        }
      }
    }
    else {
      error = "Unable to fetch Account"
    }

    if(error == "") {
      NotificationTemplate.Success()
    }
    else {
      ShowNotification("danger", "Failed", error)
    }
  }
  
  // TODO: Your React Element starts here...
  return (
    <div className='component' style={{backgroundColor: theme.background}}>
      <Comp.H1>Order #{index + 1}</Comp.H1>
      <Comp.P>ID: {transaction.id}</Comp.P>
      <Comp.P>Created At: {transaction.created_at}</Comp.P>
      <Comp.P>Status: {transaction.status}</Comp.P>
      <Button.Blue onClick={handleViewDetails}>View Details</Button.Blue>
      <Button.Yellow onClick={handleReOrder}>Order Again</Button.Yellow>
    </div>
  )
}