import React from 'react'
import classNames from 'classnames/bind'
import styles from './PasswordProtected.module.scss'
import destinasianLogoBlk from '../../assets/logo/destinasian-logo-password-protected.jpg'
import Link from 'next/link'
import Image from 'next/image'
import Div100vh from 'react-div-100vh'
import { SEO } from '../../components'

let cx = classNames.bind(styles)

export default function PasswordProtected(
  enteredPassword,
  ...props
) {
  return (
    <>
      <SEO
        title={enteredPassword?.title}
        description={enteredPassword?.description}
        imageUrl={enteredPassword?.imageUrl}
        url={enteredPassword?.url}
        focuskw={enteredPassword?.focuskw}
      />
      <Div100vh>
        <div className={cx('component')}>
          <div className={cx('destinasian-logo')}>
            <Link href="/" className={cx('logo')}>
              <div className={cx('brand')}>
                <Image
                  src={destinasianLogoBlk.src}
                  alt="Destinasian Logo"
                  fill
                  sizes="100%"
                  priority
                />
              </div>
            </Link>
          </div>
          <h4>Fill in your password or contact our administrator.</h4>
          <div className={cx('input-wrapper')}>
            <input
              type="password"
              value={enteredPassword?.enteredPassword}
              onChange={(e) => {
                if (enteredPassword?.setEnteredPassword) {
                  enteredPassword?.setEnteredPassword(e.target.value)
                }
              }}
              placeholder="Enter password"
              {...props}
            />
            <button type="submit">Submit</button>
          </div>
        </div>
      </Div100vh>
    </>
  )
}
