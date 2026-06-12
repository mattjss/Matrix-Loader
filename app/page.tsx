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
    <div className={isLight ? 'light' : ''} style={{
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
        <label className="toggle">
          <input type="checkbox" checked={isLight} onChange={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} />
          <span className="knob"></span>
        </label>
      )}
    </div>
  )
}
