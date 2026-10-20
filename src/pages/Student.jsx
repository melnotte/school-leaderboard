import { useParams } from 'react-router-dom'

export default function Student() {
  const { token } = useParams()
  return <h1>Estudiante {token}</h1>
}