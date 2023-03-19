import { Comp } from '@/components/component';
import { DEFAULT_THEME, getTheme, ThemeContext, ThemeType } from '@/contexts/ThemeContext';
import ShowNotification from '@/controller/NotificationController';
import { Category, Product } from '@/model/product';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';

import style from "./style.module.scss"

interface Props {
  category: Category
}

export default function CategorySearchItem(props: Props) {
  const theme = useContext(ThemeContext) // For Theme
  
  const {category} = props

  return (
    <div className={style.component} style={{backgroundColor: theme.background}}>
      <a className={style.category} href={"/category/" + category.id}>
        <Comp.P>{category.category_name}</Comp.P>
      </a>
    </div>
  )
}