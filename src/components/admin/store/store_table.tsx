import { DEFAULT_THEME, getTheme, ThemeContext, ThemeType } from '@/contexts/ThemeContext';
import ShowNotification from '@/controller/NotificationController';
import { From } from '@/database/api';
import { SampleQuery } from '@/database/query';
import { useContext, useEffect, useState } from 'react';
import style from "./store.module.scss"
import { Account } from '@/model/account';
import { Comp } from '@/components/component';
import StoreRow from './store_row';

interface Param {
  stores: Account[]
}

export default function StoreList(props: Param) {
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
            <td><Comp.P>Status</Comp.P></td>
            <td><Comp.P>Action</Comp.P></td>
          </tr>
        </thead>
        <tbody>
          {props.stores.map((data, idx) => (<StoreRow data={data} idx={idx} />))}
        </tbody>
      </table>
    </div>
  )
}