// // In pages/sitemap.xml.js:
// import { getSitemapProps } from '@faustwp/core'

// export default function Sitemap() {}

// export function getServerSideProps(ctx) {
//   return getSitemapProps(ctx, {
//     frontendUrl: process.env.FRONTEND_URL,
//   })
// }


// pages/sitemap.xml.js
import { getSitemapProps } from '@faustwp/core'

export const getServerSideProps = async (ctx) => {
  const sitemap = await getSitemapProps(ctx, {
    frontendUrl: process.env.FRONTEND_URL,
  })

  ctx.res.setHeader('Content-Type', 'application/xml')
  ctx.res.write(sitemap.props?.content || '')
  ctx.res.end()

  return { props: {} }
}

export default function Sitemap() {
  // kosong, karena sudah di-handle di server response
  return null
}
