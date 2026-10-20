import { Medal } from 'lucide-react'

export default function RankBadge({ rank }) {
  if (rank <= 3) {
    return <Medal className={`rank-medal rank-${rank}`} size={24} strokeWidth={2.2} aria-label={`Lugar ${rank}`} />
  }
  return <span className="rank-number">{rank}°</span>
}