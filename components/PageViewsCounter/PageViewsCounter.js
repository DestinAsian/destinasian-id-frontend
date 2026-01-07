import { useEffect, useState } from 'react'
import Script from 'next/script'

export default function PageViewsCounter() {
  const [isLocalhost, setIsLocalhost] = useState(true)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsLocalhost(window.location.hostname === 'localhost')
    }
  }, [])

  if (isLocalhost) return null

  return (
    <>
      {/* 🎯 Microsoft Clarity */}
      <Script
        id="clarity-tracking"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "j7qzcd7z4a");`,
        }}
      />

      {/* 📈 StatCounter */}
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
      />

      <noscript>
        <div className="statcounter">
          <a
            title="Web Analytics"
            href="https://statcounter.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="//c.statcounter.com/13013151/0/384de620/0"
              alt="Web Analytics"
            />
          </a>
        </div>
      </noscript>
    </>
  )
}
