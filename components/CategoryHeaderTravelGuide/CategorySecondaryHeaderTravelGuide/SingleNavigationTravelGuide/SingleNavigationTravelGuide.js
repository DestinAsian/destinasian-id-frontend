import classNames from 'classnames/bind'
import styles from './SingleNavigationTravelGuide.module.scss'
import dynamic from 'next/dynamic'
import { useQuery } from '@apollo/client'
import { GetSingleNavigationTravelGuide } from '../../../../queries/GetSingleNavigationTravelGuide'
import Link from 'next/link'

const DaGuideMenu = dynamic(() => import('../../../../components/DaGuideMenu/DaGuideMenu'))
const MainCategoryMenu = dynamic(() => import('../../../../components/TravelGuidesMenu/MainCategoryMenu/MainCategoryMenu'))
const TravelGuidesMenu = dynamic(() => import('../../../../components/TravelGuidesMenu/TravelGuidesMenu'))

let cx = classNames.bind(styles)

export default function SingleNavigation({
  databaseId,
  isMainNavShown,
  setIsMainNavShown,
  isNavShown,
  setIsNavShown,
  isScrolled,
  isActiveCategory,
  categoryName,
}) {
  const { data } = useQuery(GetSingleNavigationTravelGuide, {
    variables: { first: 4, id: databaseId },
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-and-network',
  })

  const parentNode = data?.travelGuide?.categories?.edges?.[0]?.node?.parent?.node
  const children = parentNode?.children?.edges || []

  return (
    <div className={cx('component', (isMainNavShown || isNavShown) && 'show')}>
    <div className={cx('navbar-wrapper', (isMainNavShown || isNavShown) && 'show')}>
      {!isScrolled && parentNode && (
        <div className={cx('text-menu-wrapper', isNavShown && 'show')}>
          <div className={cx('menu-button-single')}>
            <Link href={parentNode.uri}>
              <button type="button" className={cx('menu-icon')}>
                <div className={cx('da-guide-wrapper')}>
                  <span className={cx('nav-name')}>{parentNode.name}</span>
                </div>
              </button>
            </Link>
          </div>
        </div>
      )}

      {isScrolled && parentNode && (
        <div className={cx('sticky-text-menu-wrapper', isNavShown && 'show')}>
          <div className={cx('menu-button-single')}>
            <Link href={parentNode.uri}>
              <button type="button" className={cx('menu-icon')}>
                <div className={cx('da-guide-wrapper')}>
                  <span className={cx('nav-name')}>{parentNode.name}</span>
                </div>
              </button>
            </Link>
          </div>
        </div>
      )}

      <div className={cx('navigation-wrapper', (isMainNavShown || isNavShown) && 'show')}>
        <ul className={cx('navigation')}>
          {children.map(({ node }) => (
            <li key={node?.uri} className={cx('nav-link')}>
              {node?.uri && (
                <Link
                  href={node.uri}
                  className={cx(isActiveCategory(node.uri) ? 'active' : 'not-active')}
                >
                  <h2 className={cx('nav-name')}>{node.name}</h2>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>

        {/* isMainNavShown button */}
        {!isMainNavShown ? null : (
          <div className={cx('image-menu-wrapper')}>
            <div className={cx('close-button')}>
              {/* close button */}
              <button
                type="button"
                className={cx('close-icon')}
                onClick={() => {
                  setIsMainNavShown(!isMainNavShown)
                  isNavShown ? setIsNavShown(!isNavShown) : undefined
                }}
                aria-label="Toggle navigation"
                aria-controls={cx('primary-navigation')}
                aria-expanded={!isMainNavShown}
              >
                <svg
                  version="1.0"
                  xmlns="http://www.w3.org/2000/svg"
                  width="512.000000pt"
                  height="512.000000pt"
                  viewBox="0 0 512.000000 512.000000"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <g
                    transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                    fill="#000000"
                    stroke="none"
                  >
                    <path
                      d="M2330 5109 c-305 -29 -646 -126 -910 -259 -273 -138 -559 -356 -755
-576 -384 -432 -602 -931 -655 -1499 -41 -446 55 -949 260 -1355 138 -273 356
-559 576 -755 432 -384 931 -602 1499 -655 446 -41 949 55 1355 260 273 138
559 356 755 576 384 432 602 931 655 1499 41 446 -55 949 -260 1355 -138 273
-356 559 -576 755 -432 384 -931 602 -1499 655 -125 11 -320 11 -445 -1z
m-193 -1701 l423 -423 425 425 425 425 212 -213 213 -212 -425 -425 -425 -425
425 -425 425 -425 -213 -212 -212 -213 -425 425 -425 425 -425 -425 -425 -425
-212 213 -213 212 425 425 425 425 -425 425 -425 425 210 210 c115 115 212
210 215 210 3 0 195 -190 427 -422z"
                    />
                  </g>
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* isNavShown button */}
        {!isNavShown ? (
          <>
            {!isScrolled && (
              <div
                className={cx(
                  'image-menu-wrapper',
                  isMainNavShown ? 'hide' : undefined,
                )}
              >
                {/* Menu Button */}
                {isNavShown == false ? (
                  <div className={cx('menu-button')}>
                    {/* menu button */}
                    <button
                      type="button"
                      className={cx('menu-icon')}
                      onClick={() => {
                        setIsNavShown(!isNavShown)
                        isMainNavShown
                          ? setIsMainNavShown(!isMainNavShown)
                          : undefined
                      }}
                      aria-label="Toggle navigation"
                      aria-controls={cx('full-menu-wrapper')}
                      aria-expanded={!isNavShown}
                    >
                      <svg
                        width="22"
                        height="96"
                        viewBox="0 0 22 96"
                        fill="#000000"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx="10.7009"
                          cy="10.7009"
                          r="10.7009"
                          transform="matrix(-1 0 0 1 21.4019 0)"
                          fill="#000000"
                        />
                        <circle
                          cx="10.7009"
                          cy="10.7009"
                          r="10.7009"
                          transform="matrix(-1 0 0 1 21.4019 0)"
                          fill="#000000"
                        />
                        <circle
                          cx="10.7009"
                          cy="10.7009"
                          r="10.7009"
                          transform="matrix(-1 0 0 1 21.4019 0)"
                          fill="#000000"
                        />
                        <circle
                          cx="10.7009"
                          cy="10.7009"
                          r="10.7009"
                          transform="matrix(-1 0 0 1 21.4019 0)"
                          fill="#000000"
                        />
                        <circle
                          cx="10.7009"
                          cy="10.7009"
                          r="10.7009"
                          transform="matrix(-1 0 0 1 21.4019 0)"
                          fill="#000000"
                        />
                        <circle
                          cx="10.7009"
                          cy="10.7009"
                          r="10.7009"
                          transform="matrix(-1 0 0 1 21.4019 74.4785)"
                          fill="#000000"
                        />
                        <circle
                          cx="10.7009"
                          cy="10.7009"
                          r="10.7009"
                          transform="matrix(-1 0 0 1 21.4019 74.4785)"
                          fill="#000000"
                        />
                        <circle
                          cx="10.7009"
                          cy="10.7009"
                          r="10.7009"
                          transform="matrix(-1 0 0 1 21.4019 74.4785)"
                          fill="#000000"
                        />
                        <circle
                          cx="10.7009"
                          cy="10.7009"
                          r="10.7009"
                          transform="matrix(-1 0 0 1 21.4019 74.4785)"
                          fill="#000000"
                        />
                        <circle
                          cx="10.7009"
                          cy="10.7009"
                          r="10.7009"
                          transform="matrix(-1 0 0 1 21.4019 74.4785)"
                          fill="#000000"
                        />
                        <circle
                          cx="10.7009"
                          cy="10.7009"
                          r="10.7009"
                          transform="matrix(-1 0 0 1 21.4019 36.8105)"
                          fill="#000000"
                        />
                        <circle
                          cx="10.7009"
                          cy="10.7009"
                          r="10.7009"
                          transform="matrix(-1 0 0 1 21.4019 36.8105)"
                          fill="#000000"
                        />
                        <circle
                          cx="10.7009"
                          cy="10.7009"
                          r="10.7009"
                          transform="matrix(-1 0 0 1 21.4019 36.8105)"
                          fill="#000000"
                        />
                        <circle
                          cx="10.7009"
                          cy="10.7009"
                          r="10.7009"
                          transform="matrix(-1 0 0 1 21.4019 36.8105)"
                          fill="#000000"
                        />
                        <circle
                          cx="10.7009"
                          cy="10.7009"
                          r="10.7009"
                          transform="matrix(-1 0 0 1 21.4019 36.8105)"
                          fill="#000000"
                        />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className={cx('menu-button')}>
                    {/* close button */}
                    <button
                      type="button"
                      className={cx('close-icon')}
                      onClick={() => {
                        setIsNavShown(!isNavShown)
                        isMainNavShown
                          ? setIsMainNavShown(!isMainNavShown)
                          : undefined
                      }}
                      aria-label="Toggle navigation"
                      aria-controls={cx('full-menu-wrapper')}
                      aria-expanded={!isNavShown}
                    >
                      <svg
                        version="1.0"
                        xmlns="http://www.w3.org/2000/svg"
                        width="512.000000pt"
                        height="512.000000pt"
                        viewBox="0 0 512.000000 512.000000"
                        preserveAspectRatio="xMidYMid meet"
                      >
                        <g
                          transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                          fill="#000000"
                          stroke="none"
                        >
                          <path
                            d="M2330 5109 c-305 -29 -646 -126 -910 -259 -273 -138 -559 -356 -755
-576 -384 -432 -602 -931 -655 -1499 -41 -446 55 -949 260 -1355 138 -273 356
-559 576 -755 432 -384 931 -602 1499 -655 446 -41 949 55 1355 260 273 138
559 356 755 576 384 432 602 931 655 1499 41 446 -55 949 -260 1355 -138 273
-356 559 -576 755 -432 384 -931 602 -1499 655 -125 11 -320 11 -445 -1z
m-193 -1701 l423 -423 425 425 425 425 212 -213 213 -212 -425 -425 -425 -425
425 -425 425 -425 -213 -212 -212 -213 -425 425 -425 425 -425 -425 -425 -425
-212 213 -213 212 425 425 425 425 -425 425 -425 425 210 210 c115 115 212
210 215 210 3 0 195 -190 427 -422z"
                          />
                        </g>
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            )}
            {isScrolled && (
              <div
                className={cx(
                  'sticky-image-menu-wrapper',
                  isMainNavShown ? 'hide' : undefined,
                )}
              >
                {/* Menu Button */}
                {isNavShown == false ? (
                  <div className={cx('menu-button')}>
                    {/* menu button */}
                    <button
                      type="button"
                      className={cx('menu-icon')}
                      onClick={() => {
                        setIsNavShown(!isNavShown)
                        isMainNavShown
                          ? setIsMainNavShown(!isMainNavShown)
                          : undefined
                      }}
                      aria-label="Toggle navigation"
                      aria-controls={cx('full-menu-wrapper')}
                      aria-expanded={!isNavShown}
                    >
                      <svg
                        width="22"
                        height="96"
                        viewBox="0 0 22 96"
                        fill="#000000"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx="10.7009"
                          cy="10.7009"
                          r="10.7009"
                          transform="matrix(-1 0 0 1 21.4019 0)"
                          fill="#000000"
                        />
                        <circle
                          cx="10.7009"
                          cy="10.7009"
                          r="10.7009"
                          transform="matrix(-1 0 0 1 21.4019 0)"
                          fill="#000000"
                        />
                        <circle
                          cx="10.7009"
                          cy="10.7009"
                          r="10.7009"
                          transform="matrix(-1 0 0 1 21.4019 0)"
                          fill="#000000"
                        />
                        <circle
                          cx="10.7009"
                          cy="10.7009"
                          r="10.7009"
                          transform="matrix(-1 0 0 1 21.4019 0)"
                          fill="#000000"
                        />
                        <circle
                          cx="10.7009"
                          cy="10.7009"
                          r="10.7009"
                          transform="matrix(-1 0 0 1 21.4019 0)"
                          fill="#000000"
                        />
                        <circle
                          cx="10.7009"
                          cy="10.7009"
                          r="10.7009"
                          transform="matrix(-1 0 0 1 21.4019 74.4785)"
                          fill="#000000"
                        />
                        <circle
                          cx="10.7009"
                          cy="10.7009"
                          r="10.7009"
                          transform="matrix(-1 0 0 1 21.4019 74.4785)"
                          fill="#000000"
                        />
                        <circle
                          cx="10.7009"
                          cy="10.7009"
                          r="10.7009"
                          transform="matrix(-1 0 0 1 21.4019 74.4785)"
                          fill="#000000"
                        />
                        <circle
                          cx="10.7009"
                          cy="10.7009"
                          r="10.7009"
                          transform="matrix(-1 0 0 1 21.4019 74.4785)"
                          fill="#000000"
                        />
                        <circle
                          cx="10.7009"
                          cy="10.7009"
                          r="10.7009"
                          transform="matrix(-1 0 0 1 21.4019 74.4785)"
                          fill="#000000"
                        />
                        <circle
                          cx="10.7009"
                          cy="10.7009"
                          r="10.7009"
                          transform="matrix(-1 0 0 1 21.4019 36.8105)"
                          fill="#000000"
                        />
                        <circle
                          cx="10.7009"
                          cy="10.7009"
                          r="10.7009"
                          transform="matrix(-1 0 0 1 21.4019 36.8105)"
                          fill="#000000"
                        />
                        <circle
                          cx="10.7009"
                          cy="10.7009"
                          r="10.7009"
                          transform="matrix(-1 0 0 1 21.4019 36.8105)"
                          fill="#000000"
                        />
                        <circle
                          cx="10.7009"
                          cy="10.7009"
                          r="10.7009"
                          transform="matrix(-1 0 0 1 21.4019 36.8105)"
                          fill="#000000"
                        />
                        <circle
                          cx="10.7009"
                          cy="10.7009"
                          r="10.7009"
                          transform="matrix(-1 0 0 1 21.4019 36.8105)"
                          fill="#000000"
                        />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className={cx('menu-button')}>
                    {/* close button */}
                    <button
                      type="button"
                      className={cx('close-icon')}
                      onClick={() => {
                        setIsNavShown(!isNavShown)
                        isMainNavShown
                          ? setIsMainNavShown(!isMainNavShown)
                          : undefined
                      }}
                      aria-label="Toggle navigation"
                      aria-controls={cx('full-menu-wrapper')}
                      aria-expanded={!isNavShown}
                    >
                      <svg
                        version="1.0"
                        xmlns="http://www.w3.org/2000/svg"
                        width="512.000000pt"
                        height="512.000000pt"
                        viewBox="0 0 512.000000 512.000000"
                        preserveAspectRatio="xMidYMid meet"
                      >
                        <g
                          transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                          fill="#000000"
                          stroke="none"
                        >
                          <path
                            d="M2330 5109 c-305 -29 -646 -126 -910 -259 -273 -138 -559 -356 -755
-576 -384 -432 -602 -931 -655 -1499 -41 -446 55 -949 260 -1355 138 -273 356
-559 576 -755 432 -384 931 -602 1499 -655 446 -41 949 55 1355 260 273 138
559 356 755 576 384 432 602 931 655 1499 41 446 -55 949 -260 1355 -138 273
-356 559 -576 755 -432 384 -931 602 -1499 655 -125 11 -320 11 -445 -1z
m-193 -1701 l423 -423 425 425 425 425 212 -213 213 -212 -425 -425 -425 -425
425 -425 425 -425 -213 -212 -212 -213 -425 425 -425 425 -425 -425 -425 -425
-212 213 -213 212 425 425 425 425 -425 425 -425 425 210 210 c115 115 212
210 215 210 3 0 195 -190 427 -422z"
                          />
                        </g>
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className={cx('image-menu-wrapper')}>
            <div className={cx('close-button')}>
              {/* close button */}
              <button
                type="button"
                className={cx('close-icon')}
                onClick={() => {
                  setIsNavShown(!isNavShown)
                  isMainNavShown
                    ? setIsMainNavShown(!isMainNavShown)
                    : undefined
                }}
                aria-label="Toggle navigation"
                aria-controls={cx('primary-navigation')}
                aria-expanded={!isNavShown}
              >
                <svg
                  version="1.0"
                  xmlns="http://www.w3.org/2000/svg"
                  width="512.000000pt"
                  height="512.000000pt"
                  viewBox="0 0 512.000000 512.000000"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <g
                    transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                    fill="#000000"
                    stroke="none"
                  >
                    <path
                      d="M2330 5109 c-305 -29 -646 -126 -910 -259 -273 -138 -559 -356 -755
-576 -384 -432 -602 -931 -655 -1499 -41 -446 55 -949 260 -1355 138 -273 356
-559 576 -755 432 -384 931 -602 1499 -655 446 -41 949 55 1355 260 273 138
559 356 755 576 384 432 602 931 655 1499 41 446 -55 949 -260 1355 -138 273
-356 559 -576 755 -432 384 -931 602 -1499 655 -125 11 -320 11 -445 -1z
m-193 -1701 l423 -423 425 425 425 425 212 -213 213 -212 -425 -425 -425 -425
425 -425 425 -425 -213 -212 -212 -213 -425 425 -425 425 -425 -425 -425 -425
-212 213 -213 212 425 425 425 425 -425 425 -425 425 210 210 c115 115 212
210 215 210 3 0 195 -190 427 -422z"
                    />
                  </g>
                </svg>
              </button>
            </div>
          </div>
        )}

        <div
          className={cx([
            'full-menu-wrapper',
            isMainNavShown ? 'show' : undefined,
          ])}
        >
          <MainCategoryMenu categoryName={categoryName} />
        </div>
        <div
          className={cx(['full-menu-wrapper', isNavShown ? 'show' : undefined])}
        >
          <TravelGuidesMenu />
        </div>
      </div>
    </div>
  )
}
