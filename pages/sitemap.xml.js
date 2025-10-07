// // In pages/sitemap.xml.js:
// import { getSitemapProps } from '@faustwp/core'

// export default function Sitemap() {}

// export function getServerSideProps(ctx) {
//   return getSitemapProps(ctx, {
//     frontendUrl: process.env.FRONTEND_URL,
//   })
// }


// pages/sitemap.xml.js

export async function getServerSideProps({ res }) {
  const frontendUrl =
    process.env.FRONTEND_URL?.replace(/\/$/, '') || 'https://destinasian.co.id'
  const remoteSitemapUrl = `${frontendUrl}/sitemap_index.xml`

  try {
    const response = await fetch(remoteSitemapUrl, {
      headers: {
        'User-Agent': 'Next.js Sitemap Proxy',
        Accept: 'application/xml',
      },
    })

    if (!response.ok) {
      throw new Error(`Gagal fetch sitemap (${response.status}) dari ${remoteSitemapUrl}`)
    }

    const xml = await response.text()

    res.setHeader('Content-Type', 'text/xml')
    res.write(xml)
    res.end()
  } catch {
    const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url>
          <loc>${frontendUrl}/</loc>
          <changefreq>daily</changefreq>
          <priority>1.0</priority>
        </url>
      </urlset>`

    res.setHeader('Content-Type', 'text/xml')
    res.write(fallbackXml)
    res.end()
  }

  return { props: {} }
}

export default function Sitemap() {
  return null
}


// // pages/sitemap.xml.js
// import { getSitemapProps } from '@faustwp/core'

// export const getServerSideProps = async (ctx) => {
//   const sitemap = await getSitemapProps(ctx, {
//     frontendUrl: process.env.FRONTEND_URL,
//   })

//   ctx.res.setHeader('Content-Type', 'application/xml')
//   ctx.res.write(sitemap.props?.content || '')
//   ctx.res.end()

//   return { props: {} }
// }

// export default function Sitemap() {
//   // kosong, karena sudah di-handle di server response
//   return null
// }
