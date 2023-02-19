import { DEFAULT_THEME, getTheme, ThemeContext, ThemeType } from '@/contexts/ThemeContext';
import Image from 'next/image';
import { useEffect, useState, useContext } from 'react';
import style from "./footer.module.scss";

export default function Footer() {
  const theme = useContext(ThemeContext)

  // TODO: Your custom logic starts here...
  
  return (
    <ThemeContext.Provider value={theme}>
      <div className={style.main} style={{backgroundColor: theme.background}}>
        {/* TODO: Your HTML code starts here */}
        <footer style={{backgroundColor: theme.background2}}>
          <div className={style.column}>
            <h3 style={{color: theme.textColor}}>CUSTOMER SERVICE</h3>
            <div>
              <a style={{color: theme.textColor}} href="#">Help Center</a>
              <a style={{color: theme.textColor}} href="#">Track an Order</a>
              <a style={{color: theme.textColor}} href="#">Return an Item</a>
              <a style={{color: theme.textColor}} href="#">Return Policy</a>
              <a style={{color: theme.textColor}} href="#">Privacy & Security</a>
              <a style={{color: theme.textColor}} href="#">Feedback</a>
            </div>
          </div>
          <div className={style.column}>
            <h3 style={{color: theme.textColor}}>MY ACCOUNT</h3>
            <div>
              <a style={{color: theme.textColor}} href="#">Login/Register</a>
              <a style={{color: theme.textColor}} href="#">Order History</a>
              <a style={{color: theme.textColor}} href="#">Returns History</a>
              <a style={{color: theme.textColor}} href="#">Address Book</a>
              <a style={{color: theme.textColor}} href="#">Wish Lists</a>
              <a style={{color: theme.textColor}} href="#">My Build Lists</a>
              <a style={{color: theme.textColor}} href="#">My Build Showcase</a>
              <a style={{color: theme.textColor}} href="#">Email Notifications</a>
              <a style={{color: theme.textColor}} href="#">Subscriptions Orders</a>
              <a style={{color: theme.textColor}} href="#">Auto Notifications</a>
            </div>
          </div>        
          <div className={style.column}>
            <h3 style={{color: theme.textColor}}>COMPANY INFORMATION</h3>
            <div>
              <a style={{color: theme.textColor}} href="#">About Newegg</a>
              <a style={{color: theme.textColor}} href="#">Investor Relations</a>
              <a style={{color: theme.textColor}} href="#">Awards/Rankings</a>
              <a style={{color: theme.textColor}} href="#">Hours and Locations</a>
              <a style={{color: theme.textColor}} href="#">Press Inquiries</a>
              <a style={{color: theme.textColor}} href="#">Newegg Careers</a>
              <a style={{color: theme.textColor}} href="#">Newsroom</a>
              <a style={{color: theme.textColor}} href="#">Newegg Insider</a>
              <a style={{color: theme.textColor}} href="#">Calif. Transparency <br /> in Supply Chains Act</a>
              <a style={{color: theme.textColor}} href="#">Cigna MRF</a>
            </div>
          </div>
          <div className={style.column}>
            <h3 style={{color: theme.textColor}}>TOOLS & RESOURCES</h3>
            <div>
              <a style={{color: theme.textColor}} href="#">Sell on Newegg</a>
              <a style={{color: theme.textColor}} href="#">For Your Business</a>
              <a style={{color: theme.textColor}} href="#">Newegg Partner Services</a>
              <a style={{color: theme.textColor}} href="#">Become an Affiliate</a>
              <a style={{color: theme.textColor}} href="#">Newegg Creators</a>
              <a style={{color: theme.textColor}} href="#">Site Map</a>
              <a style={{color: theme.textColor}} href="#">Shop by Brand</a>
              <a style={{color: theme.textColor}} href="#">Rebates</a>
              <a style={{color: theme.textColor}} href="#">Mobile Apps</a>
            </div>
          </div>
          <div className={style.column}>
            <h3 style={{color: theme.textColor}}>SHOP OUR BRANDS</h3>
            <div>
              <a style={{color: theme.textColor}} href="#">Newegg Business</a>
              <a style={{color: theme.textColor}} href="#">Newegg Global</a>
              <a style={{color: theme.textColor}} href="#">ABS</a>
              <a style={{color: theme.textColor}} href="#">Rosewill</a>
            </div>
          </div>
        </footer>
        <div className={style.closing}>
          <p style={{color: theme.textColor}}>© 2000-2023 Newegg Inc.  All rights reserved.</p>
          <a style={{color: theme.textColor}} href="#">Terms & Conditions</a>
          <a style={{color: theme.textColor}} href="#">Privacy Policy</a>
          <a style={{color: theme.textColor}} href="#">Cookie Preferences</a>
        </div>
      </div>
    </ThemeContext.Provider>
  )
}