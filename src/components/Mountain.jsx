import { useEffect, useRef, useState } from 'react'
import { avatarColors, initials } from '../lib/format'

export default function Mountain({ students, total }) {
  const ref = useRef(null)
  const [W, setW] = useState(800)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => setW(Math.max(280, Math.floor(el.clientWidth)))
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const H = W < 500 ? 210 : 250
  const LEFT = 24, PEAK_X = W / 2, PEAK_Y = 34, BASE_Y = H - 24
  const stacked = {} // cuántos estudiantes hay ya con el mismo avance

  return (
    <div ref={ref}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="mountain" role="img"
        aria-label="Avance de los estudiantes hacia la cima">
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#bfdbfe" />
            <stop offset="1" stopColor="#ecfdf5" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill="url(#sky)" />
        <polygon points={`${LEFT},${BASE_Y} ${PEAK_X},${PEAK_Y} ${W - LEFT},${BASE_Y}`} fill="#6b7280" />
        <polygon points={`${PEAK_X - 30},${PEAK_Y + 34} ${PEAK_X},${PEAK_Y} ${PEAK_X + 30},${PEAK_Y + 34}`} fill="#fff" />
        <line x1={PEAK_X} y1={PEAK_Y} x2={PEAK_X} y2={PEAK_Y - 24} stroke="#92400e" strokeWidth="2" />
        <polygon points={`${PEAK_X},${PEAK_Y - 24} ${PEAK_X + 18},${PEAK_Y - 16} ${PEAK_X},${PEAK_Y - 8}`} fill="#f59e0b" />
        <rect y={BASE_Y} width={W} height="24" fill="#d1fae5" />

        {Array.from({ length: total }, (_, i) => {
          const f = (i + 1) / total
          return (
            <circle key={i} cx={LEFT + (PEAK_X - LEFT) * f} cy={BASE_Y + (PEAK_Y - BASE_Y) * f}
              r="3" fill="#fff" opacity="0.85" />
          )
        })}

        {[...students].reverse().map((s) => {
          const slot = stacked[s.done] ?? 0
          stacked[s.done] = slot + 1
          const f = total ? s.done / total : 0
          const x = Math.min(LEFT + (PEAK_X - LEFT) * f + slot * 25, W - 20)
          const y = BASE_Y + (PEAK_Y - BASE_Y) * f - 12
          const [bg, fg] = avatarColors(s.name)
          const first = s.rank === 1
          return (
            <g key={s.token}>
              <title>{s.name}: {s.points} puntos</title>
              <circle cx={x} cy={y} r="12" fill={bg} stroke={first ? '#f59e0b' : fg} strokeWidth={first ? 3 : 1.5} />
              <text x={x} y={y + 4} textAnchor="middle" fontSize="10" fontWeight="800" fill={fg}>
                {initials(s.name)}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}