import Image from 'next/image'
import classNames from 'classnames/bind'
import styles from './BannerFokusDA.module.scss'

const cx = classNames.bind(styles)

const BannerFokusDA = ({ bannerDa }) => {
  if (!bannerDa) return null

  const {
    linkBannerFokusHubDa,
    bannerFokusHubDa,
  } = bannerDa

  if (!bannerFokusHubDa?.mediaItemUrl || !linkBannerFokusHubDa) {
    return null
  }

  return (
    <div className={cx('bannerDaWrap')}>
      <div className={cx('contentGrid')}>
        <a
          href={linkBannerFokusHubDa}
          className={cx('rightBanner')}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src={bannerFokusHubDa.mediaItemUrl}
            alt={bannerFokusHubDa.altText || 'Banner Fokus'}
            width={800}
            height={600}
            className={cx('bannerImage')}
            priority
          />
        </a>
      </div>
    </div>
  )
}

export default BannerFokusDA
