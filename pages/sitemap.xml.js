export const runtime = 'nodejs'

export default function Sitemap() {
  return null
}

export async function getServerSideProps({ res, query }) {
  const backendIndex = process.env.NEXT_PUBLIC_BACKEND_SITEMAP
  const frontendUrl = process.env.FRONTEND_URL || 'https://destinasian.co.id'
  const backendDomain = 'https://backend.destinasian.co.id'

  if (!backendIndex) {
    res.statusCode = 500
    res.end('NEXT_PUBLIC_BACKEND_SITEMAP belum diset')
    return { props: {} }
  }

  try {
    const indexResponse = await fetch(backendIndex)
    const indexXml = await indexResponse.text()

    /**
     * =============================
     * INDEX SITEMAP
     * =============================
     */

    if (!query.sitemap) {
      const sitemapBlocks = [
        ...indexXml.matchAll(/<sitemap>([\s\S]*?)<\/sitemap>/g),
      ]

      const sitemapList = sitemapBlocks
        .map((m) => {
          const block = m[1]
          const loc = block.match(/<loc>(.*?)<\/loc>/)?.[1]
          const lastmod = block.match(/<lastmod>(.*?)<\/lastmod>/)?.[1]

          if (!loc) return ''

          const filename = loc.split('/').pop()

          return `
<sitemap>
 <loc>${frontendUrl}/sitemap.xml?sitemap=${filename}</loc>
 ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}
</sitemap>`
        })
        .join('\n')

      const output = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapList}
</sitemapindex>`

      res.setHeader('Content-Type', 'application/xml; charset=UTF-8')
      res.end(output)
      return { props: {} }
    }

    /**
     * =============================
     * CHILD SITEMAP
     * =============================
     */

    const selected = query.sitemap

    const sitemapUrls = [...indexXml.matchAll(/<loc>(.*?)<\/loc>/g)].map(
      (m) => m[1],
    )

    const target = sitemapUrls.find((u) => u.includes(selected))

    if (!target) {
      res.statusCode = 404
      res.end('Sitemap tidak ditemukan')
      return { props: {} }
    }

    const groupResponse = await fetch(target)
    const groupXml = await groupResponse.text()

    const urls = [...groupXml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => {
      let block = m[1]

      block = block.replace(
        /<loc>(.*?)<\/loc>/gi,
        (_, loc) => `<loc>${loc.replace(backendDomain, frontendUrl)}</loc>`,
      )

      return `<url>${block}</url>`
    })

    const merged = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
 xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
 xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>`

    res.setHeader('Content-Type', 'application/xml; charset=UTF-8')
    res.end(merged)
  } catch (e) {
    console.error(e)
    res.statusCode = 500
    res.end('Gagal generate sitemap')
  }

  return { props: {} }
}
