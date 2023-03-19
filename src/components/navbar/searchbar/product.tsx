import { Comp } from '@/components/component';
import { DEFAULT_THEME, getTheme, ThemeContext, ThemeType } from '@/contexts/ThemeContext';
import { Category, Product } from '@/model/product';
import { useContext, useEffect, useState } from 'react';

import style from "./style.module.scss"

interface Props {
  product: Product
}

export default function ProductSearchItem(props: Props) {
  const theme = useContext(ThemeContext) // For Theme
  
  const {product} = props

  return (
    <div className={style.component} style={{backgroundColor: theme.background}}>
      <a className={style.product} href={"/product/" + product.id}>
        <div>
          <img src={product.product_images?.at(0)?.image_link} />
        </div>
        <Comp.P>{product.product_name}</Comp.P>
      </a>
    </div>
  )
}