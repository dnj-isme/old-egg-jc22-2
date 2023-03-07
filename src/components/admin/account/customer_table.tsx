import { ThemeContext } from '@/contexts/ThemeContext';
import { useContext } from 'react';
import style from "./store.module.scss"
import { Account } from '@/model/account';
import { Comp } from '@/components/component';
import CustomerRow from './customer_row';

interface Param {
  customers: Account[]
}

export default function CustomerList(props: Param) {
  // TODO: Your hooks starts here...
  const theme = useContext(ThemeContext) // For Theme
  
  // TODO: Put UseState Stuff here

  // TODO: Put UseEffect Stuff Here

  // TODO: Put Your Custom Logic here

  // TODO: Your React Element starts here...
  return (
    <div className={style["component"]} style={{backgroundColor: theme.background}}>
      {/* TODO: Your HTML code starts here */}
      <table className={style["table-container"]}>
        <thead>
          <tr>
            <td><Comp.P>No</Comp.P></td>
            <td><Comp.P>Full Name</Comp.P></td>
            <td><Comp.P>Email</Comp.P></td>
            <td><Comp.P>Phone</Comp.P></td>
            <td><Comp.P>Subscribe</Comp.P></td>
            <td><Comp.P>Status</Comp.P></td>
            <td><Comp.P>Action</Comp.P></td>
          </tr>
        </thead>
        <tbody>
          {props.customers.map((data, idx) => (<CustomerRow data={data} idx={idx} />))}
        </tbody>
      </table>
    </div>
  )
}