import classNames from 'classnames/bind'
import styles from './EntryRelatedStories.module.scss'

let cx = classNames.bind(styles)

export default function EntryRelatedStories({
}) {

  return (
    <article className={cx('component')}>
      <div className={cx('entry-wrapper')}>
        <div className={cx('entry-title')}>{'Related Stories'}</div>
        <div className={cx('entry-border')}></div>
      </div>
    </article>
  )
}
