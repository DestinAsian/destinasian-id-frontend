import classNames from 'classnames/bind'
import { FeaturedImage } from '..'
import styles from './SingleGuideFeaturedImage.module.scss'

const cx = classNames.bind(styles)

export default function SingleGuideFeaturedImage({ image, className }) {
  return (
    <div className={cx('component', className)}>
      <div className={cx('image-wrapper')}>
        {image && (
          <FeaturedImage
            image={image}
            className={cx('image')}
            priority
          />
        )}
      </div>
    </div>
  )
}
