import { Account } from "./account";
import { Product } from "./product";

export interface CartItem {
  quantity: number
  product_id: string
  
  product?: Product
}