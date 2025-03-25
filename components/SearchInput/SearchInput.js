import { useEffect, useRef } from 'react'
import { FaSearch, FaWindowClose } from 'react-icons/fa'

import styles from './SearchInput.module.scss'

/**
 * Render the SearchInput component.
 *
 * @param {Props} props The props object.
 * @param {string} props.value The search input value
 * @param {(newValue: string) => void} props.onChange The search input onChange handler
 * @returns {React.ReactElement} The SearchInput component.
 */
export default function SearchInput({
  value,
  onChange,
  clearSearch,
  ...props
}) {
  const input = useRef()

  // Clear and focus the input on initial render
  useEffect(() => {
    input.current.value = ''
    // input.current.focus();
  }, [])

  return (
    <div className={styles.wrapper}>
      <FaSearch className={styles.icon} />
      <label className="sr-only" htmlFor="search">
        Search
      </label>

      <input
        ref={input}
        id="search"
        name="search"
        className={styles.input}
        value={value}
        onChange={(e) => {
          if (onChange) {
            onChange(e.target.value)
          }
        }}
        // autoFocus
        // onFocus={(e) => e.target.select()}
        type="text"
        autoComplete='off'
        {...props}
      />
      <button onClick={clearSearch} className={styles.closeIcon}>
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
            fill="none"
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
  )
}
