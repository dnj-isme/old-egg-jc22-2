import { From } from "@/database/api";
import { Account, AccountContext } from "@/contexts/AccountContext";
import { useRouter } from "next/router";
import Cookies from "universal-cookie";
import {useEffect, useState} from 'react';

export interface ProtectionParameter {
  MustLogin?: boolean,
  MustLogout?: boolean
  MustAdmin?: boolean
  children: any
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

  function getToken() {
    const cookies = new Cookies()
    return cookies.get("token");
  }
  
  async function getActiveAccount(): Promise<null | Account> {
    const token = getToken();
    const result = await From.Rest.fetchData("/account/extract", "POST", {token})
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

    const [account, setAccount] = useState<Account | null>(null)

    useEffect(() => {fetchAccount()}, []);
    async function fetchAccount() {
      setAccount(await getActiveAccount())
    }

    if(props.MustLogout && account != null) {
      router.push("/");
      return null      
    }

    if(props.MustLogin && account == null) {
      router.push("/login")
      return null
    }
    else if(props.MustAdmin && !account?.admin) {
      global.unauthorized = true;
      router.push("/")
      return null;
    }
    return (
      <AccountContext.Provider value={account}>
        {props.children}
      </AccountContext.Provider>
    )
  }

  function logout() {
    const cookies = new Cookies()
    cookies.remove("token");
  }

  return {
    attemptLogin, getToken, extendSession, getActiveAccount, Protection, logout
  }
})()
