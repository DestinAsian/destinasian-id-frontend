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
    res.setHeader('Content-Type', 'text/plain')
    res.end('NEXT_PUBLIC_BACKEND_SITEMAP belum diset di .env.local')
    return { props: {} }
  }

  try {
    // Ambil index sitemap utama dari backend
    const indexResponse = await fetch(backendIndex)
    const indexXml = await indexResponse.text()

    // Ambil daftar semua child sitemap
    const sitemapUrls = [...indexXml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1])

    // Jika user membuka sitemap.xml tanpa parameter, tampilkan daftar grup
    if (!query.group) {
      const sitemapList = sitemapUrls
        .map(
          (url) => `
    <sitemap>
      <loc>${frontendUrl}/sitemap.xml?group=${url
        .replace(backendDomain, '')
        .replace('.xml', '')
        .split('/')
        .pop()}</loc>
    </sitemap>`
        )
        .join('\n')

      const indexOutput = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapList}
</sitemapindex>`

      res.setHeader('Content-Type', 'application/xml; charset=UTF-8')
      res.write(indexOutput)
      res.end()
      return { props: {} }
    }

    // Jika user membuka salah satu grup sitemap
    const selectedGroup = query.group
    const targetSitemap = sitemapUrls.find((url) =>
      url.includes(selectedGroup)
    )

    if (!targetSitemap) {
      res.statusCode = 404
      res.setHeader('Content-Type', 'text/plain')
      res.end('Sitemap tidak ditemukan.')
      return { props: {} }
    }

    // Ambil isi sitemap yang dipilih
    const groupResponse = await fetch(targetSitemap)
    const groupXml = await groupResponse.text()

    // Ambil semua <url> lalu ganti domain backend → frontend (kecuali image)
    const allUrls = [...groupXml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => {
      let block = m[1]
      block = block.replace(
        /<loc>(https:\/\/backend\.destinasian\.co\.id.*?)<\/loc>/gi,
        (match, loc) =>
          `<loc>${loc.replace(backendDomain, frontendUrl)}</loc>`
      )
      return block
    })

    // Satukan hasilnya
    const mergedXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${allUrls.map((url) => `<url>${url}</url>`).join('\n')}
</urlset>`

    res.setHeader('Content-Type', 'application/xml; charset=UTF-8')
    res.write(mergedXml)
    res.end()
  } catch {
    res.statusCode = 500
    res.setHeader('Content-Type', 'text/plain')
    res.end('Terjadi kesalahan saat membuat sitemap.')
  }

  return { props: {} }
}