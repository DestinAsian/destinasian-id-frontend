import classNames from 'classnames/bind'
import Image from 'next/image'
import Link from 'next/link'
import styles from './Footer.module.scss'
import destinasianLogoWht from '../../assets/logo/DAI_logo.png'
import daman_footer_logo from '../../assets/logo/daman_footer_logo.png'
import prestige_logo from '../../assets/logo/prestige_logo.png'

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
  FaThreads,
} from 'react-icons/fa6'

const cx = classNames.bind(styles)

export default function Footer() {
  const year = new Date().getFullYear()

  // Link sosial media
  const facebookUri = 'https://www.facebook.com/DestinAsian.Mag'
  const instagramUri = 'https://www.instagram.com/destinasianmagazine'
  const linkedInUri = 'https://www.linkedin.com/company/destinasian-media/'

  return (
    <footer className={cx('footer')}>
      <div className={cx('container')}>
        <div className={cx('footer-wrapper')}>
          {/* KIRI */}
          <div className={cx('footer-left')}>
            <div className={cx('social-icons')}>
              <a
                href={facebookUri}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <FaFacebookF />
              </a>
              <a
                href={linkedInUri}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <FaXTwitter />
              </a>
              <a
                href={instagramUri}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
              <a
                href={linkedInUri}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn />
              </a>
              <a
                href={linkedInUri}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <FaThreads />
              </a>
            </div>

            <div className={cx('footer-text')}>
              <p>
                © {year} DestinAsian Media Group All Rights Reserved. Use of
                this site constitutes acceptance of our User Agreement
                (effective 21/12/2015) and{' '}
                <Link href="/privacy-policy">Privacy Policy</Link> (effective
                21/12/2015). The material on this site may not be reproduced,
                distributed, transmitted, cached or otherwise used, except with
                prior written permission of DestinAsian Media Group.
              </p>
            </div>
          </div>

          {/* KANAN */}
          <div className={cx('footer-right')}>
            <a href="#top" className={cx('back-to-top')}>
              BACK TO TOP
            </a>

            <div className={cx('footer-logos')}>
              <Image
                src={destinasianLogoWht.src}
                alt="DestinAsian"
                width={120}
                height={30}
              />
              <Image src={prestige_logo.src} alt="Prestige" width={120} height={30} />
              <Image src={daman_footer_logo.src} alt="Daman" width={120} height={30} />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
