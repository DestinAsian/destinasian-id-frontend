import { getWordPressProps, WordPressTemplate } from '@faustwp/core'

export default function Page(props) {
  return <WordPressTemplate {...props} />
}

export function getStaticProps(ctx) {
  return getWordPressProps({ ctx, revalidate: 1 })
}

// import { getWordPressProps, WordPressTemplate } from '@faustwp/core'
// import SEO from '../components/SEO/SEO'

// export default function Page(props) {
//   const page = props?.__TEMPLATE_QUERY_DATA__?.page

//   const source = page || {} 
//   const { featuredImage, seo, uri } = source ?? []

//   return (
//     <>
//       <SEO
//         title={seo?.title}
//         description={seo?.metaDesc}
//         imageUrl={featuredImage?.node?.sourceUrl}
//         url={uri}
//         focuskw={seo?.focuskw}
//       />
//       <WordPressTemplate {...props} />
//     </>
//   )
// }

// export function getStaticProps(ctx) {
//   return getWordPressProps({ ctx, revalidate: 1 })
// }
