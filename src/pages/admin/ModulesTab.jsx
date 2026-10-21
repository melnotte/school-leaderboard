import { useCallback, useEffect, useState } from 'react'
import { Plus, MoveRight } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { reorder, savePositions } from '../../lib/order'
import ModuleCard from '../../components/admin/ModuleCard'

export default function ModulesTab() {
  const [groups, setGroups] = useState([])
  const [groupId, setGroupId] = useState('')
  const [modules, setModules] = useState(null)
  const [selected, setSelected] = useState(new Set())
  const [target, setTarget] = useState('')
  const [newName, setNewName] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.from('groups').select('id, name').order('name').then(({ data }) => {
      setGroups(data || [])
      if (data?.length) setGroupId((current) => current || data[0].id)
    })
  }, [])

  const load = useCallback(async () => {
    if (!groupId) return
    const { data, error } = await supabase
      .from('modules')
      .select('id, name, pos, activities(id, name, pos)')
      .eq('group_id', groupId)
      .order('pos')
      .order('pos', { referencedTable: 'activities' })
    if (error) setError(error.message)
    else setModules(data)
  }, [groupId])

  useEffect(() => {
    setModules(null)
    setSelected(new Set())
    load()
  }, [load])

  function toggle(id) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  async function addModule(e) {
    e.preventDefault()
    const clean = newName.trim()
    if (!clean) return
    const pos = (modules ?? []).reduce((max, m) => Math.max(max, m.pos), 0) + 1
    const { error } = await supabase.from('modules').insert({ group_id: groupId, name: clean, pos })
    if (error) setError(error.message)
    else { setNewName(''); setError(''); load() }
  }

  async function moveModule(i, delta) {
    const err = await savePositions('modules', reorder(modules, i, delta))
    if (err) setError(err.message)
    else load()
  }

  // Mueve las actividades seleccionadas al final del tema elegido.
  // El avance de los estudiantes se conserva: está ligado a la actividad, no al tema.
  async function moveSelected() {
    if (!target || selected.size === 0) return
    const dest = modules.find((m) => m.id === target)
    const moving = modules.flatMap((m) => m.activities).filter((a) => selected.has(a.id))
    const start = dest.activities.reduce((max, a) => Math.max(max, a.pos), 0)
    const results = await Promise.all(
      moving.map((a, i) =>
        supabase.from('activities').update({ module_id: target, pos: start + i + 1 }).eq('id', a.id)
      )
    )
    const err = results.find((r) => r.error)?.error
    if (err) setError(err.message)
    else { setSelected(new Set()); setTarget(''); setError(''); load() }
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
      </div>
      <p className="sub">
        El tema actual es el primero que todavía tiene actividades pendientes.
      </p>

      <form onSubmit={addModule} className="inline-form">
        <input placeholder="Nombre del nuevo tema" value={newName} onChange={(e) => setNewName(e.target.value)} />
        <button type="submit"><Plus size={15} />Agregar tema</button>
      </form>
      {error && <p className="error">{error}</p>}

      {selected.size > 0 && (
        <div className="move-bar">
          <span>{selected.size} seleccionadas</span>
          <select value={target} onChange={(e) => setTarget(e.target.value)}>
            <option value="">Mover a…</option>
            {modules.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
          <button onClick={moveSelected} disabled={!target}><MoveRight size={15} />Mover</button>
          <button className="btn-link" onClick={() => setSelected(new Set())}>Quitar selección</button>
        </div>
      )}

      {!modules ? (
        <p className="msg">Cargando…</p>
      ) : modules.length === 0 ? (
        <p className="msg">Este grupo todavía no tiene temas.</p>
      ) : (
        modules.map((m, i) => (
          <ModuleCard
            key={m.id}
            mod={m}
            index={i}
            count={modules.length}
            selected={selected}
            onToggle={toggle}
            onMove={moveModule}
            onChange={load}
          />
        ))
      )}
    </>
  )
}