import className from 'classnames/bind'
import { FeaturedImage } from '../../components'
import styles from './SingleHCFeaturedImage.module.scss'

let cx = className.bind(styles)

export default function SingleHCFeaturedImage({
  image,
}) {
  return (
    <div className={cx(['component', className])}>
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
