import classNames from 'classnames/bind'
import styles from './RCASecondaryHeader.module.scss'
import { TravelGuidesMenu } from '../../../components'

let cx = classNames.bind(styles)

export default function RCASecondaryHeader({
  isNavShown,
  setIsNavShown,
  isGuidesNavShown,
  setIsGuidesNavShown,
  searchQuery,
  setSearchQuery,
  isAutoplayRunning,
  toggleAutoplay,
}) {
  return (
    <>
      <div className={cx('navigation-wrapper')}>
        <div className={cx('menu-wrapper')}>
          <button
            type="button"
            className={cx('menu-button', searchQuery ? 'active' : '')}
            onClick={() => {
              searchQuery ? setSearchQuery('') : setSearchQuery('travel')
              isGuidesNavShown ? setIsGuidesNavShown(!isGuidesNavShown) : null
              isNavShown ? setIsNavShown(!isNavShown) : null
              if (searchQuery === '' && isAutoplayRunning) {
                return toggleAutoplay()
              }
              if (searchQuery === 'travel' && !isAutoplayRunning) {
                return toggleAutoplay()
              }
            }}
            aria-label="Toggle navigation"
            aria-controls={cx('rca-menu-wrapper')}
            aria-expanded={!isNavShown}
          >
            <div className={cx('menu-title')}>{`Travel Stories`}</div>
          </button>
          <button
            type="button"
            className={cx('menu-button', isGuidesNavShown ? 'active' : '')}
            onClick={() => {
              setIsGuidesNavShown(!isGuidesNavShown)
              isNavShown ? setIsNavShown(!isNavShown) : null
              setSearchQuery('')
              if (!isGuidesNavShown && isAutoplayRunning) {
                return toggleAutoplay()
              }
              if (isGuidesNavShown && !isAutoplayRunning) {
                return toggleAutoplay()
              }
            }}
            aria-label="Toggle navigation"
            aria-controls={cx('rca-menu-wrapper')}
            aria-expanded={!isNavShown}
          >
            <div className={cx('menu-title')}>{`Guides`}</div>
          </button>
          <button
            type="button"
            className={cx('menu-button', isNavShown ? 'active' : '')}
            onClick={() => {
              setIsNavShown(!isNavShown)
              isGuidesNavShown ? setIsGuidesNavShown(!isGuidesNavShown) : null
              setSearchQuery('')
              if (!isNavShown && isAutoplayRunning) {
                return toggleAutoplay()
              }
              if (isNavShown && !isAutoplayRunning) {
                return toggleAutoplay()
              }
            }}
            aria-label="Toggle navigation"
            aria-controls={cx('rca-menu-wrapper')}
            aria-expanded={!isNavShown}
          >
            <div className={cx('menu-title')}>{`Readers' Choice Awards`}</div>
          </button>
        </div>
      </div>

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
