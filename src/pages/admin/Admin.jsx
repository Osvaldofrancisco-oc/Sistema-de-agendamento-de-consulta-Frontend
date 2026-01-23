import { useAuth } from '../../auth/useAuth'
import { useNavigate } from 'react-router-dom'

export default function Admin() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div>
      <h1>Área do Admin</h1>

      <p>Bem-vindo, {user.nome}</p>

      <button onClick={handleLogout}>logout</button>
    </div>
  )
}
