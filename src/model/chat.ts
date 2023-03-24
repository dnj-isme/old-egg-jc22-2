import { Account } from "./account"

export interface Chat {
  id: string
  closed_at: string
  participants: Account[]
}

export interface Message {
  id: string
  chat: Chat
  sender: Account
  reciever: Account
  message: string
}