// import { AxiosResponse } from "axios";

/**
 * Lists the available query to be called to database
 */

export interface Query {
  query: string,
  functionName: string
}

export const SampleQuery = (function (){
  const test:Query = {
    functionName: "experimental",
    query: `
      query getAll {
        experimental {
          id,
          message,
          account {
            id,
            first_name,
            last_name
          }
        }
      }
    `
  }
  
  const banner:Query = {
    functionName: "banners",
    query: `
      query {
        banners {
          id,
          link,
          src,
          status,
          label
        }
      }
    `
  }

  const stores: Query = {
    functionName: "storeAccounts",
    query: `
      query($pagination: PaginationInput!) {
      query($pagination: PaginationInput!) {
        storeAccounts(pagination: $pagination) {
          id,
          first_name,
          last_name,
          email,
          phone,
          subscribe,
          status
        }
      }
    `
  }

  const customers: Query = {
    functionName: "customerAccounts",
    query: `
      query($pagination: PaginationInput!) {
        customerAccounts(pagination: $pagination) {
          id,
          first_name,
          last_name,
          email,
          phone,
          subscribe,
          status
        }
      }
    `
  }

  const categories: Query = {
    functionName: "categories",
    query: `
      query {
        categories {
          id,
          category_name
        }
      }
    `
  }

  const products: Query = {
    functionName: "products",
    query: `
      query($pagination: PaginationInput!) {
        products(pagination: $pagination) {
          id,
          product_name,
          product_stock,
          product_price,
          discount,
          product_images {
            id,
            image_link
          },
          product_specs {
            id,
            key,
            value
          },
          store {
            id
          }
        }
      }
    `
  }

  const categoryByID: Query = {
    functionName: "category",
    query: `
      query($id: String!, $pagination: PaginationInput!) {
        category(id: $id, pagination: $pagination) {
          id,
          category_name,
          products(pagination: $pagination) {
            id,
            product_name,
            product_stock,
            product_price,
            discount,
            description,
            product_images {
              image_link
            }
          },
          product_count
        }
      }
    `
  }
  
  const productByID: Query = {
    functionName: "product",
    query: `
      query($id: String!) {
        product(id: $id) {
          id,
          product_name,
          product_stock,
          product_price,
          discount,
          description,
          store {
            id,
            first_name,
            email,
            phone,
            status
          },
          category {
            category_name,
            products(pagination: {
              page: 1,
              contentsPerPage: 20
            }) {
              id,
              product_name,
              product_price,
              discount,
              product_images {
                image_link
              }
            }
          },
          product_images {
            image_link
          },
          product_specs {
            key,
            value
          },
        }
      }
    `
  }

  const topProducts: Query = {
    functionName: "topProducts",
    query: `
      query ($pagination: PaginationInput!) {
        topProducts(pagination: $pagination) {
          id,
          product_name,
          product_stock,
          product_price,
          product_specs {
            key,
            value
          },
          description,
          discount,
          store {
            id,
            first_name,
          },
          product_images {
            image_link
          }
        }
      }
    `
  }

  const cartByID: Query = {
    functionName: "cart",
    query: 
    `
      query($id: String!) {
        cart(account_id: $id) {
          product {
            id,
            product_name,
            product_price,
            product_stock,
            discount,
            description,
            store {
              id,
              last_name
            },
            category {
              id,
              category_name
            },
            product_images {
              image_link
            },
            product_specs {
              key,
              value
            }
          },
          quantity
        }
      }
    `
  }

  return {
    test, banner, stores, customers, categories, products, categoryByID, productByID, topProducts, cartByID
  }
})()