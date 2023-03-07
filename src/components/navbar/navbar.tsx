import Image from "next/image"
import Logo from "@/assets/images/logo.svg"
import { Icon } from '@iconify/react';
import style from "./navbar.module.scss"
import switchStyle from "./switch.module.scss"
import { useContext, useState, useEffect, MouseEvent } from "react";
import { Theme, ThemeContext } from "@/contexts/ThemeContext";
import { Auth } from "@/controller/Auth";
import { NextRouter, useRouter } from "next/router";
import ShowNotification, { NotificationTemplate } from "@/controller/NotificationController";
import { Account } from "@/model/account";
import { JsxElement } from "typescript";
import { From } from "@/database/api";
import { SampleQuery } from "@/database/query";
import { Category } from "@/model/product";
import { Comp } from "../component";
import { DEFAULT_LANGUAGE, Language } from "@/contexts/LanguageContext";

export async function navigateSignin(router: NextRouter) {
  const res = await Auth.getActiveAccount()
  if(res === null) {
    router.push("/auth/signin")
  }
  else {
    router.push("/account")
  }
}

export function navigateShoppingCart(router: NextRouter) {
  if(Auth.getActiveAccount !== null) {
    router.push("/account/cart")
  }
  else {
    router.push("/auth/signin/")
  }
}

export function navigateOrderList(account: Account | null, router: NextRouter) {
  if(account?.admin) {
    router.push("/account")
  }
  else if(account?.business) {
    router.push("/account")
  }
  else if (account) {
    // router.push("/orders")
    ShowNotification("info", "Not Implemented", "Feature is not implemented yet")
  }
  else {
    router.push("/auth/signin")
  }
}

export default function Navbar({changeTheme}: {changeTheme: () => any}) {
  const theme = useContext(ThemeContext);
  const router = useRouter()

  const [checked, setChecked] = useState(theme === Theme.LIGHT)
  const [name, setName] = useState(DEFAULT_LANGUAGE.signin)
  const [country, setCountry] = useState(DEFAULT_LANGUAGE.address)
  const [account, setAccount] = useState<Account | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [cartQty, setCartQty] = useState(0)

  const [language, setLanguage] = useState(DEFAULT_LANGUAGE)

  function checkboxChanged() {
    const res = !checked
    setChecked(res)
    changeTheme()
  }

  useEffect(() => {effect()}, [])

  function changeLanguage() {
    let target = language == Language.EN ? Language.ID : Language.EN
    setLanguage(target)
    localStorage.setItem("language", target.language)
    if(!account) {
      setName(target.signin)
      setCountry(target.address)
    }
  }

  async function effect() {
    const res1 = await Auth.getActiveAccount()
    
    if(res1) {
      setName(res1.first_name)
      setAccount(res1)
      Auth.extendSession();

      const res3 = await From.Graphql.execute(SampleQuery.cartByID, {
        id: res1.id
      })
      
      if(res3.success) {
        setCartQty(res3.data.length)
      }
      else {
        NotificationTemplate.Error()
        console.error(res3);
      }
    }

    const res2 = await From.Graphql.execute(SampleQuery.categories)
    if(res2.success) {
      setCategories(res2.data)
    }


    navigator.geolocation.getCurrentPosition(async ({coords}) => {
      const {longitude, latitude} = coords
      const res = await From.GeoLocation.getLocation(longitude, latitude)
      if(res.success && res.data.countryName) {
        setCountry(res.data.countryName)
      }

      let target = res.data.countryName == "Indonesia" ? Language.ID : Language.EN
      setLanguage(target)
      if(!res1) {
        setName(target.signin)
        setCountry(target.address)
      }
    })
  }

  return (
    <>
      <header className={style.navbar} style={{backgroundColor: theme.navbar, color: theme.textColor, borderColor: theme.border}}>
        <div className={style.left}>
          <div>
            <Icon icon="charm:menu-hamburger" className={style.hamburger} />
          </div>
          <div>
            <a href="/">
              <Image src={Logo} alt="logo" className={style.company}/>
            </a>
          </div>
          <div className={style.address}>
            <div>
              <Icon icon="material-symbols:location-on-outline-rounded" className={style.icon} />
            </div>
            <div className={style.text}>
              <p className={style.greeting}>Hello</p>
              <p className={style.select_address}>{country}</p>
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
            {
              language == Language.EN ? 
              <Icon icon="openmoji:flag-united-states" className={style.language} onClick={_ => changeLanguage()}/>
              :
              <Icon icon="openmoji:flag-indonesia" className={style.language} onClick={_ => changeLanguage()}/>
            }
          </div>
          <div>
            <div>
              <label className={switchStyle.switch}>
                <input type="checkbox" checked={theme === Theme.DARK} onChange={_ => checkboxChanged()}/>
                <span className={switchStyle.slider}></span>
              </label>
            </div>
          </div>
          <a className={style.user} onClick={_ => navigateSignin(router)} style={{color: theme.textColor}}>
            <div>
              <Icon icon="material-symbols:person-outline" className={style.icon}/>
            </div>
            <div className={style.text}>
              <p className={style.greeting}>{language.welcome}</p>
              <p className={style.action}>{name}</p>
            </div>
          </a>
          <a className={style.return_order} onClick={_ => navigateOrderList(account, router)} style={{color: theme.textColor}}>
            <p className={style.return}>{account?.admin ? "Admin" : account?.business ? "Shop" : language.return}</p>
            <p className={style.order}>{account?.admin || account?.business ? "Page" : language.orders}</p>
          </a>
          <a onClick={_ => navigateShoppingCart(router)} style={{color: theme.textColor}} className={style.cart}>
            {account ? <Comp.P>{cartQty} item(s)</Comp.P> : null}
            <Icon icon="ic:outline-shopping-cart" />
          </a>
        </div>
      </header>
      <nav className={style.nav} style={{backgroundColor: theme.navbar, borderColor: theme.border, color: theme.textColor}}>
        <ListItem href="/best-deals">{language.deals}</ListItem>
        <ListItem href="/best-seller">{language.seller}</ListItem>
        <ListItem href="/build-pc">{language.build}</ListItem>
        <li><Comp.P>{language.category}</Comp.P></li>
        {categories.map(data =>(
          <ListItem href={"/category/" + data.id}>{data.category_name}</ListItem>
        ))}
      </nav>
    </>
  );
}

function ListItem({href, onClick, children}: {href?: string, onClick?: (e: MouseEvent) => any, children?: JSX.Element | JSX.Element[] | string}) {
  const theme = useContext(ThemeContext)
  
  return <li>
    <a style={{color: theme.textColor}} onClick={onClick ? onClick : () => {}} href={href}>{children}</a>
  </li>
}