import className from 'classnames/bind'
import { FeaturedImage } from '../../components'
import { useState, useEffect } from 'react'
import styles from './SingleLLFeaturedImage.module.scss'
import { Container, FullMenu } from '../../components'
import { LLMenu } from '../LLMenu'

let cx = className.bind(styles)

export default function SingleLLFeaturedImage({
  mainLogo,
  secondaryLogo,
  databaseId,
  uri,
  isLLNavShown,
  setIsLLNavShown,
}) {
  return (
    <div
      className={cx([
        'component',
        className,
        isLLNavShown ? 'show' : undefined,
      ])}
    >
      {/* Responsive header */}
      {!isLLNavShown ? (
        <>
          <div className={cx('image-wrapper')}>
            {isLLNavShown == false ? null : (
              <div className={cx('menu-button')}>
                <button
                  type="button"
                  className={cx('close-icon')}
                  onClick={() => {
                    setIsLLNavShown(!isLLNavShown)
                  }}
                  aria-label="Toggle navigation"
                  aria-controls={cx('full-menu-wrapper')}
                  aria-expanded={!isLLNavShown}
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
                      fill="#ffffff"
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
        </>
      ) : (
        <div className={cx('image-menu-wrapper')}></div>
      )}

      {/* Full menu */}
      <div
        className={cx(['full-menu-wrapper', isLLNavShown ? 'show' : undefined])}
      >
        <LLMenu
          mainLogo={mainLogo}
          secondaryLogo={secondaryLogo}
          databaseId={databaseId}
          uri={uri}
        />
      </div>
    </div>
  )
}
