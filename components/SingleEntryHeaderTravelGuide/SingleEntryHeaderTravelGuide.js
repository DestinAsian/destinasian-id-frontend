import className from 'classnames/bind'
import dynamic from 'next/dynamic'

const Heading = dynamic(() => import('../../components/Heading/Heading'))
const Container = dynamic(() => import('../../components/Container/Container'))
const CategoryIcon = dynamic(() => import('../../components/CategoryIcon/CategoryIcon'))
import styles from './SingleEntryHeaderTravelGuide.module.scss'
import Link from 'next/link'

let cx = className.bind(styles)

export default function SingleEntryHeaderTravelGuide({
  parent,
  title,
  className,
  parentCategory,
  categoryUri,
  categoryName,
  categoryLabel,

}) {
  return (
    <div className={cx(['component', className])}>
      <Container>
        <div className={cx('header-wrapper')}>
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
            {/* {parent || null} */}
            {title}
          </Heading>
        </div>
      </Container>
    </div>
  )
}
