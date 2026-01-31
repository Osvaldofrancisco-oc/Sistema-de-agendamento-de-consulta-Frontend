import { useEffect, useState } from 'react'
import api from '../../api/api'
import { useAuth } from '../../auth/useAuth'
import { useNavigate } from 'react-router-dom'

function Medico() {
  const [consultas, setConsultas] = useState([])
  const [loading, setLoading] = useState(true)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  console.log('Usuário logado:', user)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  useEffect(() => {
  const fetchConsultas = async () => {
    try {
      const response = await api.get('/consultas')

      console.log('Resposta completa:', response.data)

      setConsultas(response.data.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  fetchConsultas()
}, [])


  if (loading) return <p>Carregando consultas...</p>

  return (
    <div>
      <div>
        <h1>Bem-vindo, Médico!</h1>
        <button onClick={handleLogout}>Logout</button>
        
        <p>Aqui estão suas consultas agendadas:</p>
      </div>
      <h2>Consultas Agendadas</h2>

      {consultas.length === 0 && <p>Nenhuma consulta.</p>}

      <ul>
        {consultas.map((consulta) => (
          <li key={consulta._id}>
            <strong>Paciente:</strong> {consulta.paciente?.nome} <br />
            <strong>Data:</strong>{' '}
            {new Date(consulta.data).toLocaleString()} <br />
            <strong>Status:</strong> {consulta.status || 'Pendente'}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Medico
