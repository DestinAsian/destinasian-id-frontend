// pages/sitemap/[file].js
export async function getServerSideProps({ params, res }) {
    const { file } = params;
  
    try {
      const backendUrl = `https://backend.destinasian.co.id/${file}`;
      const response = await fetch(backendUrl);
      if (!response.ok) throw new Error('Failed to fetch backend sitemap');
      const text = await response.text();
  
      res.setHeader('Content-Type', 'text/xml');
      res.write(text);
      res.end();
    } catch (error) {
      console.error('Error fetching sitemap file:', error);
      res.statusCode = 500;
      res.end('Error fetching sitemap file');
    }
  
    return { props: {} };
  }
  
  export default function SitemapFile() {
    return null;
  }
  