import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import CsvUploader from '../components/CsvUploader'

export default function Admin() {
  const [session, setSession] = useState(undefined)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  async function login(e) {
    e.preventDefault()
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError('Correo o contraseña incorrectos')
  }

  if (session === undefined) return <p>Cargando…</p>

  if (!session) {
    return (
      <form onSubmit={login}>
        <h1>Administración</h1>
        <input type="email" placeholder="Correo" value={email}
          onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Contraseña" value={password}
          onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Entrar</button>
        {error && <p>{error}</p>}
      </form>
    )
  }

  return (
    <div>
      <h1>Administración</h1>
      <p>Sesión iniciada como {session.user.email}</p>
      <CsvUploader />
      <button onClick={() => supabase.auth.signOut()}>Cerrar sesión</button>
    </div>
  )
}