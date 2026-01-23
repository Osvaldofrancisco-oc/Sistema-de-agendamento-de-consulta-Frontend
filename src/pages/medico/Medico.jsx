import { useAuth } from '../../auth/useAuth'
import { useNavigate } from 'react-router-dom'

function Medico() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }
  
  return (
    <div>
      <h2>Área do Médico</h2>
      <p>Bem-vindo, {user?.nome}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Medico
