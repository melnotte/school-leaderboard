import { useEffect, useState } from 'react'
import { supabase } from './supabase'

const KEY = 'admin.groupId'

export function useGroups() {
  const [groups, setGroups] = useState([])
  const [groupId, setGroupIdState] = useState(() => localStorage.getItem(KEY) || '')

  useEffect(() => {
    supabase.from('groups').select('id, name').order('name').then(({ data }) => {
      const list = data || []
      setGroups(list)
      // Si el grupo recordado ya no existe, usa el primero
      setGroupIdState((current) => (list.some((g) => g.id === current) ? current : list[0]?.id ?? ''))
    })
  }, [])

  const setGroupId = (id) => {
    localStorage.setItem(KEY, id)
    setGroupIdState(id)
  }

  return { groups, groupId, setGroupId }
}