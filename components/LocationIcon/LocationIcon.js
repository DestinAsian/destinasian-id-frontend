import className from 'classnames/bind'
import styles from './LocationIcon.module.scss'

import locationIcon from '../../assets/icons/icon-location.png'
import Image from 'next/image'
import Link from 'next/link'

let cx = className.bind(styles)

export default function LocationIcon({
  className,
  locationValidation,
  locationLabel,
  locationUrl,
}) {
  return (
    <div className={cx(['component', className])}>
      <div className={cx('icon-wrapper')}>
        {/* Location Icon */}
        {locationValidation == 'acfLocationIcon' && locationUrl && (
          <figure className={cx('icon')}>
            <Link href={locationUrl} className={cx('link')}>
              <Image
                src={locationIcon.src}
                alt="Location Icon"
                fill
                sizes="100%"
                priority
              />
            </Link>
          </figure>
        )}
        {/* Location label */}
        {locationUrl && (
          <Link href={locationUrl} className={cx('link')}>
            <span className={cx('location-label')}>{locationLabel}</span>
          </Link>
        )}
      </div>
    </div>
  )
}
