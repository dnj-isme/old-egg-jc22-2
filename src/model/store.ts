import { Account } from "./account";
import { Category, Product } from "./product";

export interface StoreDetail {
  account: Account
  id: string
  store_id: string,
  banner: string,
  return_policy: string,
  about: string,
  products?: Product[]
  categories?: Category[]
  reviews: StoreReviews[]
  sales: number
}

export interface StoreReviews {
  id: string,
  account: Account,
  description: string,
  rating: number
  created_at: string,

  store?: StoreDetail

  helpful: number
  notHelpful: number
}