import { FilterInput, Pagination, WishlistFilterInput } from "@/model/filtering";
import { ParsedUrlQuery } from "querystring";


export default function ParsePagination(query: ParsedUrlQuery): Pagination {
  let output: Pagination = {
    page: 1,
    contentsPerPage: 20,
  }

  if(query?.page && !Array.isArray(query.page)) {
    output.page = parseInt(query.page)
  }

  if(query?.contentsPerPage && !Array.isArray(query.contentsPerPage)) {
    output.contentsPerPage = parseInt(query.contentsPerPage)
  }

  return output;
}

export function ParseFilter(query: ParsedUrlQuery): FilterInput {
  let output: FilterInput = {}

  if(query?.category_id && !Array.isArray(query.category_id)) {
    output.category_id = query.category_id
  }
  
  if(query?.search && !Array.isArray(query.search)) {
    output.search = query.search
  }
  
  if(query?.order_by_price && !Array.isArray(query.order_by_price)) {
    output.order_by_price = query.order_by_price
  }
  
  if(query?.order_by_rating && !Array.isArray(query.order_by_rating)) {
    output.order_by_rating = query.order_by_rating
  }
  
  if(query?.rating && !Array.isArray(query.rating)) {
    output.rating = parseInt(query.rating)
  }
  
  if(query?.store_id && !Array.isArray(query.store_id)) {
    output.store_id = query.store_id
  }

  return output
}

export function GetQueryString(pagination?: Pagination, filter?: FilterInput, wishlist_filter?: WishlistFilterInput) {
  let output = "?"
  
  if(pagination) {
    output += `page=${pagination.page}&contentsPerPage=${pagination.contentsPerPage}&`
  }
  
  if(filter) {

    const {category_id, search, store_id, rating, order_by_price, order_by_rating, order_by_bought, order_by_review} = filter
  
    if(category_id) {
      output += `category_id=${category_id}&`
    }
    if(search) {
      output += `search=${search}&`
    }
    if(store_id) {
      output += `store_id=${store_id}&`
    }
    if(rating) {
      output += `rating=${rating}&`
    }
    if(order_by_price) {
      output += `order_by_price=${order_by_price}&`
    }
    if(order_by_rating) {
      output += `order_by_rating=${order_by_rating}&`
    }
    if(order_by_review) {
      output += `order_by_review=${order_by_review}&`
    }
    if(order_by_bought) {
      output += `order_by_bought=${order_by_bought}&`
    }
  }

  if(wishlist_filter) {
    if(wishlist_filter.search) {
      output += `search=${wishlist_filter.search}&`
    }
  }

  output = output.slice(0, -1)
  return output
}
