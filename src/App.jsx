import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Global from './pages/Global'
import Group from './pages/Group'
import Student from './pages/Student'
import Admin from './pages/Admin'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Global />} />
        <Route path="/g/:token" element={<Group />} />
        <Route path="/s/:token" element={<Student />} />
        <Route path="/admin" element={<Admin />} />
      </Route>
    </Routes>
  )
}