import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

export default function App() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    supabase.rpc('get_global').then(({ data, error }) => {
      if (error) setError(error.message)
      else setData(data)
    })
  }, [])

  if (error) return <p>Error: {error}</p>
  if (!data) return <p>Cargando…</p>
  return <p>Conectado. Grupos: {data.groups.length}, estudiantes: {data.students.length}</p>
}