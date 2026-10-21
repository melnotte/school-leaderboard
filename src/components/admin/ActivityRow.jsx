import { useState } from 'react'
import { ArrowUp, ArrowDown, Pencil, Trash2, Save, X } from 'lucide-react'
import { supabase } from '../../lib/supabase'

export default function ActivityRow({ activity, index, count, checked, onToggle, onMove, onChange }) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(activity.name)
  const [error, setError] = useState('')

  async function save() {
    const clean = name.trim()
    if (!clean) return
    const { error } = await supabase.from('activities').update({ name: clean }).eq('id', activity.id)
    if (error) setError(error.message)
    else { setEditing(false); setError(''); onChange() }
  }

  async function remove() {
    if (!window.confirm(`¿Eliminar "${activity.name}"?\n\nTambién se borra el avance marcado en esta actividad.`)) return
    const { error } = await supabase.from('activities').delete().eq('id', activity.id)
    if (error) setError(error.message)
    else onChange()
  }

  return (
    <li>
      <input
        type="checkbox"
        checked={checked}
        onChange={() => onToggle(activity.id)}
        aria-label={`Seleccionar ${activity.name}`}
      />
      <span className="act-index">{index + 1}</span>

      {editing ? (
        <input
          className="grow"
          value={name}
          autoFocus
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && save()}
        />
      ) : (
        <span className="grow">{activity.name}</span>
      )}

      {editing ? (
        <>
          <button onClick={save}><Save size={15} />Guardar</button>
          <button className="btn-link" onClick={() => { setEditing(false); setName(activity.name) }}>
            <X size={15} />Cancelar
          </button>
        </>
      ) : (
        <>
          <button className="btn-link" onClick={() => onMove(index, -1)} disabled={index === 0} aria-label="Subir">
            <ArrowUp size={15} />
          </button>
          <button className="btn-link" onClick={() => onMove(index, 1)} disabled={index === count - 1} aria-label="Bajar">
            <ArrowDown size={15} />
          </button>
          <button className="btn-link" onClick={() => setEditing(true)} aria-label="Renombrar">
            <Pencil size={15} />
          </button>
          <button className="btn-link danger" onClick={remove} aria-label="Eliminar">
            <Trash2 size={15} />
          </button>
        </>
      )}
      {error && <p className="error full">{error}</p>}
    </li>
  )
}