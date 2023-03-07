import { From } from "@/database/api";
import { Account } from "@/model/account";
import { CartItem } from "@/model/cart";
import { GetProduct, Product } from "@/model/product";
import { Auth } from "./Auth";
import ShowNotification, { NotificationTemplate } from "./NotificationController";

export const CartController = {
  UpdateCart: async function(account: Account | null, product: Product, quantity: number) {
    if(account) {
      const res = await From.Rest.fetchData("/account/order/cart", "PATCH", {
        account_id: account.id,
        product_id: product.id,
        quantity
      }, Auth.getToken())
      if(res.success) {
        ShowNotification("success", "Success", "The item is updated to the cart!")
      }
      else {
        console.error(res);
        NotificationTemplate.Error()
      }
    }
    else {
      ShowNotification("danger", "Error", "You must signed in to update items in a cart")
    }
  },

  DeleteCart: async function (account: Account | null, product: Product, quantity: number) {
    if(account) {
      const res = await From.Rest.fetchData("/account/order/cart", "DELETE", {
        account_id: account.id,
        product_id: product.id
      })
      if(res.success) {
        ShowNotification("success", "Success", "The item is deleted from the card!")
      }
    } 
    else {
      ShowNotification("danger", "Error", "You must signed in to update items in a cart")
    }
  },

  AddToCart: async function(account: Account | null, product: Product, quantity: number) {
    if(account) {
      const res = await From.Rest.fetchData("/account/order/cart", "POST", {
        account_id: account.id,
        product_id: product.id,
        quantity
      }, Auth.getToken())
      if(res.success) {
        ShowNotification("success", "Success", "The item is added to the cart!")
      }
      else {
        console.error(res);
        NotificationTemplate.Error()
      }
    }
    else {
      if(product.id) {
        sessionStorage.setItem("cart-prod-id", product.id)
        sessionStorage.setItem("cart-prod-qty", quantity.toString())
        return true;
      }
      else {
        NotificationTemplate.Error()
        console.error("Error occured when trying to Save Product, Product ID might be not available");
        console.log("ID : " + product.id);
        return false;
      }
    }
  },

  GetAllItems: async function(account: Account | null): Promise<CartItem[] | null> {
    if(!account) return null
    let output: CartItem[] = []

    await this.UpdateFromSession(account)
    NotificationTemplate.InProgress("Get all customer data from cart")

    return output
  },

  UpdateFromSession: async function(account: Account) {

    const id = sessionStorage.getItem("cart-prod-id")
    const qty = sessionStorage.getItem("cart-prod-qty")
    
    if(id && qty) {
      const product = await GetProduct(id)
      if(product && product.id) {
        NotificationTemplate.InProgress("Add data to cart, from customer ID")
      }
    }

  }
}