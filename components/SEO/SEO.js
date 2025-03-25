import Head from 'next/head'
import { GetFavicon } from '../../queries/GetFavicon'
import { useQuery } from '@apollo/client'
import Script from 'next/script'

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
export default function SEO() {
  const { data } = useQuery(GetFavicon, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network',
  })

  const favicon = data?.favicon?.mediaDetails?.sizes

  return (
    <>
      <Head>
        {/* Favicon */}
        {favicon?.length > 0 &&
          favicon.map(({ width, sourceUrl }) => {
            if (width === '180') {
              return (
                <link
                  key={`fav-${width}x${width}`}
                  rel="apple-touch-icon"
                  href={sourceUrl}
                  sizes={`${width}x${width}`}
                />
              )
            }
            return (
              <link
                key={`fav-${width}x${width}`}
                rel="icon"
                type="image/png"
                sizes={`${width}x${width}`}
                href={sourceUrl}
              />
            )
          })}

        {/* Testing Typography Cloud */}
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cloud.typography.com/7429004/6477832/css/fonts.css"
        />
      </Head>
    </>
  )
}
