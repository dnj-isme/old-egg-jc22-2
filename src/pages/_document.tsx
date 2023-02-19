import { Html, Head, Main, NextScript } from 'next/document'
import { ReactNotifications } from 'react-notifications-component'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>Old-egg</title>
      </Head>
      
      <body>
        <ReactNotifications />
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
