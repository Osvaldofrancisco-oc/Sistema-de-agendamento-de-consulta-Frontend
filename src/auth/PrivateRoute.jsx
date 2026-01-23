import { Navigate } from 'react-router-dom'
import { useAuth } from './useAuth'

export default function PrivateRoute({ children, roles }) {
  const { user, loading } = useAuth()

  // 1️⃣ Espera carregar
  if (loading) {
    return <p>Carregando...logado</p>

  }

  console.log('USER:', user)


  // 2️⃣ NÃO logado
  if (!user) {
    {
      console.log('Usuário não autenticado, redirecionando...')
    }
    return <Navigate to="/login" replace />
  }

  // 3️⃣ Role inválido
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/login" replace />
  }

  // 4️⃣ Autorizado
  return children
}
