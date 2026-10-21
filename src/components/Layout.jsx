import { Link, Outlet } from 'react-router-dom'
import { Mountain } from 'lucide-react'

export default function Layout() {
  return (
    <>
      <header className="top">
        <Link to="/"><Mountain size={22} />Academy Leaderboard</Link>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  )
}