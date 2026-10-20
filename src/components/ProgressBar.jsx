import { percent } from '../lib/format'

export default function ProgressBar({ done, total }) {
  const p = percent(done, total)
  return (
    <div>
      <div className="progress"><i style={{ width: `${p}%` }} /></div>
      <small>{done} de {total} ({p}%)</small>
    </div>
  )
}