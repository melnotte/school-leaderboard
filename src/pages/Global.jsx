import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Avatar from '../components/Avatar'
import ProgressBar from '../components/ProgressBar'
import RankBadge from '../components/RankBadge'

export default function Global() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [group, setGroup] = useState('')

  useEffect(() => {
    supabase.rpc('get_global').then(({ data, error }) => {
      if (error) setError(error.message)
      else setData(data)
    })
  }, [])

  if (error) return <p className="msg">No se pudo cargar: {error}</p>
  if (!data) return <p className="msg">Cargando…</p>
  if (data.students.length === 0) return <p className="msg">Aún no hay datos publicados.</p>

  const rows = data.students.filter((s) => !group || s.group === group)

  return (
    <>
      <h1>Ranking global</h1>
      <p className="sub">{data.students.length} estudiantes en {data.groups.length} grupos</p>

      <select value={group} onChange={(e) => setGroup(e.target.value)}>
        <option value="">Todos los grupos</option>
        {data.groups.map((g) => <option key={g.token}>{g.name}</option>)}
      </select>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Lugar</th>
              <th>Estudiante</th>
              <th className="hide-mobile">Grupo</th>
              <th>Avance</th>
              <th>Puntos</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => (
              <tr key={s.token}>
                <td className="rank"><RankBadge rank={s.rank} /></td>
                <td>
                  <Link to={`/s/${s.token}`} className="name"><Avatar name={s.name} />{s.name}</Link>
                  <Link to={`/g/${s.group_token}`} className="chip chip-mobile">{s.group}</Link>
                </td>
                <td className="hide-mobile">
                  <Link to={`/g/${s.group_token}`} className="chip">{s.group}</Link>
                </td>
                <td><ProgressBar done={s.done} total={s.total} /></td>
                <td className="points">{s.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}