// import { AxiosResponse } from "axios";

/**
 * Lists the available query to be called to database
 */

export interface Query {
  query: string,
  functionName: string
}

export const SampleQuery = (function (){
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
      query($pagination: PaginationInput, $filter: FilterInput) {
        storeAccounts(pagination: $pagination, filter: $filter) {
          id,
          first_name,
          email,
          phone,
        }
      }
    `
  }

  const customers: Query = {
    functionName: "customerAccounts",
    query: `
      query($pagination: PaginationInput) {
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
      query($filter: String) {
        categories(filter: $filter) {
          id,
          category_name
        }
      }
    `
  }

  const products: Query = {
    functionName: "products",
    query: `
      query ($pagination: PaginationInput, $filter: FilterInput) {
        products(pagination: $pagination, filter: $filter) {
          id
          product_name
          product_stock
          product_price
          discount
          product_images {
            id
            image_link
          }
          product_specs {
            id
            key
            value
          }
          store {
            account {
              id
            }
          }
        }
      }
    `
  }

  const categoryByID: Query = {
    functionName: "category",
    query: `
      query($id: String!, $pagination: PaginationInput) {
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

  const viewStoreReviewUsefulness: Query = {
    functionName: 'storeReviewUseful',
    query: `
      query($account_id: String!, $store_review_id: String!) {
        storeReviewUseful(account_id: $account_id, store_review_id: $store_review_id)
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
            account {
              id,
              first_name,
              email,
              phone,
              status
            }
          },
          category {
            category_name,
            products {
              id,
              product_name,
              product_stock,
              product_price,
              discount,
              description,
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
      query ($pagination: PaginationInput) {
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
            account {
              id,
              first_name,
            }
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
              account {
                id,
                last_name
              }
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

  const storeDetail: Query = {
    functionName: "storeDetail",
    query: `
      query($id: String!) {
        storeDetail(id: $id) {
          account {
            id,
            first_name,
            email,
            phone
          },
          banner,
          return_policy,
          about
          sales
          categories {
            id,
            category_name,
            products {
              id
              product_name
              product_stock
            }
          }
          products {
            id,
            product_name,
            product_stock,
            product_price,
            discount,
            description,
            product_images {
              image_link
            }
            store {
              account {
                id
              }
            }
          }
          reviews {
            id
            account {
              id
              first_name
            }
            description
            rating
            helpful
            notHelpful
            created_at
          }
        }
      }
    `
  }

  const productsByStoreID: Query = {
    functionName: "products",
    query: `
      query($pagination: PaginationInput, $filter: FilterInput) {
        products(pagination: $pagination, filter: $filter) {
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
            account {
              id
            }
          }
        }
      }
    `
  }

  const countProducts: Query = {
    functionName: "countProducts",
    query: `
      query ($filter:FilterInput) {
        countProducts(filter: $filter) 
      }
    `
  }

  const storeReviewsByStoreID: Query = {
    functionName: "storeReviews",
    query: `
      query($store_id: String!, $pagination: PaginationInput) {
        storeReviews(store_id: $store_id, pagination: $pagination) {
          id
          account {
            id,
            first_name
          }
          description
          rating
          helpful
          notHelpful
          created_at
        }
      }
    `
  }

  const wishlist_data = `
    id
    title
    description
    public_wishlist
    promo
    total_price
    account {
      id
      first_name
      email
    }
    details {
      product {
        id
        product_name
        product_price
        discount
        product_images {
          image_link
        }
      }
      quantity
    }
    reviews {
      account {
        id
        first_name
        email
      }
      anonymous
      rating
      detail
    }
  `

  const followedWishlists: Query = {
    functionName: "followedWishlists",
    query: `
      query($account_id: String!) {
        followedWishlists(account_id: $account_id) {
          id
          note
          wishlist {
            ${wishlist_data}
          }
        }
      }
    `
  }

  const wishlists: Query = {
    functionName: "wishlists",
    query: `
      query($pagination: PaginationInput, $filter: WishlistFilterInput) {
        wishlists(pagination: $pagination, filter: $filter) {
          ${wishlist_data}
        }
      }
    `
  }

  const wishlistByID: Query = {
    functionName: "wishlist",
    query: `
      query($id: String!) {
        wishlist(id: $id) {
          ${wishlist_data}
        }
      }
    `
  }

  const countWishlist: Query = {
    functionName: "countWishlists",
    query: `
      query($filter: WishlistFilterInput) {
        countWishlists(filter: $filter)
      }
    `
  }

  const transactionDetail = `
    id,
    created_at,
    account {
      id,
      first_name
    }
    payment_method
    status
    details {
      product {
        id,
        product_name
        store {
          id
          account {
            first_name
          }
        }
        product_price
        discount
        product_images {
          image_link
        }
      }
      quantity
      status
    }
  `

  const transactionsByID: Query = {
    functionName: "transactions",
    query: `
      query($id: String!) {
        transactions(account_id: $id) {
          ${transactionDetail}
        }
      }
    `
  }

  const transaction: Query = {
    functionName: "transaction",
    query: `
      query($id: String!) {
        transaction(id: $id) {
          ${transactionDetail}
        }
      }
    `
  }

  const vouchers: Query = {
    functionName: "vouchers",
    query: `
      query {
        vouchers {
          id
          title
          description
          value
          used
          one_time
          valid_until
        }
      }
    `
  }

  const storeReviewsByAccount: Query= {
    functionName: "storeReviewsByCustomer",
    query: `
      query($id: String!) {
        storeReviewsByCustomer(account_id: $id) {
          id
          store {
            id
            account {
              id
              first_name
            }
          }
          description
          rating
          created_at
          helpful
          notHelpful
        }
      }
    `
  }

  const wishlistReviewsByAccount: Query = {
    functionName: "wishlistReviewsByCustomer",
    query: `
      query($id: String!) {
        wishlistReviewsByCustomer(account_id: $id) {
          id
          wishlist {
            id
            title
          }
          rating
          detail
          anonymous
        }
      }
    `
  }

  const messages: Query = {
    functionName: "messages",
    query: `
      query ($id: String!) {
        messages(account_id: $id) {
          id
          message
          sender {
            id
            first_name
          }
          receiver {
            id
            first_name
          }
        }
      }
    `
  }

  const allChats: Query = {
    functionName: "chats",
    query: `
      query ($email:String!, $password:String!) {
        viewAllChats(email: $email, password: $password) {
          participants {
            id,
            first_name
          }
          messages {
            id
            message
            sender {
              id
              first_name
            }
            receiver {
              id
              first_name
            }
          }
        }
      }
    `
  }

  const accountByID: Query = {
    functionName: "account",
    query: `
      query($id: String!) {
        account(id: $id) {
          id
          first_name
          last_name
          email
          phone
          subscribe
          business
          status
          egg_currency
        }
      }
    `
  }

  return {
    banner, 
    stores, 
    customers, 
    categories, 
    products, 
    categoryByID, 
    productByID, 
    topProducts, 
    cartByID, 
    storeDetail,
    productsByStoreID,
    countProducts,
    storeReviewsByStoreID,
    viewStoreReviewUsefulness,
    wishlists,
    wishlistByID,
    countWishlist,
    transactionsByID,
    transaction,
    followedWishlists,
    vouchers,
    storeReviewsByAccount,
    wishlistReviewsByAccount,
    messages,
    allChats,
    accountByID
  }
})()