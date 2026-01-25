"use client"

import { useEffect, useRef } from "react"
import Script from "next/script"

declare global {
  interface Window {
    UnicornStudio: {
      init: () => Promise<void>
      destroy: () => void
    }
  }
}

export function LoaderSpinner() {
  const containerRef = useRef<HTMLDivElement>(null)
  const initializedRef = useRef(false)

  useEffect(() => {
    return () => {
      if (window.UnicornStudio) {
        window.UnicornStudio.destroy()
      }
    }
  }, [])

  const handleScriptLoad = () => {
    if (window.UnicornStudio && !initializedRef.current) {
      initializedRef.current = true
      window.UnicornStudio.init()
    }
  }

  return (
    <>
      <Script
        src="https://cdn.unicorn.studio/v1.3.2/unicornStudio.umd.js"
        strategy="afterInteractive"
        onLoad={handleScriptLoad}
      />
      <div
        ref={containerRef}
        className="w-[36px] h-[36px] flex-shrink-0 rounded-full overflow-hidden"
        data-us-project="xReERoQgvBZFs8k3erNY"
        data-us-fps="120"
        data-us-transparent="true"
        style={{ width: "36px", height: "36px", background: "transparent" }}
      />
    </>
  )
}
