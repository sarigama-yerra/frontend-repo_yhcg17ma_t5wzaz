import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import FullscreenWrapper from './FullscreenWrapper'

// Simple 2D atom simulation (no extra deps)
function Electron({ radius = 80, size = 8, speed = 1, phase = 0, color = '#60a5fa' }) {
  const angle = useMemo(() => phase, [phase])
  const circumference = 2 * Math.PI * radius
  const duration = Math.max(2, 20 / speed)

  return (
    <motion.div
      className="absolute left-1/2 top-1/2"
      style={{ width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2 }}
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, ease: 'linear', duration }}
    >
      <div
        className="rounded-full"
        style={{
          width: size,
          height: size,
          background: color,
          boxShadow: `0 0 10px ${color}`,
          transform: `translate(${radius}px, 0) rotate(${angle}deg)`
        }}
      />
    </motion.div>
  )
}

export default function AtomSimulator() {
  const [electrons, setElectrons] = useState(6)
  const [orbits, setOrbits] = useState(3)
  const [speed, setSpeed] = useState(1)

  const orbitRadii = useMemo(() => Array.from({ length: orbits }, (_, i) => 60 + i * 40), [orbits])

  return (
    <FullscreenWrapper className="w-full">
      <div className="relative w-full h-[65vh] sm:h-[70vh] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden rounded-2xl border border-white/10">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(99,102,241,0.2), transparent 60%)' }} />

        {/* Controls */}
        <div className="absolute z-10 left-4 top-4 flex gap-3 items-center bg-black/30 backdrop-blur rounded-xl p-3 text-white">
          <div className="flex flex-col">
            <label className="text-xs uppercase tracking-wider text-white/70">Elettroni</label>
            <input type="range" min="1" max="12" value={electrons} onChange={e=>setElectrons(+e.target.value)} />
          </div>
          <div className="flex flex-col">
            <label className="text-xs uppercase tracking-wider text-white/70">Orbite</label>
            <input type="range" min="1" max="6" value={orbits} onChange={e=>setOrbits(+e.target.value)} />
          </div>
          <div className="flex flex-col">
            <label className="text-xs uppercase tracking-wider text-white/70">Velocità</label>
            <input type="range" min="0.5" max="5" step="0.5" value={speed} onChange={e=>setSpeed(+e.target.value)} />
          </div>
        </div>

        {/* Nucleus */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-pink-500 shadow-[0_0_40px_rgba(236,72,153,0.6)]" />

        {/* Orbits */}
        {orbitRadii.map((r, i) => (
          <div key={i} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/30"
            style={{ width: r*2, height: r*2 }} />
        ))}

        {/* Electrons distributed among orbits */}
        {Array.from({ length: electrons }).map((_, idx) => {
          const orbitIndex = idx % orbitRadii.length
          const radius = orbitRadii[orbitIndex]
          const phase = (idx / electrons) * 360
          return <Electron key={idx} radius={radius} phase={phase} speed={speed} />
        })}
      </div>
    </FullscreenWrapper>
  )
}
