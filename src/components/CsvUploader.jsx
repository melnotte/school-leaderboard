import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { readStudentsCsv } from '../lib/csv'

export default function CsvUploader() {
  const [parsed, setParsed] = useState(null)
  const [group, setGroup] = useState('')
  const [date, setDate] = useState(new Date().toLocaleDateString('en-CA'))
  const [points, setPoints] = useState(100)
  const [status, setStatus] = useState(null)

  async function onFile(e) {
    const file = e.target.files[0]
    if (!file) return
    setStatus(null)
    setGroup(
      file.name.replace(/\.csv$/i, '').replace(/^estudiantes[-_ ]?/i, '')
        .replace(/[-_]+/g, ' ').toUpperCase().trim()
    )
    try {
      setParsed(readStudentsCsv(await file.text()))
    } catch (err) {
      setParsed(null)
      setStatus({ type: 'error', text: err.message })
    }
  }

  async function upload() {
    if (!parsed || !group.trim() || !date) {
      setStatus({ type: 'error', text: 'Elige un archivo, escribe el grupo y la fecha' })
      return
    }
    setStatus({ type: 'ok', text: 'Subiendo…' })
    const { data, error } = await supabase.rpc('import_session', {
      p_group: group.trim(),
      p_date: date,
      p_activities: parsed.activities,
      p_rows: parsed.students,
      p_pts: Number(points) || 100,
    })
    if (error) {
      setStatus({ type: 'error', text: 'No se pudo subir: ' + error.message })
    } else {
      const link = `${window.location.origin}${window.location.pathname}#/g/${data.group_token}`
      setStatus({ type: 'ok', text: `Listo: ${data.students} estudiantes en "${data.group}". Link del grupo: ${link}` })
    }
  }

  return (
    <div>
      <h2>Subir avance</h2>
      <p><input type="file" accept=".csv,text/csv" onChange={onFile} /></p>
      {parsed && <p>{parsed.students.length} estudiantes y {parsed.activities.length} actividades</p>}
      <p><label>Grupo <input value={group} onChange={(e) => setGroup(e.target.value)} /></label></p>
      <p><label>Fecha <input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></label></p>
      <p><label>Puntos por actividad <input type="number" value={points} onChange={(e) => setPoints(e.target.value)} /></label></p>
      <button onClick={upload}>Subir avance</button>
      {status && <p>{status.text}</p>}
    </div>
  )
}