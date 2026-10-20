import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ChevronLeft, LayoutDashboard, Check } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { formatDate, percent } from '../lib/format'
import { currentModuleIndex } from '../lib/modules'
import Avatar from '../components/Avatar'
import RankBadge from '../components/RankBadge'
import Mountain from '../components/Mountain'
import ModuleList from '../components/ModuleList'

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

  const { modules, students } = group
  const flat = modules.flatMap((m) =>
    m.activities.map((a, i) => ({ ...a, first: i === 0 }))
  )
  const total = flat.length
  const current = currentModuleIndex(
    modules,
    (a) => students.length > 0 && students.every((s) => s.completed.includes(a.id))
  )

  return (
    <>
      <Link to="/" className="back"><ChevronLeft size={16} />Ranking de la escuela</Link>
      <h1>{group.name}</h1>
      <p className="sub">
        {group.updated ? `Última actividad registrada el ${formatDate(group.updated)}. ` : ''}
        La meta es la bandera en la cima.
      </p>

      <div className="card padded"><Mountain students={students} total={total} /></div>

      {total === 0 ? (
        <p className="msg">Este grupo aún no tiene temas ni actividades.</p>
      ) : (
        <>
          <h2>Ranking y actividades</h2>
          <p className="sub">Un check marca la actividad completada. El círculo vacío es una actividad pendiente.</p>

          <div className="card">
            <table className="matrix">
              <thead>
                <tr>
                  <th className="sticky" rowSpan={2}>Estudiante</th>
                  <th className="center" rowSpan={2}>Puntos</th>
                  <th rowSpan={2}></th>
                  {modules.map((m, i) =>
                    m.activities.length > 0 && (
                      <th key={m.id} colSpan={m.activities.length}
                        className={`mod${i === current ? ' current' : ''}`}>
                        {m.name}
                      </th>
                    )
                  )}
                </tr>
                <tr>
                  {flat.map((a, i) => (
                    <th key={a.id} className={`col${a.first ? ' first' : ''}`}>
                      <span>{i + 1}. {a.name}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.token}>
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
                      <Link to={`/s/${s.token}`} className="btn-link">
                        <LayoutDashboard size={15} />Dashboard
                      </Link>
                    </td>
                    {flat.map((a) => (
                      <td key={a.id} className={`center${a.first ? ' first' : ''}`}>
                        {s.completed.includes(a.id)
                          ? <Check size={18} className="done" />
                          : <span className="pending" />}
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
                  {flat.map((a) => (
                    <td key={a.id} className={`center${a.first ? ' first' : ''}`}>
                      <small>{students.filter((s) => s.completed.includes(a.id)).length}</small>
                    </td>
                  ))}
                </tr>
              </tfoot>
            </table>
          </div>

          <h2>Temas del curso</h2>
          <ModuleList modules={modules} students={students} current={current} />
        </>
      )}
    </>
  )
}