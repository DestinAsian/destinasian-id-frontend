import Head from 'next/head'
import Script from 'next/script'
import { GoogleTagManager } from '@next/third-parties/google'
import { AdScript, AdConfig } from 'react-ad-manager'
import { GetFavicon } from '../../queries/GetFavicon'
import { useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'

/**
 * Provide SEO related meta tags to a page.
 *
 * @param {Props} props The props object.
 * @param {string} props.title Used for the page title, og:title, twitter:title, etc.
 * @param {string} props.description Used for the meta description, og:description, twitter:description, etc.
 * @param {string} props.imageUrl Used for the og:image and twitter:image. NOTE: Must be an absolute url.
 * @param {string} props.url Used for the og:url and twitter:url.
 *
 * @returns {React.ReactElement} The SEO component
 */
export default function SEO({ title, description, imageUrl, url, focuskw }) {
  const [locationPathname, setLocationPathname] = useState('')

  useEffect(() => {
    // Check if the window object is defined (for SSR compatibility)
    if (typeof window !== 'undefined') {
      const currentPathname = window?.location?.pathname
      setLocationPathname(currentPathname)
    }
  }, []) // Run this effect only once on component mount

  const { data } = useQuery(GetFavicon, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network',
  })

  // Get Favicon
  const favicon = data?.favicon

  return (
    <>
      <Head>
        <meta property="og:type" content="website" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta name="viewport" content="width=device-width, user-scalable=no" />

        {/* Favicon */}
        {favicon && (
          <link
            key={`fav-${favicon?.mediaDetails?.width}x${favicon?.mediaDetails?.height}`}
            rel="icon"
            type="image/png"
            sizes={`${favicon?.mediaDetails?.width}x${favicon?.mediaDetails?.height}`}
            href={favicon?.sourceUrl}
          />
        )}

        {title && (
          <>
            <title>{title}</title>
            <meta name="title" content={title} />
            <meta itemProp="name" content={title} />
            <meta property="og:title" content={title} />
            <meta property="twitter:title" content={title} />
          </>
        )}

        {description && (
          <>
            <meta name="description" content={description} />
            <meta itemProp="description" content={description} />
            <meta property="og:description" content={description} />
            <meta property="twitter:description" content={description} />
          </>
        )}

        {imageUrl && (
          <>
            <meta itemProp="image" content={imageUrl} />
            <meta property="og:image" content={imageUrl} />
            <meta property="twitter:image" content={imageUrl} />
          </>
        )}

        {url && (
          <>
            <meta
              property="og:url"
              content={
                url.startsWith('http') ? url : 'https://destinasian.co.id' + url
              }
            />
            <meta
              property="twitter:url"
              content={
                url.startsWith('http') ? url : 'https://destinasian.co.id' + url
              }
            />
          </>
        )}

        {focuskw && <meta name="keywords" content={focuskw} />}

        {/* SEM Keywords */}
        <meta
          name="keywords"
          content="luxury travel, travel, jalan-jalan, travel guide indonesia, indonesia luxury travel guide, indonesia travel magazine, travel online magazine, premium travel magazine, travel online website, destinasian indonesia"
        />

        {/* Google Ad Manager */}
        <AdScript />
        <AdConfig
          networkCode={6808792}
          target={[['URL_Exact', locationPathname]]}
          collapseEmptyDivs={true}
        />
      </Head>

      {/* Google Tag Manager */}
      <GoogleTagManager gtmId="GTM-K9B9SVH6" />

      {/* Frmwrk Tracking Code */}
      <Script
        beforeInteractive
        id="frmwrk-script"
        dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-K9B9SVH6');`,
        }}
      />
      {/* End Frmwrk Tracking Code */}

      {/* Google Tag Manager (noscript) */}
      <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-K9B9SVH6"
          height="0"
          width="0"
          className="invisible hidden"
        ></iframe>
      </noscript>
      {/* End Google Tag Manager (noscript) */}
    </>
  )
}
