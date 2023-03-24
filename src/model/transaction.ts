import { Account } from "./account"
import { Product } from "./product"
import { Voucher } from "./voucher"

export interface Transaction {
  id: string
  payment_method: string
  status: "Created" | "In Progress" | "Finished" | "Canceled"
  created_at: string

  account: Account
  details: TransactionDetail[]
}

export interface TransactionDetail {
  product: Product
  quantity: number
  status: string

  transaction: Transaction
}