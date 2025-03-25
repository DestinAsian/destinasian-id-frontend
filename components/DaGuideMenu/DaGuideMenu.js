import React, { useState, useEffect } from 'react'
import className from 'classnames/bind'
import { Heading, Container } from '../../components'
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
              {!!title && <Heading className={cx('title')}>{title}</Heading>}
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
              {/* <div
                className={cx([
                  'index-menu-wrapper',
                  isNavShown ? 'show' : undefined,
                ])}
              >
                <div className={cx('index-menu-content')}>
                  <div className={cx('first-wrapper')}>
               && (
                      
                        <>
                      
                          {categoryName}
                        </>
                      </Link>
                    )}
                  </div>
                  <div className={cx('second-wrapper')}>
                  </div>
                </div>
              </div> */}
            </Container>
          </div>
        )}
      </div>
    </div>
  )
}
