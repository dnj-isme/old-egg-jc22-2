import Image from "next/image"
import Logo from "@/assets/images/logo.svg"
import { Icon } from '@iconify/react';
import style from "./navbar.module.scss"
import switchStyle from "./switch.module.scss"
import { useContext, useState, useEffect } from "react";
import { Theme, ThemeContext } from "@/contexts/ThemeContext";
import { Auth } from "@/controller/Auth";
import { Account, isAccount } from "@/contexts/AccountContext";
import { useRouter } from "next/router";
import ShowNotification from "@/controller/NotificationController";

export default function Navbar({changeTheme}: {changeTheme: Function}) {
  const theme = useContext(ThemeContext);
  const router = useRouter()

  const [checked, setChecked] = useState(theme === Theme.LIGHT)
  const [account, setAccount] = useState("Sign in / Register")

  function checkboxChanged() {
    const res = !checked
    setChecked(res)
    changeTheme()
  }

  useEffect(() => {
    Auth.getActiveAccount().then(res => {
      if(res != null) {
        setAccount(res.first_name)
        Auth.extendSession();
      }
    })
  }, [])

  async function navigateSignin() {
    const res = await Auth.getActiveAccount()
    if(res === null) {
      router.push("/auth/signin")
    }
    else {
      Auth.logout();
      router.reload()
    }
  }
  
  function navigateOrderList() {
    // href="/orders/list"
    if(Auth.getActiveAccount !== null) {
      Auth.logout()
      global.logout = true;
      router.reload();
    }
    else {
      router.push("/auth/signin/")
    }
  }
  
  function navigateShoppingCart() {
    if(Auth.getActiveAccount !== null) {
      ShowNotification("info", "In Progress", "View Shopping Cart is in Progress")
    }
    else {
      router.push("/auth/signin/")
    }
  }

  return (
    <nav className={style.navbar} style={{backgroundColor: theme.navbar, color: theme.textColor, borderColor: theme.border}}>
      <div className={style.left}>
        <div>
          <Icon icon="charm:menu-hamburger" className={style.hamburger} />
        </div>
        <div>
          <Image src={Logo} alt="logo" className={style.company}/>
        </div>
        <div className={style.address}>
          <div>
            <Icon icon="material-symbols:location-on-outline-rounded" className={style.icon} />
          </div>
          <div className={style.text}>
            <p className={style.greeting}>Hello</p>
            <p className={style.select_address}>Select address</p>
          </div>
        </div>
        <form className={style.search}>
          <div>
            <input type="text" name="" id="" className={style.input}/>
          </div>
          <div>
            <button type="submit" className={style.submit}>
              <Icon icon="material-symbols:search-rounded" className={style.icon}/>
            </button>
          </div>
        </form>
      </div>
      <div className={style.right}>
        <div>
          <Icon icon="mdi:bell-outline" className={style.bell}/>
        </div>
        <div>
          <Icon icon="openmoji:flag-united-states" className={style.language}/>
        </div>
        <div>
          <div>
            <label className={switchStyle.switch}>
              <input type="checkbox" checked={theme === Theme.DARK} onChange={_ => checkboxChanged()}/>
              <span className={switchStyle.slider}></span>
            </label>
          </div>
        </div>
        <a className={style.user} onClick={_ => navigateSignin()} style={{color: theme.textColor}}>
            <div>
              <Icon icon="material-symbols:person-outline" className={style.icon}/>
            </div>
            <div className={style.text}>
              <p className={style.greeting}>Welcome</p>
              <p className={style.action}>{account}</p>
            </div>
        </a>
        <a className={style.return_order} onClick={_ => navigateOrderList()} style={{color: theme.textColor}}>
          <p className={style.return}>Returns</p>
          <p className={style.order}>& Orders</p>
        </a>
        <a onClick={_ => navigateShoppingCart()} style={{color: theme.textColor}}>
          <Icon icon="ic:outline-shopping-cart" className={style.cart}/>
        </a>
      </div>
    </nav>
  );
}
