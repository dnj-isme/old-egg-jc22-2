import { GetQueryString } from "@/controller/ParseFilter";
import { FilterInput, Pagination } from "@/model/filtering";
import { NextRouter, useRouter } from "next/router";
import { useEffect, useState } from "react";
import style from "./style.module.scss"

interface Params {
  totalPages: number,
  pagination: Pagination,
  filter?: FilterInput
}

export function PaginationLink(props: Params) {
  const [links, setlinks] = useState<JSX.Element[]>([])
  useEffect(()=> {
    let pages = Array<JSX.Element>()
    const current = props.pagination.page
    const pageRange = 2
    const total = props.totalPages

    if(current > 1) {
      pages.push(<Link page={1} curr={current} pagination={props.pagination} filter={props.filter}/>)
    }

    if (current - pageRange > 2) {
      pages.push(<Dots />);
      for (let i = current - pageRange; i < current; i++) {
        pages.push(<Link page={i} curr={current} pagination={props.pagination} filter={props.filter}/>);
      }
    } else {
      for (let i = 2; i < current; i++) {
        pages.push(<Link page={i} curr={current} pagination={props.pagination} filter={props.filter}/>);
      }
    }

    pages.push(<Link page={current} curr={current} pagination={props.pagination} filter={props.filter}/>);

    // calculate pages to show after current page
    if (current + pageRange < total - 1) {
      for (let i = current + 1; i <= current + pageRange; i++) {
        pages.push(<Link page={i} curr={current} pagination={props.pagination} filter={props.filter}/>);
      }
      pages.push(<Dots />)
    } else {
      for (let i = current + 1; i < total; i++) {
        pages.push(<Link page={i} curr={current} pagination={props.pagination} filter={props.filter}/>);
      }
    }

    // always show last page
    if (total > 1 && current < total) {
      pages.push(<Link page={total} curr={current} pagination={props.pagination} filter={props.filter}/>);
    }

    // if(curr >= 1 && total > 1)l.push(<Link page={2} curr={curr} pagination={props.pagination} filter={props.filter}/>)

    // if(curr >= 6) {
    //   l.push(<Dots />)
    // }

    // for(let i = curr - 2; i <= curr + 2; i++) {
    //   if(i <= 2 || i >= total - 1) continue;
    //   if(i == curr) l.push(<Link page={i} curr={curr} pagination={props.pagination} filter={props.filter}/>)
    //   else l.push(<Link page={i} curr={curr} pagination={props.pagination} filter={props.filter}/>)
    // }

    // if(curr <= total - 5) {
    //   l.push(<Dots />)
    // }

    // if(total > 5) l.push(<Link page={total - 1} curr={curr} pagination={props.pagination} filter={props.filter}/>)
    // if(total > 6) l.push(<Link page={total} curr={curr} pagination={props.pagination} filter={props.filter}/>)

    setlinks(pages)
  }, [])

  if(props.totalPages <= 1) return null; else 
  return (
    <ul className={style.pagination}>
      {
        props.pagination.page <= 1 ? null :
      <li><a href={GetQueryString({contentsPerPage: props.pagination.contentsPerPage, page: props.pagination.page - 1}, props.filter)} className={style.next}>&laquo;</a></li>
      }
      {links.map(e => e)}
      {
        props.pagination.page >= props.totalPages  ? null : 
        <li><a href={GetQueryString({contentsPerPage: props.pagination.contentsPerPage, page: props.pagination.page + 1}, props.filter)} className={style.next}>&raquo;</a></li>
      }
    </ul>
  )
}
function Link({page, curr, pagination, filter}: {page: number, curr: number, pagination: Pagination, filter?: FilterInput}) {  

  let targetPaginate: Pagination = {
    contentsPerPage: pagination.contentsPerPage,
    page
  }
  if(curr == page) {
    return <li><a href={GetQueryString(targetPaginate, filter)} className={style.active}>{page}</a></li>
  }
  return <li><a href={GetQueryString(targetPaginate, filter)}>{page}</a></li>
}

function Dots() {
  return <li><a className={style.nostyle}>......</a></li>
}