import Image from "next/image"
import Logo from "@/assets/images/logo.svg"
import { Icon } from '@iconify/react';
import style from "@/styles/navbar.module.scss"
import switchStyle from "@/styles/switch.module.scss"

export default function Navbar() {
  return (
    <nav className={style.navbar}>
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
              <input type="checkbox" />
              <span className={switchStyle.slider}></span>
            </label>
          </div>
        </div>
        <a className={style.user} href="/login">
            <div>
              <Icon icon="material-symbols:person-outline" className={style.icon}/>
            </div>
            <div className={style.text}>
              <p className={style.greeting}>Welcome</p>
              <p className={style.action}>Sign in / Register</p>
            </div>
        </a>
        <a className={style.return_order} href="/orders/list">
          <p className={style.return}>Returns</p>
          <p className={style.order}>& Orders</p>
        </a>
        <a href="/shop/cart">
          <Icon icon="ic:outline-shopping-cart" className={style.cart}/>
        </a>
      </div>
    </nav>
  );
}
