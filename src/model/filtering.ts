
export interface Pagination {
  page: number,
  contentsPerPage: number,
}

export interface FilterInput {
  category_id?: string
  search?: string
  store_id?: string
  rating?: number
  order_by_price?: string // ASC / DESC
  order_by_rating?: string // ASC / DESC
  order_by_review?: string // ASC / DESC
  order_by_bought?: string // ASC / DESC
}

export interface WishlistFilterInput {
  id?: String
  wishlist_id?: String
  search?: String
  rating?: number

  public?: Boolean
  account_id?: String

  order_by_rating?: String
}