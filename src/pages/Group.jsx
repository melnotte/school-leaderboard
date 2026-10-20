import { useParams } from 'react-router-dom'

export default function Group() {
  const { token } = useParams()
  return <h1>Grupo {token}</h1>
}