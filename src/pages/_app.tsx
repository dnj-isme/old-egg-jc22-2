import '@/styles/globals.css'
import '@/styles/template.css'
import '@/../node_modules/react-notifications-component/dist/theme.css'
import type { AppProps } from 'next/app'

declare global {
  var debug: boolean
  var signin: boolean
  var logout: boolean
  var unauthorized: boolean
  var register: boolean
  var forceLogout: boolean
  var bannerInsert: boolean
  var ban: boolean
  var unban: boolean
  var checkout: boolean
}
global.debug = true
global.checkout = false
global.signin = false
global.unauthorized = false
global.logout = false
global.register = false
global.forceLogout = false
global.ban = false
global.unban = false

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
