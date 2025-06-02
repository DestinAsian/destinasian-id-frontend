import className from 'classnames/bind'
import dynamic from 'next/dynamic'

const Heading = dynamic(() => import('../../components/Heading/Heading'))
const Container = dynamic(() => import('../../components/Container/Container'))
import styles from './SingleContestEntryHeader.module.scss'

let cx = className.bind(styles)

export default function SingleContestEntryHeader({ title, className }) {
  return (
    <div className={cx(['component', className])}>
      <Container>
        <div className={cx('header-wrapper')}>
          <Heading className={cx('title')}>
            {title}
          </Heading>
        </div>
      </Container>
    </div>
  )
}
