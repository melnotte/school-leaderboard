import { avatarColors, initials } from '../lib/format'

export default function Avatar({ name, large }) {
  const [bg, fg] = avatarColors(name)
  return (
    <span className={large ? 'avatar avatar-lg' : 'avatar'} style={{ background: bg, color: fg }}>
      {initials(name)}
    </span>
  )
}