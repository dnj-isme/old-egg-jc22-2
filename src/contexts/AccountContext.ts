import { createContext } from "react";

export interface Account {
  id: string,
  first_name: string,
  last_name: string,
  admin: boolean,
  email: string,
  phone: string,
  subscribe: boolean
}

export function isAccount(object: any): object is Account {
  return object.id;
}

export const AccountContext = createContext<Account | null>(null)