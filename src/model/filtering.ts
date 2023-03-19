
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