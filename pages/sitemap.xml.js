// // In pages/sitemap.xml.js:
// import { getSitemapProps } from '@faustwp/core'

// export default function Sitemap() {}

// export function getServerSideProps(ctx) {
//   return getSitemapProps(ctx, {
//     frontendUrl: process.env.FRONTEND_URL,
//   })
// }


// pages/sitemap.xml.js

// pages/sitemap.xml.js

// pages/sitemap.xml.js

export async function getServerSideProps({ res }) {
  const frontendUrl =
    process.env.FRONTEND_URL?.replace(/\/$/, '') || 'https://destinasian.co.id'

  // 🔹 Daftar sitemap yang akan muncul di sitemap index
  const sitemapFiles = [
    'post-sitemap.xml',
    'page-sitemap.xml',
    'editorial-sitemap.xml',
    'advertorial-sitemap.xml',
    'honors-circle-sitemap.xml',
    'update-sitemap.xml',
    'luxe-list-sitemap.xml',
    'readers-choice-award-sitemap.xml',
    'luxury-travel-sitemap.xml',
    'travel-guides-sitemap.xml',
    'category-sitemap.xml',
  ]

  // 🔹 Buat list dengan lastmod otomatis (bisa diganti dengan tanggal update)
  const sitemapList = sitemapFiles.map((fileName) => {
    const now = new Date().toISOString()
    return {
      loc: `${frontendUrl}/sitemap.xml?sitemap=${fileName}`,
      lastmod: now,
    }
  })

  // 🔹 Generate XML sitemapindex
  const sitemapIndexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapList
  .map(
    (item) => `
  <sitemap>
    <loc>${item.loc}</loc>
    <lastmod>${item.lastmod}</lastmod>
  </sitemap>`
  )
  .join('')}
</sitemapindex>`

  // 🔹 Kirim response XML
  res.setHeader('Content-Type', 'text/xml')
  res.write(sitemapIndexXml)
  res.end()

  return { props: {} }
}

// 🔹 Tidak perlu render apa pun di sisi client
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
