import { useEffect, useState } from 'react'
import { GoogleTagManager } from '@next/third-parties/google'
import Script from 'next/script'

export default function PageViewsCounter() {
  const [isLocalhost, setIsLocalhost] = useState(true)

  useEffect(() => {
    setIsLocalhost(window.location.hostname === 'localhost')
  }, [])

  return (
    <>
      {!isLocalhost && (
        <>
          {/* Google Tag Manager */}
          <GoogleTagManager gtmId="GTM-5BJVGS" />

          {/* Google Tag Manager (noscript) */}
          <noscript>
            <iframe
              src="https://www.googletagmanager.com/ns.html?id=GTM-5BJVGS"
              height="0"
              width="0"
              className="invisible hidden"
            ></iframe>
          </noscript>
          {/* End Google Tag Manager (noscript) */}

          {/* Frmwrk Tracking Code */}
          <Script
            strategy="afterInteractive"
            id="frmwrk-script"
            dangerouslySetInnerHTML={{
              __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "j7qzcd7z4a");`,
            }}
          />
          {/* End Frmwrk Tracking Code */}

          {/* StatCounter Code */}
          <Script id="statcounter-setup" strategy="afterInteractive">
            {`
              var sc_project=13013151; 
              var sc_invisible=1; 
              var sc_security="384de620"; 
            `}
          </Script>
          <Script
            src="https://www.statcounter.com/counter/counter.js"
            strategy="afterInteractive"
            async
          />
          <noscript>
            <div className="statcounter">
              <a
                title="Web Analytics"
                href="http://statcounter.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  className="statcounter"
                  src="//c.statcounter.com/13013151/0/384de620/0"
                  alt="Web Analytics"
                />
              </a>
            </div>
          </noscript>
          {/* End StatCounter Code */}
        </>
      )}
    </>
  )
}
