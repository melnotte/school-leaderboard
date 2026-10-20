import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ChevronLeft, LayoutDashboard, Check } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { formatDate, percent } from '../lib/format'
import Avatar from '../components/Avatar'
import RankBadge from '../components/RankBadge'
import Mountain from '../components/Mountain'

export default function Group() {
  const { token } = useParams()
  const [group, setGroup] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    setGroup(null)
    supabase.rpc('get_group', { p_token: token }).then(({ data, error }) => {
      if (error) setError(error.message)
      else setGroup(data)
    })
  }, [token])

  if (error) return <p className="msg">No se pudo cargar: {error}</p>
  if (!group) return <p className="msg">Cargando…</p>
  if (!group.name) return <p className="msg">No encontramos este grupo. Revisa el link.</p>

  const total = group.activities.length

  return (
    <>
      <Link to="/" className="back"><ChevronLeft size={16} />Ranking de la escuela</Link>
      <h1>{group.name}</h1>
      <p className="sub">Avance al {formatDate(group.date)}. La meta es la bandera en la cima.</p>

      <div className="card padded"><Mountain students={group.students} total={total} /></div>

      <h2>Ranking y actividades</h2>
      <p className="sub">Un check marca la actividad completada. El círculo vacío es una actividad pendiente.</p>

      <div className="card">
        <table className="matrix">
          <thead>
            <tr>
              <th className="sticky">Estudiante</th>
              <th className="center">Puntos</th>
              <th></th>
              {group.activities.map((a, i) => (
                <th key={i} className="col"><span>{i + 1}. {a}</span></th>
              ))}
            </tr>
          </thead>
          <tbody>
            {group.students.map((s) => (
              <tr key={s.name}>
                <td className="sticky">
                  <div className="student-cell">
                    <RankBadge rank={s.rank} />
                    <Avatar name={s.name} />
                    <div>
                      <span className="name-text">{s.name}</span>
                      <small>{s.done} de {total} ({percent(s.done, total)}%)</small>
                    </div>
                  </div>
                </td>
                <td className="points center">{s.points}</td>
                <td>
                  {s.token && (
                    <Link to={`/s/${s.token}`} className="btn-link">
                      <LayoutDashboard size={15} />Dashboard
                    </Link>
                  )}
                </td>
                {s.checks.map((c, i) => (
                  <td key={i} className="center">
                    {c ? <Check size={18} className="done" /> : <span className="pending" />}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td className="sticky">Lo completaron</td>
              <td></td>
              <td></td>
              {group.activities.map((_, i) => (
                <td key={i} className="center">
                  <small>{group.students.filter((s) => s.checks[i]).length}</small>
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  )
}