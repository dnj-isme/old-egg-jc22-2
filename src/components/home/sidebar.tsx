import { ThemeContext } from '@/contexts/ThemeContext';
import { useContext, useEffect, useState } from 'react';
import { Button, Comp } from '../component';
import style from "./sidebar.module.scss"

import { Icon } from '@iconify/react';
import { Category } from '@/model/product';
import { From } from '@/database/api';
import { SampleQuery } from '@/database/query';

export default function Sidebar() {
  
  // TODO: Your hooks starts here...
  const theme = useContext(ThemeContext) // For Theme
  
  // TODO: Put UseState Stuff here
  const [categories, setCategories] = useState<Category[]>([])

  // TODO: Put UseEffect Stuff Here
  useEffect(() => {effect()}, [])

  async function effect() {
    const res = await From.Graphql.execute(SampleQuery.categories)

    if(res.success) {
      console.log(res.data);
      setCategories(res.data)
    }
  }


  // TODO: Put Your Custom Logic here
  function test() {
    return 'In Progres...'
  }

  // TODO: Your React Element starts here...
  return (
    <div className={style.sidebar}>
      {categories.map(data => (
        <div style={{backgroundColor: theme.background2}}>
          <a style={{color: theme.textColor}} href={"/category/"+data.id}>
            <div>
              <Comp.P>{data.category_name}</Comp.P>
              <Icon icon="material-symbols:chevron-right-sharp" />
            </div>
          </a>
        </div>
      ))}
    </div>
  )
}