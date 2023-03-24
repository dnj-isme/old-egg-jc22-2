import { DEFAULT_THEME, getTheme, ThemeContext, ThemeType } from '@/contexts/ThemeContext';
import ShowNotification from '@/controller/NotificationController';
import { SampleQuery } from '@/database/query';
import { Account } from '@/model/account';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/router';
import { MouseEventHandler, useContext, useEffect, useState } from 'react';
import { Comp } from '../component';

import style from "./style.module.scss"

interface Props {
  account?: Account | null
  alt?: string
  onClick?:  MouseEventHandler<HTMLLIElement>
}

export default function Contact(props: Props) {
  // TODO: Your hooks starts here...
  const theme = useContext(ThemeContext) // For Theme
  const router = useRouter() // For Navigating

  SampleQuery
  
  return (
    <li className={style.contact} style={{backgroundColor: theme.cardBG}} onClick={props.onClick}>
      <div className={style.logo}>
        <Icon icon="material-symbols:account-circle" style={{color: theme.textColor}}/>
      </div>
      <div className={style.stuff}>
        <Comp.P>{props.account ? props.account.first_name : props.alt}</Comp.P>
      </div>
    </li>
  )
}