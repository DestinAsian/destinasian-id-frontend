// 'use client'

// import { useEffect } from 'react'
// import Script from 'next/script'
// import styles from './NewsletterMailerLite.module.scss'

// export default function NewsletterMailerLite() {
//   useEffect(() => {
//     // fallback kalau script belum kebaca
//     if (window.ml) {
//       window.ml('account', '2066686')
//     }
//   }, [])

//   return (
//     <div className={styles.wrapper}>
//       {/* MailerLite Universal Script */}
//       <Script
//         id="mailerlite-universal"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: `
//             (function(w,d,e,u,f,l,n){
//               w[f]=w[f]||function(){(w[f].q=w[f].q||[]).push(arguments);};
//               l=d.createElement(e);l.async=1;l.src=u;
//               n=d.getElementsByTagName(e)[0];n.parentNode.insertBefore(l,n);
//             })(window,document,'script','https://assets.mailerlite.com/js/universal.js','ml');
//             ml('account', '2066686');
//           `,
//         }}
//       />

//       {/* MailerLite Webform Script */}
//       <Script
//         src="https://groot.mailerlite.com/js/w/webforms.min.js"
//         strategy="afterInteractive"
//       />

//       {/* Embed Form */}
//       <div
//         className="ml-embedded"
//         data-form="O83cL9"
//       />
//     </div>
//   )
// }


'use client'

import { useEffect } from 'react'
import Script from 'next/script'
import styles from './NewsletterMailerLite.module.scss'

export default function NewsletterMailerLite() {
  useEffect(() => {
    if (window.ml) {
      window.ml('account', '2066686')
    }
  }, [])

  return (
    <div className={styles.wrapper}>
      {/* MailerLite Universal */}
      <Script
        id="mailerlite-universal"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,e,u,f,l,n){
              w[f]=w[f]||function(){(w[f].q=w[f].q||[]).push(arguments);};
              l=d.createElement(e);l.async=1;l.src=u;
              n=d.getElementsByTagName(e)[0];n.parentNode.insertBefore(l,n);
            })(window,document,'script','https://assets.mailerlite.com/js/universal.js','ml');
            ml('account', '2066686');
          `,
        }}
      />

      {/* Webform loader */}
      <Script
        src="https://groot.mailerlite.com/js/w/webforms.min.js"
        strategy="afterInteractive"
      />

      {/* Embed */}
      <div className="ml-embedded" data-form="O83cL9" />
    </div>
  )
}
