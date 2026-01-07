import className from 'classnames/bind'
import styles from './EntryHeader.module.scss'

import Heading from '../../components/Heading/Heading'
import PostInfo from '../../components/PostInfo/PostInfo'
import Container from '../../components/Container/Container'
import FeaturedImage from '../../components/FeaturedImage/FeaturedImage'


let cx = className.bind(styles)

export default function EntryHeader({
  parent,
  title,

  image,
  date,
  author,
  className,
  contestTitle,
}) {
  const hasText = parent || title || date || author

  return (
    <div className={cx(['component', className])}>
      {image && (
        <FeaturedImage image={image} className={cx('image')} priority />
      )}

      {hasText && (
        <div className={cx('text', { 'has-image': image })}>
          <Container>
            {!!title && (
              <Heading className={cx('title')}>
                {parent || null} {title}
              </Heading>
            )}
            <PostInfo className={cx('byline')} author={author} date={date} />
          </Container>
        </div>
      )}

      {contestTitle && (
        <Container>
          <Heading className={cx('contest-title')}>{contestTitle}</Heading>
        </Container>
      )}
    </div>
  )
}
