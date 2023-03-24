import { Account } from "./account"
import { Product } from "./product"

export interface Wishlist {
  id: string
  title: string
  description: string
  public_wishlist: boolean
  promo: boolean
  account: Account
  details: WishlistDetail[]
  reviews: WishlistReview[]
  total_price: number
}

export interface WishlistDetail {
  wishlist: Wishlist,
  product: Product
  quantity: number
}

export interface WishlistReview {
  id: string
  detail: string,
  rating: number,
  anonymous: boolean
  account: Account
  wishlist: Wishlist
}

export interface FollowedWishlist {
  id: string
  note: string

  account: Account
  wishlist: Wishlist
}