import className from 'classnames/bind'
import styles from './SingleRCAContainer.module.scss'

let cx = className.bind(styles)

export default function SingleRCAContainer({ children }) {
  return <div className={styles.component}>{children}</div>
}
