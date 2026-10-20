const COLORS = [
  ['#dbeafe', '#1e40af'], ['#dcfce7', '#166534'], ['#fef3c7', '#92400e'],
  ['#fce7f3', '#9d174d'], ['#ede9fe', '#4c1d95'], ['#ffedd5', '#9a3412'],
  ['#d1fae5', '#065f46'], ['#e0f2fe', '#075985'],
]

// El mismo nombre siempre recibe el mismo color
export function avatarColors(name) {
  let h = 0
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) % COLORS.length
  return COLORS[h]
}

export function initials(name) {
  return name.split(' ').slice(0, 2).map((w) => w[0] || '').join('').toUpperCase()
}

export function percent(done, total) {
  return total ? Math.round((done / total) * 100) : 0
}

export function formatDate(iso) {
  return new Date(iso + 'T00:00').toLocaleDateString('es-MX', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

export function shortDate(iso) {
  return new Date(iso + 'T00:00').toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })
}