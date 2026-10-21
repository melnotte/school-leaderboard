import { Check, CheckCheck } from 'lucide-react'
import { formatDate } from '../../lib/format'
import { currentModuleIndex } from '../../lib/modules'
import Avatar from '../Avatar'

export default function ProgressMatrix({ modules, students, done, onToggle, onToggleColumn }) {
  const flat = modules.flatMap((m) => m.activities.map((a, i) => ({ ...a, first: i === 0 })))
  const key = (studentId, activityId) => `${studentId}:${activityId}`
  const current = currentModuleIndex(
    modules,
    (a) => students.length > 0 && students.every((s) => key(s.id, a.id) in done)
  )

  return (
    <div className="card">
      <table className="matrix">
        <thead>
          <tr>
            <th className="sticky" rowSpan={3}>Estudiante</th>
            {modules.map((m, i) =>
              m.activities.length > 0 && (
                <th key={m.id} colSpan={m.activities.length} className={`mod${i === current ? ' current' : ''}`}>
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
          <tr>
            {flat.map((a) => (
              <th key={a.id} className={`all${a.first ? ' first' : ''}`}>
                <button type="button" className="btn-link" onClick={() => onToggleColumn(a.id)}
                  title="Marcar o desmarcar a todo el grupo" aria-label={`Marcar a todos: ${a.name}`}>
                  <CheckCheck size={15} />
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {students.map((s) => {
            const count = flat.filter((a) => key(s.id, a.id) in done).length
            return (
              <tr key={s.id}>
                <td className="sticky">
                  <div className="student-cell">
                    <Avatar name={s.name} />
                    <div>
                      <span className="name-text">{s.name}</span>
                      <small>{count} de {flat.length}</small>
                    </div>
                  </div>
                </td>
                {flat.map((a) => {
                  const k = key(s.id, a.id)
                  const on = k in done
                  return (
                    <td key={a.id} className={`center${a.first ? ' first' : ''}`}>
                      <button
                        type="button"
                        className={`cell${on ? ' on' : ''}`}
                        onClick={() => onToggle(s.id, a.id)}
                        aria-pressed={on}
                        aria-label={`${s.name}: ${a.name}`}
                        title={on ? `Completada el ${formatDate(done[k])}` : 'Pendiente'}
                      >
                        {on && <Check size={16} />}
                      </button>
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}