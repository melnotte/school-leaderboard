import { useCallback, useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import GroupCard from '../../components/admin/GroupCard'

export default function GroupsTab() {
  const [groups, setGroups] = useState(null)
  const [error, setError] = useState('')
  const [name, setName] = useState('')
  const [points, setPoints] = useState(100)

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from('groups')
      .select('id, name, token, pts_per_activity, students(id, name, token)')
      .order('name')
      .order('name', { referencedTable: 'students' })
    if (error) setError(error.message)
    else setGroups(data)
  }, [])

  useEffect(() => { load() }, [load])

  async function createGroup(e) {
    e.preventDefault()
    const clean = name.trim()
    if (!clean) return
    const { error } = await supabase
      .from('groups')
      .insert({ name: clean, pts_per_activity: Number(points) || 100 })
    if (error) {
      setError(error.code === '23505' ? 'Ya existe un grupo con ese nombre' : error.message)
    } else {
      setName('')
      setError('')
      load()
    }
  }

  return (
    <>
      <h2>Nuevo grupo</h2>
      <form onSubmit={createGroup} className="inline-form">
        <input placeholder="Nombre del grupo" value={name} onChange={(e) => setName(e.target.value)} />
        <label className="inline-label">
          Puntos por actividad
          <input type="number" min="1" value={points} onChange={(e) => setPoints(e.target.value)} />
        </label>
        <button type="submit"><Plus size={15} />Crear grupo</button>
      </form>
      {error && <p className="error">{error}</p>}

      <h2>Grupos</h2>
      {!groups ? (
        <p className="msg">Cargando…</p>
      ) : (
        groups.map((g) => <GroupCard key={g.id} group={g} onChange={load} />)
      )}
    </>
  )
}