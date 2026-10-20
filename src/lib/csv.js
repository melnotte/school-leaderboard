// Convierte el texto del CSV en una tabla
function parseCSV(text) {
  text = text.replace(/^\uFEFF/, '')
  const firstLine = text.split(/\r?\n/)[0] || ''
  const delim = !firstLine.includes(',') && firstLine.includes(';') ? ';' : ','
  const rows = []
  let row = [], cur = '', inQuotes = false

  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') { cur += '"'; i++ }
        else inQuotes = false
      } else cur += ch
    } else if (ch === '"') inQuotes = true
    else if (ch === delim) { row.push(cur); cur = '' }
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++
      row.push(cur); cur = ''
      rows.push(row); row = []
    } else cur += ch
  }
  if (cur !== '' || row.length) { row.push(cur); rows.push(row) }
  return rows.filter((r) => r.some((c) => c.trim() !== ''))
}

const YES = ['1', 'true', 'x', 'si', 'sí']

// Lee el CSV de la tabla
export function readStudentsCsv(text) {
  const rows = parseCSV(text)
  const header = (rows[0] || []).map((h) => h.trim())

  if (rows.length < 2 || header.length < 3 || !header[1].toLowerCase().includes('estudiante')) {
    throw new Error('Este CSV no tiene el formato esperado')
  }

  const hasPoints = header[header.length - 1].toLowerCase() === 'puntos'
  const activities = header.slice(2, hasPoints ? header.length - 1 : header.length)

  const students = rows.slice(1)
    .map((r) => ({
      name: (r[1] || '').trim(),
      checks: activities.map((_, i) => YES.includes(String(r[2 + i] || '').trim().toLowerCase())),
    }))
    .filter((s) => s.name)

  return { activities, students }
}