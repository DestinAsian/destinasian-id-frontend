import classNames from 'classnames/bind'
import Link from 'next/link'

import Heading from '../../components/Heading/Heading'
import Container from '../../components/Container/Container'
import styles from './SingleGuideEntryHeader.module.scss'

const cx = classNames.bind(styles)

export default function SingleGuideEntryHeader({
  parent,
  title,
  className,
  parentCategory,
  categoryUri,
  categoryName,
}) {
  return (
    <div className={cx('component', className)}>
      <Container>
        <div className={cx('header-wrapper')}>
          {/* Render category link if not "Rest of World" */}
          {parentCategory !== 'Rest of World' &&
            categoryName !== 'Rest of World' &&
            categoryUri && (
              <Link href={categoryUri}>
                <div className={cx('category-name')}>
                  {parentCategory} {categoryName}
                </div>
              </Link>
            )}
          <Heading className={cx('title')}>
            {title}
          </Heading>
        </div>
      </Container>
    </div>
  )
}
