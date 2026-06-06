"use client"

import { useEffect, useState } from "react"
import { MatrixLoader } from "@/components/matrix-loader"

export default function Page() {
  const [isEmbed, setIsEmbed] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    setIsEmbed(new URLSearchParams(window.location.search).has('embed'))
  }, [])

  useEffect(() => {
    if (!isEmbed) return
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'theme') setTheme(e.data.theme)
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [isEmbed])

  const isLight = theme === 'light'

  return (
    <div style={{
      width: '100vw', height: '100vh',
      background: isLight ? '#FCFCFC' : '#101010',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: isLight ? '#101010' : '#ffffff',
    }}>
      <div style={{
        width: 422, height: 422,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingLeft: 16,
        paddingRight: 16,
        boxSizing: 'border-box' as const,
      }}>
        <MatrixLoader />
      </div>

      {!isEmbed && (
        <button
          onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
          aria-label="Toggle theme"
          style={{
            position: 'fixed', bottom: 24, right: 24,
            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            color: isLight ? '#191919' : '#fafafa', opacity: 0.5,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
            {isLight && <circle cx="8" cy="8" r="4" fill="currentColor"/>}
          </svg>
        </button>
      )}
    </div>
  )
}
