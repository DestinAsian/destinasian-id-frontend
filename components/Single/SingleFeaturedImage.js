import classNames from 'classnames/bind'
import FeaturedImage from '../../components/FeaturedImage/FeaturedImage'
import styles from './SingleFeaturedImage.module.scss'

const cx = classNames.bind(styles)

export default function SingleEditorialFeaturedImage({ image, className }) {
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
