import { useRef, useState, useEffect } from 'react'
import { Maximize, Minimize } from 'lucide-react'

export default function FullscreenWrapper({ children, className = '' }) {
  const containerRef = useRef(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const toggleFullscreen = async () => {
    const el = containerRef.current
    if (!el) return
    try {
      if (!document.fullscreenElement) {
        await el.requestFullscreen()
        setIsFullscreen(true)
      } else {
        await document.exitFullscreen()
        setIsFullscreen(false)
      }
    } catch (e) {
      console.error('Fullscreen error:', e)
    }
  }

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        onClick={toggleFullscreen}
        className="absolute top-3 right-3 z-20 inline-flex items-center gap-2 rounded-md bg-black/40 hover:bg-black/60 text-white px-3 py-1.5 backdrop-blur transition"
      >
        {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
        <span className="text-sm">{isFullscreen ? 'Exit' : 'Fullscreen'}</span>
      </button>
      {children}
    </div>
  )
}
