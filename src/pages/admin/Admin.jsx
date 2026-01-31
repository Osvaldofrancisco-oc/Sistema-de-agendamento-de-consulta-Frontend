import { useEffect, useState } from 'react'
import api from '../../api/api'
import { useAuth } from '../../auth/useAuth'
import { useNavigate } from 'react-router-dom'

function Admin() {
  const [consultas, setConsultas] = useState([])
  const [medicos, setMedicos] = useState([])
  const [pacientes, setPacientes] = useState([])
  const [loading, setLoading] = useState(true)
 
  const [medicoForm, setMedicoForm] = useState({
  nome: '',
  email: '',
  senha: '',
  especialidade: '',
  crm: ''
});

const [pacienteForm, setPacienteForm] = useState({
  nome: '',
  email: '',
  senha: ''
});


const [message, setMessage] = useState('')


  const { logout } = useAuth()
  const navigate = useNavigate()

  // 🔹 Logout simples
  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleChangeM = (e) => {
  setMedicoForm({
    ...medicoForm,
    [e.target.name]: e.target.value
  })
}

const handleChangeP = (e) => {
  setPacienteForm({
    ...pacienteForm,
    [e.target.name]: e.target.value
  })
}

const handleCreateMedico = async (e) => {
  e.preventDefault()
  setMessage('')

  try {
    await api.post('/admin/medico', {
      nome: medicoForm.nome,
      email: medicoForm.email,
      senha: medicoForm.senha,
      especialidade: medicoForm.especialidade,
      crm: medicoForm.crm
    })

    setMessage('✅ Médico criado com sucesso!')
    setMedicoForm({ nome: '', email: '', senha: '', especialidade: '', crm: '' })
  } catch (err) {
    setMessage('❌ Erro ao criar médico')
    console.error(err)
  }
}

const handleCreatePaciente = async (e) => {
  e.preventDefault()
  setMessage('')

  try {
    await api.post('/admin/paciente', {
      nome: pacienteForm.nome,
      email: pacienteForm.email,
      senha: pacienteForm.senha
    })

    setMessage('✅ Paciente criado com sucesso!')
    setPacienteForm({ nome: '', email: '', senha: '' })

  } catch (err) {
    setMessage('❌ Erro ao criar paciente')
    console.error(err)
  }
}

const toggleStatus = async (medicoId) => {
  try {
    const response = await api.put(`/admin/medicos/${medicoId}/status`)

    const medicoAtualizado = response.data.data

    setMedicos((prev) =>
      prev.map((m) =>
        m._id === medicoAtualizado._id ? medicoAtualizado : m
      )
    )
  } catch (err) {
    console.error(err)
    alert('Erro ao alterar status do médico')
  }
}


   // 🔹 Buscar médicos e pacientes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [medicosRes, pacientesRes] = await Promise.all([
          api.get('/admin/medicos'),
          api.get('/admin/pacientes')
        ])

        // console.log('Médicos recebidos:', medicosRes.data.data);
        setMedicos(medicosRes.data.data)
        // console.log('Pacientes recebidos:', pacientesRes.data.data);
        setPacientes(pacientesRes.data.data)
      } catch (err) {
        console.error('Erro ao carregar dados:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])


  // 🔹 Buscar consultas do backend
  useEffect(() => {
    const fetchConsultas = async () => {
      try {
        const response = await api.get('/admin/consultas')
        setConsultas(response.data.data)
      } catch (err) {
        console.error('Erro ao buscar consultas:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchConsultas()
  }, [])

  if (loading) return <p>Carregando consultas...</p>

  return (
    <div>
      <h1>Dashboard do Admin</h1>
      <button onClick={handleLogout}>Logout</button>
      <hr />

    <div>

      {/* 🔹 MÉDICOS */}
      <h2>Médicos</h2>

      {medicos.length === 0 && <p>Nenhum médico cadastrado.</p>}

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Especialidade</th>
            <th>CRM</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {medicos.map((medico) => (
            <tr key={medico._id}>
              <td>{medico.user?.nome}</td>
              <td>{medico.user?.email}</td>
              <td>{medico.especialidade}</td>
              <td>{medico.crm}</td>
              <td>
                <span
                  style={{
                    color: medico.ativo ? 'green' : 'red',
                    fontWeight: 'bold'
                  }}
                >
                  {medico.ativo ? 'Ativo' : 'Inativo'}
                </span>
              </td>
              <td>
                <button onClick={() => toggleStatus(medico._id)}>
                  {medico.ativo ? 'Desativar' : 'Ativar'}
                </button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr />

      {/* 🔹 PACIENTES */}
      <h2>Pacientes</h2>

      {pacientes.length === 0 && <p>Nenhum paciente cadastrado.</p>}

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {pacientes.map((paciente) => (
            <tr key={paciente._id}>
              <td>{paciente.user?.nome}</td>
              <td>{paciente.user?.email}</td>
              <td>
                <span
                  style={{
                    color: 'green',
                    fontWeight: 'bold'
                  }}
                >
                  Ativo
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>


      <h2>Consultas</h2>

      {consultas.length === 0 && <p>Nenhuma consulta encontrada.</p>}

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Paciente</th>
            <th>Médico</th>
            <th>Data</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {consultas.map((consulta) => (
            <tr key={consulta._id}>
              <td>{consulta.paciente?.user?.nome || '—'}</td>
              <td>{consulta.medico?.user?.nome || '—'}</td>
              <td>{new Date(consulta.data).toLocaleString()}</td>
              <td>{consulta.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Criar Médico</h2>

        <form onSubmit={handleCreateMedico}>
          <input name="nome" placeholder='nome' value={medicoForm.nome} onChange={handleChangeM} /> <br />
          <input name="email" placeholder='email' value={medicoForm.email} onChange={handleChangeM} /> <br />
          <input name="senha" placeholder='senha' type="password" value={medicoForm.senha} onChange={handleChangeM} /> <br />
          <input name="especialidade" placeholder='especialidade' value={medicoForm.especialidade} onChange={handleChangeM} /> <br />
          <input name="crm" placeholder='crm' value={medicoForm.crm} onChange={handleChangeM} /> <br />
          <button>Criar Médico</button>
        </form>


        <hr />

        <h2>Criar Paciente</h2>

        <form onSubmit={handleCreatePaciente}>
          <input name="nome" placeholder='nome' value={pacienteForm.nome} onChange={handleChangeP} /> <br />
          <input name="email" placeholder='email' value={pacienteForm.email} onChange={handleChangeP} /> <br />
          <input name="senha" placeholder='senha' type="password" value={pacienteForm.senha} onChange={handleChangeP} /> <br />
          <button>Criar Paciente</button>
        </form>


        {message && <p>{message}</p>}

    </div>
  )
}

export default Admin
