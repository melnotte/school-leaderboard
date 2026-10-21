import { useState } from 'react'
import { ArrowUp, ArrowDown, Pencil, Trash2, Save, X, Plus } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { reorder, savePositions } from '../../lib/order'
import ActivityRow from './ActivityRow'

export default function ModuleCard({ mod, index, count, selected, onToggle, onMove, onChange }) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(mod.name)
  const [newNames, setNewNames] = useState('')
  const [error, setError] = useState('')
  const acts = mod.activities

  async function saveName() {
    const clean = name.trim()
    if (!clean) return
    const { error } = await supabase.from('modules').update({ name: clean }).eq('id', mod.id)
    if (error) setError(error.message)
    else { setEditing(false); setError(''); onChange() }
  }

  async function remove() {
    const ok = window.confirm(
      `¿Eliminar el tema "${mod.name}"?\n\nSe borran sus ${acts.length} actividades y el avance marcado en ellas. No se puede deshacer.`
    )
    if (!ok) return
    const { error } = await supabase.from('modules').delete().eq('id', mod.id)
    if (error) setError(error.message)
    else onChange()
  }

  async function addActivities() {
    const names = newNames.split('\n').map((n) => n.trim()).filter(Boolean)
    if (names.length === 0) return
    const start = acts.reduce((max, a) => Math.max(max, a.pos), 0)
    const { error } = await supabase
      .from('activities')
      .insert(names.map((n, i) => ({ module_id: mod.id, name: n, pos: start + i + 1 })))
    if (error) setError(error.message)
    else { setNewNames(''); setError(''); onChange() }
  }

  async function moveActivity(i, delta) {
    const err = await savePositions('activities', reorder(acts, i, delta))
    if (err) setError(err.message)
    else onChange()
  }

  return (
    <section className="admin-card">
      <div className="admin-card-head">
        {editing ? (
          <>
            <input value={name} autoFocus onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && saveName()} aria-label="Nombre del tema" />
            <button onClick={saveName}><Save size={15} />Guardar</button>
            <button className="btn-link" onClick={() => { setEditing(false); setName(mod.name) }}>
              <X size={15} />Cancelar
            </button>
          </>
        ) : (
          <>
            <h3>{index + 1}. {mod.name}</h3>
            <small>{acts.length} actividades</small>
            <button className="btn-link" onClick={() => onMove(index, -1)} disabled={index === 0} aria-label="Subir tema">
              <ArrowUp size={15} />
            </button>
            <button className="btn-link" onClick={() => onMove(index, 1)} disabled={index === count - 1} aria-label="Bajar tema">
              <ArrowDown size={15} />
            </button>
            <button className="btn-link" onClick={() => setEditing(true)}><Pencil size={15} />Renombrar</button>
            <button className="btn-link danger" onClick={remove}><Trash2 size={15} />Eliminar tema</button>
          </>
        )}
      </div>

      <ul className="student-list">
        {acts.map((a, i) => (
          <ActivityRow
            key={a.id}
            activity={a}
            index={i}
            count={acts.length}
            checked={selected.has(a.id)}
            onToggle={onToggle}
            onMove={moveActivity}
            onChange={onChange}
          />
        ))}
      </ul>

      <textarea
        placeholder="Agregar actividades: una por línea"
        value={newNames}
        onChange={(e) => setNewNames(e.target.value)}
      />
      <button onClick={addActivities}><Plus size={15} />Agregar actividades</button>
      {error && <p className="error">{error}</p>}
    </section>
  )
}