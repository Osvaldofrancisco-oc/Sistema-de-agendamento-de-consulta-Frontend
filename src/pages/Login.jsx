import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/api'
import { useAuth } from '../auth/useAuth'

function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [error, setError] = useState('')

  const { login, user, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  // Redireciona automaticamente se já estiver logado
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('Usuário já autenticado, redirecionando...')
      switch(user.role) {
        
        case 'admin': navigate('/admin', { replace: true }); break
        case 'medico': navigate('/medico', { replace: true }); break
        case 'paciente': navigate('/paciente', { replace: true }); break
        default: navigate('/login', { replace: true })
      }
    }
  }, [isAuthenticated, user, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const response = await api.post('/login', { email, senha })
      const { token, user } = response.data

      login(token, user)
      // ✅ NÃO usar navigate aqui, useEffect cuida do redirect
    } catch (err) {
      setError('Email ou senha inválidos')
      console.error(err)
    }
  }

  console.log('LOGIN USER:', user)


  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <br />
        <input type="password" placeholder="Senha" value={senha} onChange={e => setSenha(e.target.value)} required />
        <br />
        <button type="submit">Entrar</button>
      </form>
      {error && <p style={{color:'red'}}>{error}</p>}
    </div>
  )
}

export default Login
