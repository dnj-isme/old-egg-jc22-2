import { DEFAULT_THEME, getTheme, Theme, ThemeContext, ThemeType } from '@/contexts/ThemeContext';
import { Auth } from '@/controller/Auth';
import { useRouter } from 'next/router';
import ShowNotification from '@/controller/NotificationController';
import { forwardRef, useEffect, useState } from 'react';
import Footer from '@/components/footer/footer';
import Navbar from '@/components/navbar/navbar';
import { ReactNotifications } from 'react-notifications-component';
import SidebarTemplate from '@/components/base';
import { Button, Comp } from '@/components/component';
import { GetServerSidePropsContext } from 'next';
import { Transaction } from '@/model/transaction';
import { From } from '@/database/api';
import { SampleQuery } from '@/database/query';
import TransactionCard from '@/components/transaction/transaction';

import style from "./style.module.scss"

export default function index() {
  // TODO: Your hooks starts here
  const router = useRouter() // For Navigating

  // TODO: Your useState starts here
  const [theme, setTheme] = useState<ThemeType>(DEFAULT_THEME)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [data, setData] = useState<Transaction[]>([])
  
  const [ready, setReady] = useState(false)
  const [filter, setFilter] = useState(0) 
  // 0 = all
  // 1 = not finished (created / in progress)
  // 2 = finised
  // 3 = canceled

  function getFilter() {
    switch(filter) {
      case 1:
        return "Unfinished"
      case 2:
        return "Finished"
      case 3:
        return "Canceled"
      case 0: default:
        return "All Transactions"
    }
  }

  const [order, setOrder] = useState(0)
  // 0 = none
  // 1 = date desc
  // 2 = date asc

  function getOrder() {
    switch(order) {
      case 1:
        return "Date Asc"
      case 2:
        return "Date Desc"
      case 0: default:
        return "No Date Filter"
    }
  }

  const [search, setSearch] = useState('')

  // TODO: Your useEffect starts here
  useEffect(() => {
    const sessionTheme = getTheme(localStorage.getItem('theme'))
    localStorage.setItem('theme', sessionTheme.className)
    setTheme(sessionTheme)

    fetchTransactions()
  }, [])

  async function fetchTransactions() {
    const acc = await Auth.getActiveAccount()

    if(acc != null) {
      const res = await From.Graphql.execute(SampleQuery.transactionsByID, {id: acc.id})
      if(res.success) {
        setTransactions(res.data)
        setData(res.data)
        console.log(res.data);
      }
    }
    setReady(true)
  }
    
  useEffect(filtering, [filter, order, search])

  function match(transaction: Transaction, s: string) : boolean{
    if(transaction.id.includes(s)) return true

    let valid = false

    const len = transaction.details.length

    for (let index = 0; index < len; index++) {
      const d = transaction.details[index];
      if(d.product.product_name.includes(s)) {
        valid = true;
        break
      }
    }

    return valid
  }

  function filtering() {
    if(ready) {
      let output: Transaction[] = []
      
      data.forEach(t => {
        if(match(t, search)) {
          if (filter == 0 || 
              (filter == 1 && (t.status == "In Progress" || t.status == "Created")) ||
              (filter == 2 && t.status == "Finished") ||
              (filter == 3 && t.status == "Canceled")) {
            output.push(t);
          }
        }
      });
      
      // Define a compare function based on the sortOrder
      let compareFn: (a: Transaction, b: Transaction) => number;
      const noCompare = (a: Transaction, b: Transaction) => 0
      if (order === 1) {
        compareFn = (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else if (order === 2) {
        compareFn = (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      } else {
        // No sorting needed
        compareFn = noCompare
      }

      if(compareFn != noCompare) {
        output.sort(compareFn)
      }

      setTransactions(output)
    }
    return;
  }

  // TODO: Your custom logic starts here...

  function changeTheme() {
    const newTheme = theme === Theme.DARK ? Theme.LIGHT : Theme.DARK
    localStorage.setItem('theme', newTheme.className)
    setTheme(newTheme)
    console.log(newTheme.background);
  }

  // TODO: Your React Element Starts here
  return (
    <Auth.Protection
      // TODO: Put Your Authentication Rule here...
      MustLogin
    >
      <ThemeContext.Provider value={theme}>
        <ReactNotifications />
        <div className='main' style={{backgroundColor: theme.background}}>
          <Navbar changeTheme={changeTheme}/>
          <SidebarTemplate>
            <div className={'center ' + style.content}>
              <Comp.H1>Order History</Comp.H1>
              <div className={style.filter}>
                <div>
                  <Button.Blue onClick={_ => setFilter((filter + 1) % 4)}>{getFilter()}</Button.Blue>
                  <Button.Blue onClick={_ => setOrder((order + 1) % 3)}>{getOrder()}</Button.Blue>
                </div>
                <div>
                  <Comp.Label htmlFor='search'>Search By ID : </Comp.Label>
                  <input type="text" name="search" id="search" placeholder='Search' onChange={e => setSearch(e.target.value)}/>
                </div>
              </div>
              
              {
                transactions.length == 0 ? <Comp.H1>You don't have made any transactions</Comp.H1> :
                <div className='grid'>
                  {transactions.map((t, idx) => <TransactionCard index={idx} transaction={t} />)}
                </div>
              }
            </div>
          </SidebarTemplate>
          <Footer />
        </div>
      </ThemeContext.Provider>
    </Auth.Protection>
  )
}