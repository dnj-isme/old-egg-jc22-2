import { NextRouter, useRouter } from "next/router";
import { useEffect, useState } from "react";
import style from "./style.module.scss"

interface Params {
  page: number,
  totalPages: number,
  route: string
}

export function PaginationLink(props: Params) {
  const route = useRouter()
  const [loading, setLoading] = useState(true)
  const [links, setlinks] = useState<JSX.Element[]>([])
  useEffect(()=> {
    setLoading(true)
    let l = Array<JSX.Element>()
    const curr = props.page
    const total = props.totalPages

    l.push(<Link page={1} curr={curr}/>)

    if(curr >= 1 && total > 1)l.push(<Link page={2} curr={curr}/>)

    if(curr >= 6) {
      l.push(<Dots />)
    }

    for(let i = curr - 2; i <= curr + 2; i++) {
      if(i <= 2 || i >= total - 1) continue;
      if(i == curr) l.push(<Link page={i} curr={curr}/>)
      else l.push(<Link page={i} curr={curr}/>)
    }

    if(curr <= total - 5) {
      l.push(<Dots />)
    }

    if(total > 5) l.push(<Link page={total - 1} curr={curr}/>)
    if(total > 6) l.push(<Link page={total} curr={curr}/>)

    setlinks(l)
    setLoading(false)
  }, [])

  if(props.totalPages == 1) return null; else 
  return (
    <ul className={style.pagination}>
      {
        props.page <= 1 ? null : <li><a href={`?page=${props.page - 1}`} className={style.prev}>&laquo;</a></li>
      }
      {links.map(e => (e))}
      {
        props.page >= 2 ? null : <li><a href={`?page=${props.page + 1}`} className={style.next}>&raquo;</a></li>
      }
    </ul>
  )
}

function Link({page, curr}: {page: number, curr: number}) {
  if(curr == page) {
    return <li><a href={`?page=${page}`} className={style.active}>{page}</a></li>
  }
  return <li><a href={`?page=${page}`}>{page}</a></li>
}

function Dots() {
  return <li><a className={style.nostyle}>......</a></li>
}