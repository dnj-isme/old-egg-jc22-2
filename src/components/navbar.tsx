import Image from "next/image"
import Logo from "@/assets/images/logo.svg"
import { Icon } from '@iconify/react';
import style from "@/styles/index.module.scss"

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
      </div>
      <div className={style.center}>

      </div>
      <div className={style.right}>
        <div>
          <Icon icon="mdi:bell-outline" className={style.bell}/>
        </div>
        <div>
          <Icon icon="openmoji:flag-united-states" className={style.language}/>
        </div>
      </div>
    </nav>
  );
}
