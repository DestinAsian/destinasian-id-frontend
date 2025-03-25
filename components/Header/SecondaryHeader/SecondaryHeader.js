import classNames from 'classnames/bind'
import styles from './SecondaryHeader.module.scss'
import { RCAFullMenu, TravelGuidesMenu } from '../../../components'

let cx = classNames.bind(styles)

export default function SecondaryHeader({
  searchQuery,
  setSearchQuery,
  rcaDatabaseId,
  rcaUri,
  isGuidesNavShown,
  setIsGuidesNavShown,
  isRCANavShown,
  setIsRCANavShown,
  isScrolled,
}) {
  return (
    <>
      <div
        className={cx(
          'navigation-wrapper',
          { sticky: isScrolled },
        )}
      >
        <div className={cx('menu-wrapper')}>
          <button
            type="button"
            className={cx(
              'menu-button',
              searchQuery ? 'active' : '',
            )}
            onClick={() => {
              searchQuery ? setSearchQuery('') : setSearchQuery('travel')
              isGuidesNavShown ? setIsGuidesNavShown(!isGuidesNavShown) : null
              isRCANavShown ? setIsRCANavShown(!isRCANavShown) : null
            }}
            aria-label="Toggle navigation"
            aria-controls={cx('rca-menu-wrapper')}
            aria-expanded={!isRCANavShown}
          >
            <div className={cx('menu-title')}>{`Travel Stories`}</div>
          </button>
          <button
            type="button"
            className={cx(
              'menu-button',
              isGuidesNavShown ? 'active' : '',
            )}
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
          <button
            type="button"
            className={cx(
              'menu-button',
              isRCANavShown ? 'active' : '',
            )}
            onClick={() => {
              setIsRCANavShown(!isRCANavShown)
              isGuidesNavShown ? setIsGuidesNavShown(!isGuidesNavShown) : null
              setSearchQuery('')
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
          <TravelGuidesMenu />
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
