import { useState } from 'react'
import { Pencil, Trash2, Save, X } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { studentLink } from '../../lib/links'
import Avatar from '../Avatar'
import CopyButton from './CopyButton'

export default function StudentRow({ student, onChange }) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(student.name)
  const [error, setError] = useState('')

  async function save() {
    const clean = name.trim()
    if (!clean) return
    const { error } = await supabase.from('students').update({ name: clean }).eq('id', student.id)
    if (error) {
      setError(error.code === '23505' ? 'Ya hay un estudiante con ese nombre en el grupo' : error.message)
    } else {
      setEditing(false)
      setError('')
      onChange()
    }
  }

  async function remove() {
    if (!window.confirm(`¿Eliminar a ${student.name}? También se borra todo su avance.`)) return
    const { error } = await supabase.from('students').delete().eq('id', student.id)
    if (error) setError(error.message)
    else onChange()
  }

  return (
    <li>
      <div className="grow">
        <Avatar name={student.name} />
        {editing ? (
          <input
            value={name}
            autoFocus
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && save()}
          />
        ) : (
          student.name
        )}
      </div>

      {editing ? (
        <>
          <button onClick={save}><Save size={15} />Guardar</button>
          <button className="btn-link" onClick={() => { setEditing(false); setName(student.name); setError('') }}>
            <X size={15} />Cancelar
          </button>
        </>
      ) : (
        <>
          <CopyButton text={studentLink(student.token)} label="Copiar link" />
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