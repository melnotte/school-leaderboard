import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useGroups } from '../../lib/useGroups'
import ProgressMatrix from '../../components/admin/ProgressMatrix'

const today = () => new Date().toLocaleDateString('en-CA', { timeZone: 'America/Cancun' })

export default function ProgressTab() {
  const { groups, groupId, setGroupId } = useGroups()
  const [data, setData] = useState(null) // { students, modules }
  const [done, setDone] = useState({})
  const [date, setDate] = useState(today())
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    if (!groupId) return
    const [st, md] = await Promise.all([
      supabase.from('students').select('id, name').eq('group_id', groupId).order('name'),
      supabase
        .from('modules')
        .select('id, name, pos, activities(id, name, pos)')
        .eq('group_id', groupId)
        .order('pos')
        .order('pos', { referencedTable: 'activities' }),
    ])
    if (st.error || md.error) return setError((st.error || md.error).message)

    const map = {}
    const ids = st.data.map((s) => s.id)
    if (ids.length) {
      const pr = await supabase
        .from('progress')
        .select('student_id, activity_id, completed_on')
        .in('student_id', ids)
      if (pr.error) return setError(pr.error.message)
      pr.data.forEach((p) => { map[`${p.student_id}:${p.activity_id}`] = p.completed_on })
    }
    setError('')
    setData({ students: st.data, modules: md.data })
    setDone(map)
  }, [groupId])

  useEffect(() => {
    setData(null)
    load()
  }, [load])

  async function toggle(studentId, activityId) {
    const k = `${studentId}:${activityId}`
    const had = k in done

    setDone((prev) => {
      const next = { ...prev }
      if (had) delete next[k]
      else next[k] = date
      return next
    })

    const { error } = had
      ? await supabase.from('progress').delete().eq('student_id', studentId).eq('activity_id', activityId)
      : await supabase.from('progress').insert({ student_id: studentId, activity_id: activityId, completed_on: date })

    if (error) {
      setError('No se pudo guardar: ' + error.message)
      load()
    }
  }

  async function toggleColumn(activityId) {
    const ids = data.students.map((s) => s.id)
    const missing = ids.filter((id) => !(`${id}:${activityId}` in done))

    if (missing.length > 0) {
      const { error } = await supabase
        .from('progress')
        .insert(missing.map((id) => ({ student_id: id, activity_id: activityId, completed_on: date })))
      if (error) return setError('No se pudo guardar: ' + error.message)
      setDone((prev) => {
        const next = { ...prev }
        missing.forEach((id) => { next[`${id}:${activityId}`] = date })
        return next
      })
    } else {
      const { error } = await supabase
        .from('progress').delete().eq('activity_id', activityId).in('student_id', ids)
      if (error) return setError('No se pudo guardar: ' + error.message)
      setDone((prev) => {
        const next = { ...prev }
        ids.forEach((id) => { delete next[`${id}:${activityId}`] })
        return next
      })
    }
  }

  return (
    <>
      <div className="inline-form">
        <label className="inline-label">
          Grupo
          <select value={groupId} onChange={(e) => setGroupId(e.target.value)}>
            {groups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
        </label>
        <label className="inline-label">
          Fecha de lo que marques
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
      </div>
      <p className="sub">
        Un clic marca o desmarca la actividad. Se guarda al instante. Cambia la fecha para registrar una clase anterior.
      </p>
      {error && <p className="error">{error}</p>}

      {!data ? (
        <p className="msg">Cargando…</p>
      ) : data.students.length === 0 ? (
        <p className="msg">Este grupo no tiene estudiantes. Agrégalos en "Grupos y estudiantes".</p>
      ) : data.modules.every((m) => m.activities.length === 0) ? (
        <p className="msg">Este grupo no tiene actividades. Créalas en "Temas y actividades".</p>
      ) : (
        <ProgressMatrix
          modules={data.modules}
          students={data.students}
          done={done}
          onToggle={toggle}
          onToggleColumn={toggleColumn}
        />
      )}
    </>
  )
}