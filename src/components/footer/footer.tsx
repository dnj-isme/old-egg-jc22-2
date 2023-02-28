import { DEFAULT_THEME, getTheme, ThemeContext, ThemeType } from '@/contexts/ThemeContext';
import { Auth } from '@/controller/Auth';
import { Account } from '@/model/account';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState, useContext } from 'react';
import { Comp } from '../component';
import { navigateOrderList, navigateSignin } from '../navbar/navbar';
import style from "./footer.module.scss";

export default function Footer() {
  const theme = useContext(ThemeContext)
  const router = useRouter()

  const [account, setAccount] = useState<Account | null>(null)
  useEffect(() => {
    async function fetchAccount() {
      setAccount(await Auth.getActiveAccount());
    }
    fetchAccount();
  }, [])

  // TODO: Your custom logic starts here...
  
  return (
    <ThemeContext.Provider value={theme}>
      <div className={style.main} style={{backgroundColor: theme.background}}>
        {/* TODO: Your HTML code starts here */}
        <footer style={{backgroundColor: theme.footer}}>
          <div className={style.column}>
            <h3>CUSTOMER SERVICE</h3>
            <div>
              <a href="https://kb.newegg.com/">Help Center</a>
              <a href="#">Track an Order</a>
              <a href="#">Return an Item</a>
              <a href="https://www.newegg.com/promotions/nepro/22-0073/index.html?cm_sp=cs_menu-_-return_policy">Return Policy</a>
              <a href="https://kb.newegg.com/Article/Index/12/3?id=1166">Privacy & Security</a>
              <a href="#">Feedback</a>
            </div>
          </div>
          <div className={style.column}>
            <h3>MY ACCOUNT</h3>
            <div>
              <a onClick={_ => navigateSignin(router)}>Login/Register</a>
              <a onClick={_ => navigateOrderList(account, router)}>Order History</a>
              <a onClick={_ => navigateOrderList(account, router)}>Returns History</a>
              <a href="https://secure.newegg.com/account/addressbook">Address Book</a>
              <a href="#">Wish Lists</a>
              <a href="#">My Build Lists</a>
              <a href="#">My Build Showcase</a>
              <a href="#">Email Notifications</a>
              <a href="#">Subscriptions Orders</a>
              <a href="#">Auto Notifications</a>
            </div>
          </div>        
          <div className={style.column}>
            <h3>COMPANY INFORMATION</h3>
            <div>
              <a href="https://www.newegg.com/corporate/about">About Newegg</a>
              <a href="#">Investor Relations</a>
              <a href="#">Awards/Rankings</a>
              <a href="#">Hours and Locations</a>
              <a href="#">Press Inquiries</a>
              <a href="#">Newegg Careers</a>
              <a href="https://www.newegg.com/corporate/newsroom">Newsroom</a>
              <a href="#">Newegg Insider</a>
              <a href="#">Calif. Transparency <br /> in Supply Chains Act</a>
              <a href="#">Cigna MRF</a>
            </div>
          </div>
          <div className={style.column}>
            <h3>TOOLS & RESOURCES</h3>
            <div>
              <a href="#">Sell on Newegg</a>
              <a href="#">For Your Business</a>
              <a href="#">Newegg Partner Services</a>
              <a href="#">Become an Affiliate</a>
              <a href="#">Newegg Creators</a>
              <a href="#">Site Map</a>
              <a href="#">Shop by Brand</a>
              <a href="#">Rebates</a>
              <a href="https://www.newegg.com/mobile">Mobile Apps</a>
            </div>
          </div>
          <div className={style.column}>
            <h3>SHOP OUR BRANDS</h3>
            <div>
              <a href="#">Newegg Business</a>
              <a href="#">Newegg Global</a>
              <a href="#">ABS</a>
              <a href="#">Rosewill</a>
            </div>
          </div>
        </footer>
        <div className={style.closing}>
          <Comp.P>© 2000-2023 Newegg Inc.  All rights reserved.</Comp.P>
          <Comp.A href="#">Terms & Conditions</Comp.A>
          <Comp.A href="#">Privacy Policy</Comp.A>
          <Comp.A href="#">Cookie Preferences</Comp.A>
        </div>
      </div>
    </ThemeContext.Provider>
  )
}