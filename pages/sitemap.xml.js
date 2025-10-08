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
  try {
    const backendSitemaps = [
      'author-sitemap.xml',
      'category-sitemap.xml',
      'contest-sitemap.xml',
      'luxury-travel-sitemap.xml',
      'page-sitemap.xml',
      'post-sitemap.xml',
      'post-sitemap2.xml',
      'post-sitemap3.xml',
      'post-sitemap4.xml',
      'post-sitemap5.xml',
      'post-sitemap6.xml',
      'post-sitemap7.xml',
      'travel-guide-sitemap.xml',
    ];

    const sitemapIndexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${backendSitemaps
      .map(
        (fileName) => `
  <sitemap>
    <loc>https://destinasian.co.id/sitemap/${fileName}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`
      )
      .join('')}
</sitemapindex>`;

    res.setHeader('Content-Type', 'text/xml');
    res.write(sitemapIndexXml);
    res.end();
  } catch (error) {
    console.error('Error generating sitemap index:', error);
    res.statusCode = 500;
    res.end('Error generating sitemap index');
  }

  return { props: {} };
}

export default function Sitemap() {
  return null;
}
