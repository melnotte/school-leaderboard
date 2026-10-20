import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Global() {
  const [data, setData] = useState(null)

  useEffect(() => {
    supabase.rpc('get_global').then(({ data }) => setData(data))
  }, [])

  if (!data) return <p>Cargando…</p>
  return <h1>Ranking de la escuela ({data.students.length} estudiantes)</h1>
}