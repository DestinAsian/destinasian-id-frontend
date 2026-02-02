import classNames from 'classnames/bind'
import Image from 'next/image'
import Link from 'next/link'
import styles from './Footer.module.scss'
import destinasianLogoWht from '../../assets/logo/destinasianLogoWht.png'
import damanFooterLogo from '../../assets/logo/daman_footer_logo.png'
import prestigeLogo from '../../assets/logo/Prestige_logo.png'
import NewsletterMailerLite from '../../components/NewsletterMailerLite/NewsletterMailerLite'

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

  // Social media links
  const socialLinks = [
    {
      href: 'https://www.facebook.com/share/19RyY4XyMj/',
      icon: <FaFacebookF />,
      label: 'Facebook',
    },
    {
      href: 'https://x.com/DestinAsianID?t=7abAxXj_yoQgW3owe-RbQQ&s=09',
      icon: <FaXTwitter />,
      label: 'X',
    },
    {
      href: 'https://www.instagram.com/destinasianindonesia',
      icon: <FaInstagram />,
      label: 'Instagram',
    },
    {
      href: 'https://www.linkedin.com/company/destinasian-media/',
      icon: <FaLinkedinIn />,
      label: 'LinkedIn',
    },
    {
      href: 'https://www.threads.net/@destinasianindonesia',
      icon: <FaThreads />,
      label: 'Threads',
    },
  ]

  return (
    <footer className={cx('footer')}>
      <div className={cx('container')}>
        {/* Newsletter subscription */}
        <p className={cx('newsletter-title')}>
          Stay inspired with our DestinAsian Indonesia newsletters
        </p>
        <NewsletterMailerLite />

        <div className={cx('footer-wrapper')}>
          {/* Left section */}
          <div className={cx('footer-left')}>
            <div className={cx('social-icons')}>
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                >
                  {link.icon}
                </a>
              ))}
            </div>

            <div className={cx('footer-text')}>
              <div className={cx('footer-buttons')}>
                <Link href="/about-us" className={cx('footer-btn')}>
                  About
                </Link>
                <Link href="/contact-us" className={cx('footer-btn')}>
                  Contact
                </Link>
              </div>

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

          {/* Right section */}
          <div className={cx('footer-right')}>
            <a href="#top" className={cx('back-to-top')}>
              BACK TO TOP
            </a>

            <div className={cx('footer-logos')}>
              <a
                href="https://destinasian.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={destinasianLogoWht.src}
                  alt="DestinAsian"
                  width={120}
                  height={30}
                />
              </a>
              <a
                href="https://www.prestigeonline.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={prestigeLogo.src}
                  alt="Prestige"
                  width={120}
                  height={30}
                />
              </a>
              <a
                href="https://daman.co.id/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={damanFooterLogo.src}
                  alt="Daman"
                  width={120}
                  height={30}
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
