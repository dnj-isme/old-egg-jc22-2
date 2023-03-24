import { Account } from "./account"

export interface Message {
  id: string
  sender: Account
  receiver: Account
  message: string
}