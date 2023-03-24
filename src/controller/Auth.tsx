import { From } from "@/database/api";
import { useRouter } from "next/router";
import Cookies from "universal-cookie";
import {useEffect, useState} from 'react';
import { Account } from "@/model/account";
import ShowNotification from "./NotificationController";

export interface ProtectionParameter {
  MustLogin?: boolean,
  MustLogout?: boolean
  MustAdmin?: boolean,
  MustBusiness?: boolean,
  children: any
  CustomRule?: boolean
}

export const Auth = (function() {
  async function attemptLogin(email: string, password: string) {
    const result = await From.Rest.fetchData("/account/login", "POST", {
      email,
      password
    })
    if(result.success) {
      const cookies = new Cookies();

      let expires = new Date(Date.now())
      expires.setMinutes(expires.getMinutes() + 15);

      cookies.set("token", result.data.token, {expires: expires, path: "/"});
    }
    return result
  }

  function setToken(token: string) {
    const cookies = new Cookies()

    let expires = new Date(Date.now())
    expires.setMinutes(expires.getMinutes() + 15);

    cookies.set("token", token, {expires: expires, path: "/"});
  }

  function getToken() {
    const cookies = new Cookies()
    return cookies.get("token");
  }
  
  async function getActiveAccount(): Promise<null | Account> {
    const token = getToken();
    if(token == null) return null
    const result = await From.Rest.fetchData("/account/extract", "POST", {token})
    
    if(!result.success && result.data.startsWith("token is expired")) {
      global.forceLogout = true;
      logout();
    }
    
    return result.success ? result.data : null
  }

  async function extendSession() {
    const current = getToken();
    const res = await From.Rest.fetchData("/account/extend", "POST", {token: current})
    if(res.success) {
      const cookies = new Cookies();
      let expires = new Date(Date.now())
      expires.setMinutes(expires.getMinutes() + 15);
      cookies.set("token", res.data.token, {expires: expires, path: "/"});
    }
    else console.error(res);
  }

  function Protection(props: ProtectionParameter): JSX.Element | null {
    const router = useRouter()

    useEffect(() => {fetchAccount()}, []);
    async function fetchAccount() {
      const account = await getActiveAccount()
      if(props.MustLogout && account != null) {
        router.push("/");
        return null      
      }
      
      if(props.MustLogin && account == null) {
        router.push("/auth/signin")
        return null
      }
      if(props.MustBusiness && !account?.business) {
        global.unauthorized = true;
        router.push("/")
        return null;
      }
      if(props.MustAdmin && !account?.admin) {
        global.unauthorized = true;
        router.push("/")
        return null;
      }
      if(props.CustomRule && !props.CustomRule) {
        global.unauthorized = true
        router.back()
        return null
      }
    }

    return (props.children)
  }

  function logout() {
    const cookies = new Cookies()
    cookies.remove("token", {path: "/"})
    global.logout = true
  }

  return {
    attemptLogin, getToken, extendSession, getActiveAccount, Protection, logout, setToken
  }
})()
