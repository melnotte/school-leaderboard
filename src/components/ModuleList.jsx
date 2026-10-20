import { Check, Flag, Clock } from 'lucide-react'
import { moduleStatus } from '../lib/modules'

const STATUS = {
  done: { label: 'Terminado', icon: Check },
  current: { label: 'Tema actual', icon: Flag },
  next: { label: 'Próximo tema', icon: Clock },
}

export default function ModuleList({ modules, students, current }) {
  return (
    <div className="modules">
      {modules.map((m, i) => {
        const key = moduleStatus(i, current)
        const { label, icon: Icon } = STATUS[key]
        const n = m.activities.length
        const counts = m.activities.map((a) => students.filter((s) => s.completed.includes(a.id)).length)
        const checks = counts.reduce((sum, c) => sum + c, 0)
        const p = n && students.length ? Math.round((checks / (n * students.length)) * 100) : 0

        return (
          <section key={m.id} className={`module ${key}`}>
            <div className="module-head">
              <h3>{m.name}</h3>
              <span className={`status ${key}`}><Icon size={13} />{label}</span>
              {n > 0 && <small>Avance del grupo: {p}%</small>}
            </div>
            {n === 0 ? (
              <small>Este tema aún no tiene actividades.</small>
            ) : (
              <ul className="module-acts">
                {m.activities.map((a, j) => (
                  <li key={a.id}>
                    <span>{a.name}</span>
                    <small>{counts[j]} de {students.length}</small>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )
      })}
    </div>
  )
}