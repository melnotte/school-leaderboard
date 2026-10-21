import { supabase } from './supabase'

// Devuelve una copia de la lista con el elemento `index` movido `delta` lugares.
export function reorder(list, index, delta) {
  const target = index + delta
  if (target < 0 || target >= list.length) return list
  const copy = [...list]
  ;[copy[index], copy[target]] = [copy[target], copy[index]]
  return copy
}

// Guarda las posiciones 1..n en la tabla, solo de los elementos que cambiaron.
// Devuelve el error si hubo alguno, o null.
export async function savePositions(table, list) {
  const changes = list
    .map((item, i) => ({ item, pos: i + 1 }))
    .filter(({ item, pos }) => item.pos !== pos)
  const results = await Promise.all(
    changes.map(({ item, pos }) => supabase.from(table).update({ pos }).eq('id', item.id))
  )
  return results.find((r) => r.error)?.error ?? null
}