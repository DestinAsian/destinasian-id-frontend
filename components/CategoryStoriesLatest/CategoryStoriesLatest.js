import classNames from 'classnames/bind'
import styles from './CategoryStoriesLatest.module.scss'
import { useQuery } from '@apollo/client'
import { GetCategoryStories } from '../../queries/GetCategoryStories'
import * as CONTENT_TYPES from '../../constants/contentTypes'
import dynamic from 'next/dynamic'

const GuideLatestStories = dynamic(() =>
  import('../../components/GuideLatestStories/GuideLatestStories')
)

const cx = classNames.bind(styles)

export default function CategoryStoriesLatest(categoryUri) {
  const uri = categoryUri?.categoryUri
  const name = categoryUri?.name
  const parent = categoryUri?.parent

  const travelGuideRoots = ['bali', 'jakarta', 'bandung', 'surabaya']
  const activeCategoryName = name?.toLowerCase() || ''
  const parentCategoryName = parent?.node?.name?.toLowerCase() || ''

  const isTravelGuideCategory =
    travelGuideRoots.includes(activeCategoryName) ||
    travelGuideRoots.includes(parentCategoryName)

  const contentTypes = isTravelGuideCategory
    ? [CONTENT_TYPES.TRAVEL_GUIDES]
    : [CONTENT_TYPES.POST]

  const { data, error, loading } = useQuery(GetCategoryStories, {
    variables: {
      first: 1,
      after: null,
      id: uri,
      contentTypes,
    },
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network',
  })

  if (error) return <pre>{JSON.stringify(error)}</pre>
  if (loading) return <div className="text-center">Loading...</div>

  const allPosts = data?.category?.contentNodes?.edges?.map((post) => post.node)
  const travelGuide = allPosts?.find(item => item.__typename === 'TravelGuide')

  if (!travelGuide) return null

  return (
    <div className={cx('component')}>
      <div className={cx('post-wrapper')}>
        <GuideLatestStories
          title={travelGuide.title}
          excerpt={travelGuide.excerpt}
          content={travelGuide.content}
          date={travelGuide.date}
          author={travelGuide.author?.node?.name}
          uri={travelGuide.uri}
          parentCategory={travelGuide.categories?.edges[0]?.node?.parent?.node?.name}
          category={travelGuide.categories?.edges[0]?.node?.name}
          categoryUri={travelGuide.categories?.edges[0]?.node?.uri}
          featuredImage={travelGuide.featuredImage?.node}
          caption={travelGuide.featuredImage?.node?.caption}
        />
      </div>
    </div>
  )
}
