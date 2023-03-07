import { createContext } from "vm"

export type LanguageType = {
  language: string
  greeting: string
  signin: string,
  welcome: string,
  address: string,
  return: string,
  orders: string,
  deals: string,
  seller: string,
  build: string,
  category: string,
}

export const Language:{EN: LanguageType, ID: LanguageType}  ={
  EN: {
    language: "english",
    greeting: "Hello",
    welcome: "Welcome",
    signin: "Sign in / Register",
    address: "Select Address",
    return: "Return",
    orders: "& Orders",
    deals: "Today's Best Deals",
    seller: "Best Seller",
    build: "Build PC",
    category: "Product Category",
  },
  ID: {
    language: "indonesia",
    greeting: "Halo",
    welcome: "Selamat Datang",
    signin: "Masuk / Daftar",
    address: "Pilih Alamat",    
    return: "Pengembalian",
    orders: "& Pesanan",
    deals: "Promo Terbaik",
    seller: "Toko Terbaik",
    build: "Rakit PC",
    category: "Kategori Produk",
  }
}

export function getLanguage(text: string | null) : LanguageType {
  if(text === null) return DEFAULT_LANGUAGE
  console.log(text);
  switch(text) {
    case Language.EN.language:
      return Language.EN
    case Language.ID.language:
      return Language.ID
    default:
      return DEFAULT_LANGUAGE
  }
}

export const DEFAULT_LANGUAGE = Language.EN

export const ThemeContext = createContext(DEFAULT_LANGUAGE)