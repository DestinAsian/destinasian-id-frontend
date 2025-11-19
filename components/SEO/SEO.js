import Head from 'next/head'
import Script from 'next/script'
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google'
import { AdScript, AdConfig } from 'react-ad-manager'
import { GetFavicon } from '../../queries/GetFavicon'
import { useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
// import PageViewsCounter from '../PageViewsCounter/PageViewsCounter'

/**
 * Komponen SEO untuk halaman Next.js
 * Menangani meta tag, favicon, Google Tag Manager, Google Analytics, dan Ads.
 */
export default function SEO({ title, description, imageUrl, url, focuskw }) {
  const [locationPathname, setLocationPathname] = useState('')
  const [gtmLoaded, setGtmLoaded] = useState(false)

  // Ambil path URL saat ini
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setLocationPathname(window.location.pathname)
    }

    // Deteksi GTM sudah aktif
    const checkGtmLoaded = () => {
      if (window.dataLayer?.some((e) => e.event === 'gtm.js')) {
        setGtmLoaded(true)
      }
    }

    checkGtmLoaded()
    window.addEventListener('message', checkGtmLoaded)
    return () => window.removeEventListener('message', checkGtmLoaded)
  }, [])

  // Ambil favicon dari GraphQL
  const { data } = useQuery(GetFavicon, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'network-only',
  })
  const favicon = data?.favicon

  return (
    <>
      <Head>
        {/* ⚙️ Basic Meta */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:type" content="website" />
        <meta property="twitter:card" content="summary_large_image" />

        {/* 🧩 Favicon */}
        {favicon && (
          <link
            rel="icon"
            type="image/png"
            sizes={`${favicon?.mediaDetails?.width}x${favicon?.mediaDetails?.height}`}
            href={favicon?.sourceUrl}
          />
        )}

        {/* 🏷️ Title */}
        {title && (
          <>
            <title>{title}</title>
            <meta name="title" content={title} />
            <meta itemProp="name" content={title} />
            <meta property="og:title" content={title} />
            <meta property="twitter:title" content={title} />
          </>
        )}

        {/* 📝 Description */}
        {description && (
          <>
            <meta name="description" content={description} />
            <meta itemProp="description" content={description} />
            <meta property="og:description" content={description} />
            <meta property="twitter:description" content={description} />
          </>
        )}

        {/* 🖼️ Image */}
        {imageUrl && (
          <>
            <meta itemProp="image" content={imageUrl} />
            <meta property="og:image" content={imageUrl} />
            <meta property="twitter:image" content={imageUrl} />
          </>
        )}

        {/* 🔗 URL */}
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

        {/* 🗝️ Keywords */}
        <meta
          name="keywords"
          content={
            focuskw ||
            'luxury travel, travel, jalan-jalan, travel guide indonesia, indonesia luxury travel guide, indonesia travel magazine, travel online magazine, premium travel magazine, travel online website, destinasian indonesia'
          }
        />

        {/* 📢 Google Ad Manager */}
        <AdScript />
        <AdConfig
          networkCode={6808792}
          target={[['URL_Exact', locationPathname]]}
          collapseEmptyDivs
        />
      </Head>

      {/* 📊 Google Tag Manager */}
      <GoogleTagManager gtmId="GTM-K9B9SVH6" />

      {/* 📈 Google Analytics */}
      <GoogleAnalytics gaId="G-QXZNKCNDB2" />

      {/* 💻 GTM Backup (Script Manual untuk SSR) */}
      <Script
        id="manual-gtm-init"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];
              w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
              var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
              j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
              f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-K9B9SVH6');`,
        }}
      />

      {/* 🧱 GTM noscript fallback */}
      <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-K9B9SVH6"
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        ></iframe>
      </noscript>

      {/* 📊 StatCounter dan Clarity Tracking (dipanggil setelah GTM aktif) */}
      {/* {gtmLoaded && <PageViewsCounter />} */}
    </>
  )
}
