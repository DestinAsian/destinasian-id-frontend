import Link from 'next/link'
import styles from './Button.module.scss'

/**
 * Button component, can render as <button> or <Link> if href is provided.
 *
 * @param {Object} props
 * @param {string} props.href Optional href, renders a Link if present
 * @param {'primary'|'secondary'} props.styleType Button style type
 * @param {string} props.className Optional additional className
 * @param {React.ReactNode} props.children Button content
 */
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
