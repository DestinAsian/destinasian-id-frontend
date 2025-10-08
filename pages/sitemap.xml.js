// // In pages/sitemap.xml.js:
// import { getSitemapProps } from '@faustwp/core'

// export default function Sitemap() {}

// export function getServerSideProps(ctx) {
//   return getSitemapProps(ctx, {
//     frontendUrl: process.env.FRONTEND_URL,
//   })
// }

import fetch from 'node-fetch';

export async function getServerSideProps({ res }) {
  const frontendUrl =
    process.env.FRONTEND_URL?.replace(/\/$/, '') || 'https://destinasian.co.id';

  try {
    const response = await fetch(`${frontendUrl}/sitemap.xml`);
    if (!response.ok) throw new Error('Failed to fetch sitemap.xml');
    const sitemapText = await response.text();

    const locMatches = [...sitemapText.matchAll(/<loc>(.*?)<\/loc>/g)];
    const sitemapList = locMatches.map((match) => ({
      loc: match[1],
      lastmod: new Date().toISOString(), // Bisa diganti sesuai kebutuhan
    }));

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
</sitemapindex>`;

    res.setHeader('Content-Type', 'text/xml');
    res.write(sitemapIndexXml);
    res.end();
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.statusCode = 500;
    res.end('Error generating sitemap');
  }

  return { props: {} };
}

export default function Sitemap() {
  return null;
}
