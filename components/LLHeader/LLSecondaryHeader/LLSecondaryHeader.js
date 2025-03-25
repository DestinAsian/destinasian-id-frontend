import classNames from 'classnames/bind'
import styles from './LLSecondaryHeader.module.scss'
import { RCAFullMenu, TravelGuidesMenu } from '../../../components'

let cx = classNames.bind(styles)

export default function LLSecondaryHeader({
  searchQuery,
  setSearchQuery,
  rcaDatabaseId,
  rcaUri,
  isGuidesNavShown,
  setIsGuidesNavShown,
  isRCANavShown,
  setIsRCANavShown,
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
              isRCANavShown ? setIsRCANavShown(!isRCANavShown) : null
              if (searchQuery === '' && isAutoplayRunning) {
                return toggleAutoplay()
              }
              if (searchQuery === 'travel' && !isAutoplayRunning) {
                return toggleAutoplay()
              }
            }}
            aria-label="Toggle navigation"
            aria-controls={cx('rca-menu-wrapper')}
            aria-expanded={!isRCANavShown}
          >
            <div className={cx('menu-title')}>{`Travel Stories`}</div>
          </button>
          <button
            type="button"
            className={cx('menu-button', isGuidesNavShown ? 'active' : '')}
            onClick={() => {
              setIsGuidesNavShown(!isGuidesNavShown)
              isRCANavShown ? setIsRCANavShown(!isRCANavShown) : null
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
            aria-expanded={!isRCANavShown}
          >
            <div className={cx('menu-title')}>{`Guides`}</div>
          </button>
          <button
            type="button"
            className={cx('menu-button', isRCANavShown ? 'active' : '')}
            onClick={() => {
              setIsRCANavShown(!isRCANavShown)
              isGuidesNavShown ? setIsGuidesNavShown(!isGuidesNavShown) : null
              setSearchQuery('')
              if (!isRCANavShown && isAutoplayRunning) {
                return toggleAutoplay()
              }
              if (isRCANavShown && !isAutoplayRunning) {
                return toggleAutoplay()
              }
            }}
            aria-label="Toggle navigation"
            aria-controls={cx('rca-menu-wrapper')}
            aria-expanded={!isRCANavShown}
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
      <div
        className={cx('rca-menu-wrapper', isRCANavShown ? 'show' : undefined)}
      >
        <RCAFullMenu
          rcaDatabaseId={rcaDatabaseId}
          uri={rcaUri}
          isNavShown={isRCANavShown}
          setIsNavShown={setIsRCANavShown}
          className={'light-color'}
        />
      </div>
    </>
  )
}
