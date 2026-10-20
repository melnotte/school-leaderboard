import { shortDate } from '../lib/format'

const W = 640, H = 210, M = 36

export default function ProgressChart({ history }) {
  if (history.length < 2) {
    return <p className="sub">La gráfica aparece cuando hay actividades completadas en dos o más fechas.</p>
  }

  const max = Math.max(...history.map((h) => h.points), 1)
  const x = (i) => M + (i * (W - 2 * M)) / (history.length - 1)
  const y = (p) => H - M - (p / max) * (H - 2 * M - 10)

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="chart" role="img" aria-label="Evolución de puntos">
      <polyline
        fill="none" stroke="#16a34a" strokeWidth="3" strokeLinejoin="round"
        points={history.map((h, i) => `${x(i)},${y(h.points)}`).join(' ')}
      />
      {history.map((h, i) => (
        <g key={h.date}>
          <circle cx={x(i)} cy={y(h.points)} r="4.5" fill="#16a34a" />
          <text x={x(i)} y={y(h.points) - 10} textAnchor="middle" fontSize="12" fontWeight="800">{h.points}</text>
          <text x={x(i)} y={H - 10} textAnchor="middle" fontSize="11" fill="#6b7280">{shortDate(h.date)}</text>
        </g>
      ))}
    </svg>
  )
}