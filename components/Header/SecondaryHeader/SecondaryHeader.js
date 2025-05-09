import classNames from 'classnames/bind'
import styles from './SecondaryHeader.module.scss'
import { TravelGuidesMenu } from '../../../components'
import Link from 'next/link'

let cx = classNames.bind(styles)

export default function SecondaryHeader({

  setSearchQuery,
  isGuidesNavShown,
  setIsGuidesNavShown,
  isRCANavShown,
  setIsRCANavShown,
  isScrolled,
}) {
  return (
    <>
      <div className={cx('navigation-wrapper', { sticky: isScrolled })}>
        <div className={cx('menu-wrapper')}>
          <button
            type="button"
            className={cx('menu-button', isGuidesNavShown ? 'active' : '')}
            onClick={() => {
              setIsGuidesNavShown(!isGuidesNavShown)
              isRCANavShown ? setIsRCANavShown(!isRCANavShown) : null
              setSearchQuery('')
            }}
            aria-label="Toggle navigation"
            aria-controls={cx('rca-menu-wrapper')}
            aria-expanded={!isRCANavShown}
          >
            <div className={cx('menu-title')}>{`Guides`}</div>
          </button>
          {/* News */}
          <Link href="/news">
            <div className={cx('menu-button--link')}>
              <div className={cx('menu-title')}>NEWS</div>
            </div>
          </Link>

          {/* Insights */}
          <Link href="/insights">
            <div className={cx( 'menu-button--link')}>
              <div className={cx('menu-title')}>INSIGHTS</div>
            </div>
          </Link>

          {/* Features */}
          <Link href="/features">
            <div className={cx('menu-button--link')}>
              <div className={cx('menu-title')}>FEATURES</div>
            </div>
          </Link>
        </div>
      </div>

      <div
        className={cx(
          'full-menu-content',
          isGuidesNavShown ? 'show' : undefined,
        )}
      >
        <div className={cx('full-menu-wrapper')}>
          <TravelGuidesMenu />
        </div>
      </div>
    </>
  )
}
