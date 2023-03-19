import { Comp } from '@/components/component';
import { DEFAULT_THEME, getTheme, ThemeContext, ThemeType } from '@/contexts/ThemeContext';
import ShowNotification from '@/controller/NotificationController';
import { Category } from '@/model/product';
import { StoreDetail } from '@/model/store';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import style from "./style.module.scss"

interface Props {
  category: Category,
  shop: StoreDetail
}

export default function CategoryCard(props: Props) {
  // TODO: Your hooks starts here...
  const theme = useContext(ThemeContext) // For Theme
  const {category, shop} = props
  
  // TODO: Put UseEffect Stuff Here
  useEffect(() => {effect()}, [])

  function effect() {
    console.log("Data");
    console.log(props);
  }

  return (
    <a href={`/shop/${shop.account.id}/product?category_id=${category.id}`} className={style.component} style={{backgroundColor: theme.cardBG}}>
      <Comp.P>{category.category_name}</Comp.P>
    </a>
  )
}