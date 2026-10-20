// Índice del primer tema que todavía tiene actividades pendientes.
// Devuelve -1 si todos los temas están terminados.
export function currentModuleIndex(modules, isDone) {
  return modules.findIndex((m) => m.activities.some((a) => !isDone(a)))
}

// Estado de un tema según cuál es el actual: terminado, actual o próximo.
export function moduleStatus(index, current) {
  if (current === -1 || index < current) return 'done'
  return index === current ? 'current' : 'next'
}