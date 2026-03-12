import '../faust.config'
import React from 'react'
import { useRouter } from 'next/router'
import { FaustProvider } from '@faustwp/core'
import '@faustwp/core/dist/css/toolbar.css'
import '../styles/global.scss'
import '../styles/slider.css'
import '../styles/footer.css'

export default function MyApp({ Component, pageProps }) {
  const router = useRouter()

  return (
    <FaustProvider pageProps={pageProps}>
      <Component {...pageProps} router={router} key={router.asPath} />
    </FaustProvider>
  )
}
