import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ChevronLeft, Star, Users, School, Target, Check, Circle, Flag, Clock } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { formatDate, percent } from '../lib/format'
import { currentModuleIndex, moduleStatus } from '../lib/modules'
import Avatar from '../components/Avatar'
import StatCard from '../components/StatCard'
import ProgressChart from '../components/ProgressChart'

const STATUS = {
  done: { label: 'Terminado', icon: Check },
  current: { label: 'Tema actual', icon: Flag },
  next: { label: 'Próximo tema', icon: Clock },
}

export default function Student() {
  const { token } = useParams()
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    setData(null)
    supabase.rpc('get_student', { p_token: token }).then(({ data, error }) => {
      if (error) setError(error.message)
      else setData(data)
    })
  }, [token])

  if (error) return <p className="msg">No se pudo cargar: {error}</p>
  if (!data) return <p className="msg">Cargando…</p>
  if (!data.name) return <p className="msg">No encontramos este dashboard. Revisa el link.</p>

  const all = data.modules.flatMap((m) => m.activities)
  const total = all.length
  const number = {}
  all.forEach((a, i) => { number[a.id] = i + 1 })
  const nextId = all.find((a) => !a.done)?.id
  const current = currentModuleIndex(data.modules, (a) => a.done)
  const lastDate = data.history.at(-1)?.date

  return (
    <>
      <Link to={`/g/${data.group_token}`} className="back">
        <ChevronLeft size={16} />Volver a {data.group}
      </Link>

      <h1 className="student-title"><Avatar name={data.name} large />{data.name}</h1>
      <p className="sub">
        <Link to={`/g/${data.group_token}`} className="chip">{data.group}</Link>
        {lastDate && <span className="date">Última actividad completada el {formatDate(lastDate)}</span>}
      </p>

      <div className="stats">
        <StatCard icon={Star} value={data.points} label="Puntos" />
        <StatCard icon={Users} value={`${data.rank}° de ${data.of}`} label="Lugar en su grupo" />
        <StatCard icon={School} value={`${data.global_rank}° de ${data.global_of}`} label="Lugar en la escuela" />
        <StatCard icon={Target} value={`${percent(data.done, total)}%`} label={`${data.done} de ${total} actividades`} />
      </div>

      <h2>Evolución de puntos</h2>
      <div className="card padded"><ProgressChart history={data.history} /></div>

      <h2>Su camino</h2>
      <div className="modules">
        {data.modules.map((m, i) => {
          const key = moduleStatus(i, current)
          const { label, icon: Icon } = STATUS[key]
          const doneCount = m.activities.filter((a) => a.done).length
          return (
            <section key={m.id} className={`module ${key}`}>
              <div className="module-head">
                <h3>{m.name}</h3>
                <span className={`status ${key}`}><Icon size={13} />{label}</span>
                <small>{doneCount} de {m.activities.length} actividades</small>
              </div>
              <ol className="path">
                {m.activities.map((a) => {
                  const state = a.done ? 'done' : a.id === nextId ? 'next' : 'todo'
                  return (
                    <li key={a.id} className={`path-item ${state}`}>
                      <span className="path-icon">
                        {state === 'done' && <Check size={16} />}
                        {state === 'next' && <Flag size={16} />}
                        {state === 'todo' && <Circle size={14} />}
                      </span>
                      <span className="path-num">{number[a.id]}</span>
                      <span className="path-name">{a.name}</span>
                      <span className="path-label">
                        {state === 'done' ? formatDate(a.date) : state === 'next' ? 'Sigue' : 'Pendiente'}
                      </span>
                    </li>
                  )
                })}
              </ol>
            </section>
          )
        })}
      </div>
    </>
  )
}