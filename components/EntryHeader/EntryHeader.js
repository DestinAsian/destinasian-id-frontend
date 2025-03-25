import className from 'classnames/bind'
import { Heading, PostInfo, Container, FeaturedImage } from '../../components'
import styles from './EntryHeader.module.scss'

let cx = className.bind(styles)

export default function EntryHeader({
  parent,
  title,
  hcTitle,
  hcCountryTitle,
  image,
  date,
  author,
  className,
  hcCaption,
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

      {hcTitle && (
        <Container>
          <Heading className={cx('hc-title')}>{hcTitle}</Heading>
          <Heading className={cx('hc-caption')}>{hcCaption}</Heading>
        </Container>
      )}

      {hcCountryTitle && (
        <Container>
          <Heading className={cx('hc-title')}>
            {'Honors Circle : '}
            {hcCountryTitle}
          </Heading>
          <Heading className={cx('hc-caption')}>{hcCaption}</Heading>
        </Container>
      )}

      {contestTitle && (
        <Container>
          <Heading className={cx('contest-title')}>{contestTitle}</Heading>
        </Container>
      )}
    </div>
  )
}
