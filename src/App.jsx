import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './auth/useAuth'
import Login from './pages/Login'
import Admin from './pages/admin/Admin'
import Medico from './pages/medico/Medico'
import Paciente from './pages/paciente/Paciente'
import PrivateRoute from './auth/PrivateRoute'

function App() {
  const { loading } = useAuth()
  if (loading) return <p>Carregando...</p>

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin"element={<PrivateRoute roles={['admin']}><Admin /> </PrivateRoute> }/>
        <Route path="/medico" element={<PrivateRoute roles={['medico']}><Medico /></PrivateRoute>} />
        <Route path="/paciente" element={<PrivateRoute roles={['paciente']}><Paciente /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
