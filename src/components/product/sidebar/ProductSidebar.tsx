import { Button, Comp } from '@/components/component';
import { DEFAULT_THEME, getTheme, ThemeContext, ThemeType } from '@/contexts/ThemeContext';
import ShowNotification from '@/controller/NotificationController';
import { GetQueryString } from '@/controller/ParseFilter';
import { From } from '@/database/api';
import { SampleQuery } from '@/database/query';
import { FilterInput, Pagination } from '@/model/filtering';
import { Category } from '@/model/product';
import { useRouter } from 'next/router';
import { FormEvent, MouseEvent, useContext, useEffect, useState } from 'react';

import style from "./style.module.scss"

interface Props {
  children?: JSX.Element | JSX.Element[]
  pagination: Pagination,
  filter: FilterInput,
  route?: string
}

export default function ProductSidebar(props: Props) {
  // TODO: Your hooks starts here...
  const theme = useContext(ThemeContext) // For Theme
  const router = useRouter() // For Navigating

  // TODO: Put UseState Stuff here

  // TODO: Put UseEffect Stuff Here

  // TODO: Put Your Custom Logic here

  // TODO: Your React Element starts here...
  return (
    <div className={style.component} style={{backgroundColor: theme.background}}>
      <div className={style.left}>
        <Sidebar route={props.route} filter={props.filter} pagination={props.pagination} />
      </div>
      <div className={style.right}>
        {props.children}
      </div>
    </div>
  )
}

function Sidebar(props: Props) {
  const router = useRouter()

  const [categories, setCategories] = useState<Category[]>([])

  const [orderRating, setOrderRating] = useState('')
  const [orderPrice, setOrderPrice] = useState('')
  const [orderReview, setOrderReview] = useState('')
  const [orderBought, setOrderBought] = useState('')

  const [search, setSearch] = useState('')

  const [filterCategory, setFilterCategory] = useState(props.filter.category_id)

  useEffect(() => {effect()}, [])

  async function effect() {
    setCategories((await From.Graphql.execute(SampleQuery.categories)).data)
  }

  function handleFilter(e: MouseEvent | FormEvent) {
    e.preventDefault()

    router.push(props.route + GetQueryString(props.pagination, {
      category_id: filterCategory,
      order_by_bought: orderBought,
      order_by_price: orderPrice,
      order_by_rating: orderRating,
      order_by_review: orderReview,
      search,
      store_id: props.filter.store_id
    }))
  }

  return (
    <ul>
      <Comp.H1>Search</Comp.H1>
      <li>
        <form onSubmit={handleFilter}>
          <input type="text" name="search" id="search" placeholder='search' onChange={e => setSearch(e.target.value)}/>
          <Button.Blue type='submit'>🔍</Button.Blue>
        </form>
      </li>
      <Comp.H1>Filter</Comp.H1>
      <li>
        <Button.Blue onClick={handleFilter}>Apply Filter</Button.Blue>
      </li>
      <li>
        <Comp.H2>Order by</Comp.H2>
        <Comp.P>* The sorting order: rating, price, number of reviews, number of bought</Comp.P>
        <table>
          <tbody>
            <tr>
              <td>
                <Comp.Label htmlFor="rating">Product Rating</Comp.Label>
              </td>
              <td>
                <select id='rating' onChange={e => setOrderRating(e.target.value)}>
                  <option value="NONE">[No Filter]</option>
                  <option value="ASC">Ascending</option>
                  <option value="DESC">Descending</option>
                </select>
              </td>
            </tr>
            <tr>
              <td>
                <Comp.Label htmlFor="price">Product Price</Comp.Label>
              </td>
              <td>
                <select id='price' onChange={e => setOrderPrice(e.target.value)}>
                  <option value="">[No Filter]</option>
                  <option value="ASC">Ascending</option>
                  <option value="DESC">Descending</option>
                </select>
              </td>
            </tr>
            <tr>
              <td>
                <Comp.Label htmlFor="review">Number of Reviews</Comp.Label>
              </td>
              <td>
                <select id='review' onChange={e => setOrderReview(e.target.value)}>
                  <option value="">[No Filter]</option>
                  <option value="ASC">Ascending</option>
                  <option value="DESC">Descending</option>
                </select>
              </td>
            </tr>
            <tr>
              <td>
                <Comp.Label htmlFor="review">Number of Bought</Comp.Label>
              </td>
              <td>
                <select id='review' onChange={e => setOrderBought(e.target.value)}>
                  <option value="">[No Filter]</option>
                  <option value="ASC">Ascending</option>
                  <option value="DESC">Descending</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </li>
      <li>
        <Comp.H2>Category</Comp.H2>
        {
          categories.map(c => (
            <div>
              <input type="radio" name="category" id={c.id} value={c.id} checked={c.id == filterCategory} onChange={e => setFilterCategory(e.target.value)} />
              <Comp.Label htmlFor={c.id}>{c.category_name}</Comp.Label>
            </div>
          ))
        }
      </li>
    </ul>
  )
}