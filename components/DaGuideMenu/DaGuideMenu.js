import React, { useState, useEffect } from 'react'
import className from 'classnames/bind'
import dynamic from 'next/dynamic'

const Heading = dynamic(() => import('../../components/Heading/Heading'))
const Container = dynamic(() => import('../../components/Container/Container'))
import styles from './DaGuideMenu.module.scss'
import Link from 'next/link'

let cx = className.bind(styles)

export default function DaGuideMenu({
  parent,
  title,
  categories,
  className,
  parentUri,
  titleUri,
  categoryUri,
  parentName,
  titleName,
  categoryName,
  parentDestinationGuides,
}) {
  const [isNavShown, setIsNavShown] = useState(false)

  // Stop scrolling pages when isNavShown
  useEffect(() => {
    if (isNavShown) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'visible'
    }
  }, [isNavShown])

  const hasParent = parent
  const hasTitle = title
  const hasCategory = categories

  return (
    <div className={cx(['component', className])}>
      <div className={cx('container-wrapper')}>
        {/* Parent category navigation */}
        {!!hasTitle && (
          <div key={'hasTitle'} className={cx('text')}>
            <Container>
              {/* {!!title && <Heading className={cx('title')}>{title}</Heading>} */}
              {!!title && (
                <Heading className={cx('title')}>
                  <button
                    type="button"
                    className={cx('menu-button')}
                    onClick={() => setIsNavShown(!isNavShown)}
                    aria-controls={cx('full-menu-wrapper')}
                    aria-expanded={!isNavShown}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
                      <path
                        d="M5 10h30v3H5zM5 18.5h30v3H5zM5 27h30v3H5z"
                        fill="#fff"
                      />
                    </svg>
                  </button>
                  <span>{title}</span>
                </Heading>
              )}
            </Container>
          </div>
        )}

        {/* Children category navigation */}
        {!!hasParent && (
          <div key={'hasParent'} className={cx('text')}>
            <Container>
              {!!parent && <Heading className={cx('title')}>{parent}</Heading>}
            </Container>
          </div>
        )}
        {/* Single post navigation */}
        {!!hasCategory && (
          <div key={'hasCategory'} className={cx('text')}>
            <Container>
              {!!categories && (
                <Heading className={cx('title')}>{categories}</Heading>
              )}
            </Container>
          </div>
        )}
      </div>
    </div>
  )
}
