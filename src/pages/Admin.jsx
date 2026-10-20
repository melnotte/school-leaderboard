import { useEffect, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { LogOut, Users, Database } from 'lucide-react'
import { supabase } from '../lib/supabase'
import AdminLogin from '../components/admin/AdminLogin'

export default function Admin() {
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  if (session === undefined) return <p className="msg">Cargando…</p>
  if (!session) return <AdminLogin />

  return (
    <>
      <div className="admin-bar">
        <h1>Administración</h1>
        <button className="btn-link" onClick={() => supabase.auth.signOut()}>
          <LogOut size={15} />Cerrar sesión
        </button>
      </div>
      <p className="sub">{session.user.email}</p>

      <nav className="tabs">
        <NavLink to="/admin/groups"><Users size={16} />Grupos y estudiantes</NavLink>
        <NavLink to="/admin/backup"><Database size={16} />Respaldo CSV</NavLink>
      </nav>

      <Outlet />
    </>
  )
}