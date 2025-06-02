import classNames from 'classnames/bind'
import styles from './LLSecondaryHeader.module.scss'
import dynamic from 'next/dynamic'

const TravelGuidesMenu = dynamic(() => import('../../../components/TravelGuidesMenu/TravelGuidesMenu'))

let cx = classNames.bind(styles)

export default function LLSecondaryHeader({
  searchQuery,
  setSearchQuery,
  isGuidesNavShown,
  setIsGuidesNavShown,
  isAutoplayRunning,
  toggleAutoplay,
}) {
  return (
    <>
      <div className={cx('navigation-wrapper')}>
        <div className={cx('menu-wrapper')}>
          {/* Tombol Travel Stories */}
          <button
            type="button"
            className={cx('menu-button', searchQuery ? 'active' : '')}
            onClick={() => {
              searchQuery ? setSearchQuery('') : setSearchQuery('travel')
              if (isGuidesNavShown) setIsGuidesNavShown(false)

              if (searchQuery === '' && isAutoplayRunning) {
                return toggleAutoplay()
              }
              if (searchQuery === 'travel' && !isAutoplayRunning) {
                return toggleAutoplay()
              }
            }}
            aria-label="Toggle navigation"
          >
            <div className={cx('menu-title')}>{`Travel Stories`}</div>
          </button>

          {/* Tombol Guides */}
          <button
            type="button"
            className={cx('menu-button', isGuidesNavShown ? 'active' : '')}
            onClick={() => {
              setIsGuidesNavShown(!isGuidesNavShown)
              setSearchQuery('')

              if (!isGuidesNavShown && isAutoplayRunning) {
                return toggleAutoplay()
              }
              if (isGuidesNavShown && !isAutoplayRunning) {
                return toggleAutoplay()
              }
            }}
            aria-label="Toggle navigation"
          >
            <div className={cx('menu-title')}>{`Guides`}</div>
          </button>
        </div>
      </div>

      {/* Konten Menu Guides */}
      <div
        className={cx(
          'full-menu-content',
          isGuidesNavShown ? 'show' : undefined,
        )}
      >
        <div className={cx('full-menu-wrapper')}>
          <TravelGuidesMenu className={'dark-color'} />
        </div>
      </div>
    </>
  )
}
