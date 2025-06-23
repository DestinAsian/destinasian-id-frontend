
import { getWordPressProps, WordPressTemplate } from '@faustwp/core'

export default function Page(props) {
  // const guidesPost =
  // props?.__TEMPLATE_QUERY_DATA__?.post?.guides?.guidesPost === true
  // const defaultPost =
  // props?.__TEMPLATE_QUERY_DATA__?.post?.guides?.guidesPost !== true

  console.log(props.__TEMPLATE_QUERY_DATA__)
  
  return (
    <WordPressTemplate
    {...props}
    // guidesPost={guidesPost}
    // defaultPost={defaultPost}
    />
  )
}

export function getStaticProps(ctx) {
  return getWordPressProps({ ctx, revalidate: 1 })
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  }
}
// import { getWordPressProps, WordPressTemplate } from '@faustwp/core'

// export default function Page(props) {
//   return <WordPressTemplate {...props} />
// }

// export function getStaticProps(ctx) {
//   return getWordPressProps({ ctx, revalidate: 1 })
// }

// export async function getStaticPaths() {
//   return {
//     paths: [],
//     fallback: 'blocking',
//   }
// }

