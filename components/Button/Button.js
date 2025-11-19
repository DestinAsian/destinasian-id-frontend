import Link from 'next/link'
import styles from './Button.module.scss'

export default function Button({ href, styleType = 'primary', className, children, ...props }) {
  const buttonClassName = [
    styles.button,
    styles[`button-${styleType}`],
    className,
  ].filter(Boolean).join(' ')

  if (href) {
    return (
      <Link href={href} role="button" className={buttonClassName} {...props}>
        {children}
      </Link>
    )
  }

  return (
    <button className={buttonClassName} {...props}>
      {children}
    </button>
  )
}
