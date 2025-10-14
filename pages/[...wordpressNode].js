import { getWordPressProps, WordPressTemplate } from '@faustwp/core'
import SEO from '../components/SEO/SEO'
export default function Page(props) {
  const {
    category,
    contest,
    editorial,
    luxuryTravel,
    page,
    post,
    tag,
    update,
  } = props?.__TEMPLATE_QUERY_DATA__ ?? {}

  const source =
    category ||
    contest ||
    editorial ||
    luxuryTravel ||
    page ||
    post ||
    tag ||
    update ||
    {}

  const { categoryImages, featuredImage, seo, uri } = source ?? {}

  // Determine imageUrl: use categoryImages for tag or category, else use featuredImage
  const isTagOrCategory = !!(tag || category)

  const imageUrl = isTagOrCategory
    ? categoryImages?.categorySlide1?.mediaItemUrl?.length
      ? categoryImages.categorySlide1.mediaItemUrl
      : categoryImages?.categoryImages?.mediaItemUrl
    : featuredImage?.node?.sourceUrl ?? ''

  return (
    <>
      <SEO
        title={seo?.title}
        description={seo?.metaDesc}
        imageUrl={imageUrl}
        url={uri}
        focuskw={seo?.focuskw}
      />
      <WordPressTemplate
        {...props}
      />
    </>
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
