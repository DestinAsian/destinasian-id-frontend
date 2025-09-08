// import React, { useState } from 'react'
// import styles from './FloatingButtons.module.scss'
// import classNames from 'classnames/bind'
// import { FaTimes } from 'react-icons/fa'

// const cx = classNames.bind(styles)

// const FloatingButtons = ({ buttonTopUp }) => {
//   if (!buttonTopUp) return null

//   const {
//     buttonPopUp1,
//     buttonPopUp2,
//     linkButtonPopUp1,
//     linkButtonPopUp2,
//     logoButtonPopUp,
//   } = buttonTopUp

//   const [showBtn1, setShowBtn1] = useState(true)
//   const [showBtn2, setShowBtn2] = useState(true)

//   return (
//     <div className={cx('floatingButtonsWrap')}>
//       {showBtn1 && buttonPopUp1 && (
//         <div className={cx('buttonItem')}>
//           <a
//             href={linkButtonPopUp1 || '#'}
//             target="_blank"
//             rel="noopener noreferrer"
//             className={cx('buttonLink')}
//           >
//             {logoButtonPopUp && (
//               <div
//                 className={cx('logoWrapper')}
//                 dangerouslySetInnerHTML={{ __html: logoButtonPopUp }}
//               />
//             )}
//             <span>{buttonPopUp1}</span>
//           </a>
//           <button
//             className={cx('closeBtn')}
//             onClick={() => setShowBtn1(false)}
//           >
//             <FaTimes />
//           </button>
//         </div>
//       )}

//       {showBtn2 && buttonPopUp2 && (
//         <div className={cx('buttonItem')}>
//           <a
//             href={linkButtonPopUp2 || '#'}
//             target="_blank"
//             rel="noopener noreferrer"
//             className={cx('buttonLink')}
//           >
//             <span>{buttonPopUp2}</span>
//           </a>
//           <button
//             className={cx('closeBtn')}
//             onClick={() => setShowBtn2(false)}
//           >
//             <FaTimes />
//           </button>
//         </div>
//       )}
//     </div>
//   )
// }

// export default FloatingButtons


import React, { useState } from 'react'
import styles from './FloatingButtons.module.scss'
import classNames from 'classnames/bind'
import { FaTimes } from 'react-icons/fa'

const cx = classNames.bind(styles)

const FloatingButtons = ({ buttonTopUp }) => {
  if (!buttonTopUp) return null

  const {
    buttonPopUp1,
    buttonPopUp2,
    linkButtonPopUp1,
    linkButtonPopUp2,
    logoButtonPopUp,
  } = buttonTopUp

  const [showBtn1, setShowBtn1] = useState(true)
  const [showBtn2, setShowBtn2] = useState(true)

  // tracking klik
  const handleClick = (id, label, url) => {
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'button_click',
        button_id: id,
        button_label: label,
        button_url: url,
      })
    }
  }

  return (
    <div className={cx('floatingButtonsWrap')}>
      {showBtn1 && buttonPopUp1 && (
        <div className={cx('buttonItem')}>
          <a
            id="guides_others_click_tracker"
            href={linkButtonPopUp1 || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className={cx('buttonLink')}
            onClick={() =>
              handleClick(
                'guides_others_click_tracker',
                buttonPopUp1,
                linkButtonPopUp1
              )
            }
          >
            {logoButtonPopUp && (
              <div
                className={cx('logoWrapper')}
                dangerouslySetInnerHTML={{ __html: logoButtonPopUp }}
              />
            )}
            <span>{buttonPopUp1}</span>
          </a>
          <button
            className={cx('closeBtn')}
            onClick={() => setShowBtn1(false)}
          >
            <FaTimes />
          </button>
        </div>
      )}

      {showBtn2 && buttonPopUp2 && (
        <div className={cx('buttonItem')}>
          <a
            id="guides_story_click_tracker"
            href={linkButtonPopUp2 || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className={cx('buttonLink')}
            onClick={() =>
              handleClick(
                'guides_story_click_tracker',
                buttonPopUp2,
                linkButtonPopUp2
              )
            }
          >
            <span>{buttonPopUp2}</span>
          </a>
          <button
            className={cx('closeBtn')}
            onClick={() => setShowBtn2(false)}
          >
            <FaTimes />
          </button>
        </div>
      )}
    </div>
  )
}

export default FloatingButtons
