import className from 'classnames/bind'
import { Heading } from '../../components'
import styles from './SingleLLEntryHeader.module.scss'

let cx = className.bind(styles)

export default function SingleLLEntryHeader({ title, category }) {
  return (
    <div className={cx('component', className)}>
      <div className={cx('header-wrapper')}>
        <Heading className={cx('category')}>{category}</Heading>
        <Heading className={cx('title')}>{title}</Heading>
      </div>
    </div>
  )
}
