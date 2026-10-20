import { useState } from 'react'
import { Pencil, Trash2, Save, X, ExternalLink, UserPlus } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { groupLink } from '../../lib/links'
import CopyButton from './CopyButton'
import StudentRow from './StudentRow'

export default function GroupCard({ group, onChange }) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(group.name)
  const [points, setPoints] = useState(group.pts_per_activity)
  const [newNames, setNewNames] = useState('')
  const [error, setError] = useState('')

  async function saveGroup() {
    const clean = name.trim()
    if (!clean) return
    const { error } = await supabase
      .from('groups')
      .update({ name: clean, pts_per_activity: Number(points) || 100 })
      .eq('id', group.id)
    if (error) {
      setError(error.code === '23505' ? 'Ya existe un grupo con ese nombre' : error.message)
    } else {
      setEditing(false)
      setError('')
      onChange()
    }
  }

  async function removeGroup() {
    const ok = window.confirm(
      `¿Eliminar el grupo "${group.name}"?\n\nSe borran sus ${group.students.length} estudiantes, sus temas y todo el avance. No se puede deshacer.`
    )
    if (!ok) return
    const { error } = await supabase.from('groups').delete().eq('id', group.id)
    if (error) setError(error.message)
    else onChange()
  }

  async function addStudents() {
    const names = [...new Set(newNames.split('\n').map((n) => n.trim()).filter(Boolean))]
    if (names.length === 0) return
    const { error } = await supabase
      .from('students')
      .insert(names.map((n) => ({ group_id: group.id, name: n })))
    if (error) {
      setError(error.code === '23505' ? 'Alguno de esos nombres ya existe en este grupo' : error.message)
    } else {
      setNewNames('')
      setError('')
      onChange()
    }
  }

  return (
    <section className="admin-card">
      <div className="admin-card-head">
        {editing ? (
          <>
            <input value={name} onChange={(e) => setName(e.target.value)} aria-label="Nombre del grupo" />
            <label className="inline-label">
              Puntos por actividad
              <input type="number" min="1" value={points} onChange={(e) => setPoints(e.target.value)} />
            </label>
            <button onClick={saveGroup}><Save size={15} />Guardar</button>
            <button className="btn-link" onClick={() => { setEditing(false); setName(group.name); setPoints(group.pts_per_activity) }}>
              <X size={15} />Cancelar
            </button>
          </>
        ) : (
          <>
            <h3>{group.name}</h3>
            <small>{group.pts_per_activity} puntos por actividad</small>
            <button className="btn-link" onClick={() => setEditing(true)}><Pencil size={15} />Editar</button>
          </>
        )}
      </div>

      <div className="admin-card-head">
        <CopyButton text={groupLink(group.token)} label="Copiar link del grupo" />
        <a className="btn-link" href={groupLink(group.token)} target="_blank" rel="noreferrer">
          <ExternalLink size={15} />Ver página pública
        </a>
        <button className="btn-link danger" onClick={removeGroup}><Trash2 size={15} />Eliminar grupo</button>
      </div>

      <h4>Estudiantes ({group.students.length})</h4>
      <ul className="student-list">
        {group.students.map((s) => (
          <StudentRow key={s.id} student={s} onChange={onChange} />
        ))}
      </ul>

      <textarea
        placeholder={'Agregar estudiantes: un nombre por línea'}
        value={newNames}
        onChange={(e) => setNewNames(e.target.value)}
      />
      <button onClick={addStudents}><UserPlus size={15} />Agregar</button>

      {error && <p className="error">{error}</p>}
    </section>
  )
}