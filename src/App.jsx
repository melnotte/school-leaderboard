import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Global from './pages/Global'
import Group from './pages/Group'
import Student from './pages/Student'
import Admin from './pages/Admin'
import GroupsTab from './pages/admin/GroupsTab'
import BackupTab from './pages/admin/BackupTab'
import ModulesTab from './pages/admin/ModulesTab'
import ProgressTab from './pages/admin/ProgressTab'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Global />} />
        <Route path="/g/:token" element={<Group />} />
        <Route path="/s/:token" element={<Student />} />
        <Route path="/admin" element={<Admin />}>
          <Route index element={<Navigate to="progress" replace />} />
          <Route path="progress" element={<ProgressTab />} />
          <Route path="modules" element={<ModulesTab />} />
          <Route path="groups" element={<GroupsTab />} />
          <Route path="backup" element={<BackupTab />} />
        </Route>
      </Route>
    </Routes>
  )
}