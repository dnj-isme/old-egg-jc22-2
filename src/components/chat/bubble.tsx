import { DEFAULT_THEME, getTheme, ThemeContext, ThemeType } from '@/contexts/ThemeContext';
import ShowNotification from '@/controller/NotificationController';
import { Account } from '@/model/account';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { Comp } from '../component';

import style from "./style.module.scss"

interface Props {
  account?: Account | null
  alt?: string
  class: string
  message: string
}

export default function ChatBubble(props: Props) {
  // TODO: Your hooks starts here...
  const theme = useContext(ThemeContext) // For Theme
  
  return (
    <li className={style.bubble + ' ' + props.class}>
      <div className={style.logo}>
        <Icon icon="material-symbols:account-circle" style={{color: theme.textColor}}/>
      </div>
      <div className={style.stuff}>
        <Comp.P>{props.account ? props.account.first_name : props.alt}</Comp.P>
        <Comp.P>{props.message}</Comp.P>
      </div>
    </li>
  )
}