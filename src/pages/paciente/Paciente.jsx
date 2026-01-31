import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { useAuth } from '../../auth/useAuth';

export default function Paciente() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Estados
  const [consultas, setConsultas] = useState([]);
  const [medicos, setMedicos] = useState([]); // Para o select de médicos
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Estado do formulário
  const [formData, setFormData] = useState({ medicoId: '', data: '' });

  useEffect(() => {
    async function fetchData() {
      try {
        // Busca consultas e médicos em paralelo
        const [resConsultas, resMedicos] = await Promise.all([
          api.get('/consultas'),
          api.get('/medicos') // Endpoint que retorna médicos disponíveis
        ]);
        
        setConsultas(resConsultas.data.data || []); 
        // Filtra apenas médicos da lista de usuários, caso o backend não filtre
        setMedicos(resMedicos.data.data || [])
      } catch (err) {
        setError('Erro ao carregar dados');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleAgendar = async (e) => {
    e.preventDefault();
    try {
      // O backend usará o ID do médico enviado e o seu ID do Token (req.user.id)
      console.log('Dados do formulário:', formData);
      const response = await api.post('/consultas', formData);
      
      if (response.data.success) {
        alert('Consulta agendada com sucesso!');
        setConsultas([...consultas, response.data.data]); // Atualiza a lista na tela
        setFormData({ medicoId: '', data: '' }); // Limpa formulário
      }
    } catch (err) {
      alert('Erro ao agendar: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Área do Paciente</h1>
      <p>Bem-vindo, <strong>{user?.nome}</strong></p>
      <button onClick={() => { logout(); navigate('/login'); }}>Logout</button>

      <hr />

      {/* Seção para Marcar Consulta */}
      <section style={{ marginBottom: '40px', background: '#f4f4f4', padding: '15px', borderRadius: '8px' }}>
        <h2>Marcar Nova Consulta</h2>
        <form onSubmit={handleAgendar}>
          <div style={{ marginBottom: '10px' }}>
            <label>Selecione o Médico: </label>
            <select 
              required
              value={formData.medicoId}
              onChange={(e) => setFormData({...formData, medicoId: e.target.value})}
            >
              <option value="">Selecione...</option>
              {medicos.map(m => (
                <option key={m._id} value={m._id}>{m.nome}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label>Data e Hora: </label>
            <input 
              type="datetime-local" 
              required
              value={formData.data}
              onChange={(e) => setFormData({...formData, data: e.target.value})}
            />
          </div>

          <button type="submit" style={{ background: 'green', color: 'white' }}>Confirmar Agendamento</button>
        </form>
      </section>

      {/* Listagem */}
      <h2>Minhas Consultas</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {consultas.length === 0 ? (
        <p>Nenhuma consulta encontrada.</p>
      ) : (
        <ul>
          {consultas.map((consulta) => (
            <li key={consulta._id} style={{ marginBottom: '10px', borderBottom: '1px solid #ccc' }}>
              <strong>📅 Data:</strong> {new Date(consulta.data).toLocaleString()} <br />
              <strong>👨‍⚕️ Médico:</strong> {consulta.medico?.nome || 'Não informado'} <br />
              <strong>📌 Status:</strong> {consulta.status || 'pendente'}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}