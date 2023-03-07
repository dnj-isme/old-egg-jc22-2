import { APIResponse, From } from "@/database/api"
import { SampleQuery } from "@/database/query"
import { Account } from "./account";
import { empty } from "./default";

export interface Category {
  id: string,
  category_name: string,
  products?: Product[]
  product_count: number
}

export interface Product {
  id?: string,
  store_id: string,
  product_name: string,
  product_stock: number,
  product_price: number,
  discount: number,
  description: string,
  category_id: string,

  store?: Account,
  category?: Category,
  product_specs?: Spec[]
  image_links?: string[]
  product_images?: ProductImage[]
}

export async function GetProduct(id: string): Promise<Product | null> {
  const res = await From.Graphql.execute(SampleQuery.productByID, {id})
  if(res && res.data) return res.data
  return null
}

export interface ProductImage {
  id: string,
  image_link: string
}

export interface Spec {
  id?: string,
  product_id?: string,
  key: string,
  value: string,

  product?: Product
}

export async function getAllCategory() : Promise<Category[] | null> {
  const data = await From.Graphql.execute(SampleQuery.categories);
  if(data.success) {
    return data.data
  }
  else {
    console.error(data)
    return null
  }
}