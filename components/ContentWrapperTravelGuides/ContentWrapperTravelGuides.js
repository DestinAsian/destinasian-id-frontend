import className from 'classnames/bind'
import styles from './ContentWrapperTravelGuides.module.scss'
import { TravelGuidesMenu } from '../../components'

let cx = className.bind(styles)

export default function ContentWrapperTravelGuides({ content }) {
  return (
    <article className={cx('component')}>
      <div
        className={cx('content-wrapper')}
        dangerouslySetInnerHTML={{ __html: content ?? '' }}
      />
      <div className={cx('guides-list-wrapper')}>
        {/* {renderMenu(hierarchicalMenuItems)} */}
        <TravelGuidesMenu />
      </div>
    </article>
  )
}
