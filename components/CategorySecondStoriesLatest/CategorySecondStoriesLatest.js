import classNames from 'classnames/bind'
import styles from './CategorySecondStoriesLatest.module.scss'
import { useQuery } from '@apollo/client'
import { GetCategoryStories } from '../../queries/GetCategoryStories'
import * as CONTENT_TYPES from '../../constants/contentTypes'

import GuideSecondLatestStories from '../../components/GuideSecondLatestStories/GuideSecondLatestStories'
import GuideTextBlock from '../../components/GuideSecondLatestStories/GuideTextBlock'

const cx = classNames.bind(styles)

const BannerFokusDA = ({ bannerDa }) => {
  if (!bannerDa) return null
  const { linkBannerFokusHubDa, bannerFokusHubDa } = bannerDa

  return (
    <div className={cx('contentGrid')}>
      {bannerFokusHubDa?.mediaItemUrl && linkBannerFokusHubDa && (
        <a
          href={linkBannerFokusHubDa}
          className={cx('rightBanner')}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={bannerFokusHubDa.mediaItemUrl}
            alt="Banner Fokus"
            className={cx('bannerImage')}
          />
        </a>
      )}
    </div>
  )
}

export default function CategorySecondStoriesLatest({
  categoryUri,
  name,
  parent,
  bannerDa,
  pinPosts, // 🔹 terima pinPosts agar bisa cek secondPinPost
}) {
  const uri = categoryUri || ''
  const travelGuideRoots = ['bali', 'jakarta', 'bandung', 'surabaya']
  const activeCategoryName = name?.toLowerCase() || ''
  const parentCategoryName = parent?.node?.name?.toLowerCase() || ''

  const isTravelGuideCategory =
    travelGuideRoots.includes(activeCategoryName) ||
    travelGuideRoots.includes(parentCategoryName)

  const contentTypes = isTravelGuideCategory
    ? [CONTENT_TYPES.TRAVEL_GUIDES]
    : [CONTENT_TYPES.POST]

  const shouldSkip = !uri

  const { data, error, loading } = useQuery(GetCategoryStories, {
    variables: {
      first: 3,
      after: null,
      id: uri,
      contentTypes,
    },
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-and-network',
    skip: shouldSkip,
  })

  if (shouldSkip || loading) return null
  if (error) return <pre>{JSON.stringify(error, null, 2)}</pre>

  // 🔹 Jika ada secondPinPost dari ACF, gunakan itu.
  // Jika tidak, fallback ke logika lama (ambil travel guide ke-2 dari hasil query)
  const secondPinPost = pinPosts?.secondPinPost
  const allPosts = data?.category?.contentNodes?.edges?.map((post) => post.node)
  const travelGuides = allPosts?.filter(
    (item) => item.__typename === 'TravelGuide',
  )
  const travelGuide = secondPinPost || travelGuides?.[1] // 🔹 prioritas secondPinPost

  if (!travelGuide) return null

  const guideInfo = travelGuide.guide_book_now

  return (
    <div className={cx('component')}>
      <div className={cx('gridWrapper')}>
        <div className={cx('leftColumn')}>
          <GuideSecondLatestStories
            content={travelGuide.content}
            date={travelGuide.date}
            author={travelGuide.author?.node?.name}
            uri={travelGuide.uri}
            parentCategory={
              travelGuide.categories?.edges?.[0]?.node?.parent?.node?.name
            }
            category={travelGuide.categories?.edges?.[0]?.node?.name}
            categoryUri={travelGuide.categories?.edges?.[0]?.node?.uri}
            featuredImage={travelGuide.featuredImage?.node}
            caption={travelGuide.featuredImage?.node?.caption}
          />

          {guideInfo && (
            <div className={cx('guide-info')}>
              {guideInfo.guideName && (
                <span className={cx('guide-name')}>{guideInfo.guideName}</span>
              )}
              {guideInfo.linkLocation && guideInfo.guideLocation && (
                <>
                  {guideInfo.guideName && (
                    <span className={cx('separator')}>|</span>
                  )}
                  <a
                    href={guideInfo.linkLocation}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cx('guide-location')}
                  >
                    {guideInfo.guideLocation}
                  </a>
                </>
              )}
              {guideInfo.guidePrice && (
                <>
                  {(guideInfo.guideName || guideInfo.guideLocation) && (
                    <span className={cx('separator')}>|</span>
                  )}
                  <span className={cx('guide-price')}>
                    {guideInfo.guidePrice}
                  </span>
                </>
              )}
              {guideInfo.linkBookNow && (
                <>
                  {(guideInfo.guideName ||
                    guideInfo.guideLocation ||
                    guideInfo.guidePrice) && (
                    <span className={cx('separator')}>|</span>
                  )}
                  <a
                    href={guideInfo.linkBookNow}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cx('book-now-button')}
                  >
                    Book Now
                  </a>
                </>
              )}
            </div>
          )}

          <GuideTextBlock
            title={travelGuide.title}
            excerpt={travelGuide.excerpt}
            uri={travelGuide.uri}
          />
        </div>

        <div className={cx('rightColumn')}>
          <BannerFokusDA bannerDa={bannerDa} />
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '1rem auto' }}>
        <hr style={{ border: 'none', borderTop: '1px solid black' }} />
      </div>
    </div>
  )
}