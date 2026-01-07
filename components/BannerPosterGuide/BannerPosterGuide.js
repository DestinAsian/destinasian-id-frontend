import Image from 'next/image'
import classNames from 'classnames/bind'
import styles from './BannerPosterGuide.module.scss'

const cx = classNames.bind(styles)

const BannerPosterGuide = ({ guideStorie }) => {
  if (!guideStorie) return null

  const {
    bannerLandscape,
    linkBannerLandscape,
    bannerGuideStories,
    linkBannerGuideStories,
  } = guideStorie

  const hasLandscape =
    bannerLandscape?.mediaItemUrl && linkBannerLandscape

  const hasGuideStories =
    bannerGuideStories?.mediaItemUrl && linkBannerGuideStories

  if (!hasLandscape && !hasGuideStories) return null

  return (
    <div className={cx('wrapper')}>
      <div className={cx('contentGrid')}>
        {/* Left Banner: Landscape */}
        {hasLandscape && (
          <div className={cx('leftContent')}>
            <a
              href={linkBannerLandscape}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src={bannerLandscape.mediaItemUrl}
                alt={bannerLandscape.altText || 'Banner Landscape'}
                width={800}
                height={600}
                priority
              />
            </a>
          </div>
        )}

        {/* Right Banner: Guide Stories */}
        {hasGuideStories && (
          <div className={cx('rightBanner')}>
            <a
              href={linkBannerGuideStories}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src={bannerGuideStories.mediaItemUrl}
                alt={bannerGuideStories.altText || 'Banner Guide Stories'}
                width={800}
                height={600}
                className={cx('bannerImage')}
              />
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

export default BannerPosterGuide
