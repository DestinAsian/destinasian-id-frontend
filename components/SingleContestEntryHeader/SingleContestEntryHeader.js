import className from 'classnames/bind'
import { Heading, Container } from '../../components'
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
