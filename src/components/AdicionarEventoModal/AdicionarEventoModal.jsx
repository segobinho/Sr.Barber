import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useGetData from '../../hooks/Alldata/Getdata';


const AdicionarEventoModal = ({ barberId, onClose, setEventos, eventos }) => {
  const [titulo, setTitulo] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [clientes, setClientes] = useState([]); // Lista de clientes
  const [servicos, setServicos] = useState([]); // Lista de serviços
  const [clienteSelecionado, setClienteSelecionado] = useState(''); // Cliente selecionado
  const [servicoSelecionado, setServicoSelecionado] = useState(''); // Serviço selecionado
  const [user, setUser] = useState([]);


  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
  }, []);

 
  useGetData('http://localhost:8800/clientes', user, setClientes);


  useEffect(() => {


    // Função para buscar os serviços do backend
    const fetchServicos = async () => {
      try {
        const servicosResponse = await axios.get('http://localhost:8800/clientes');
        setServicos(servicosResponse.data); // Atualiza o estado com os dados dos serviços
      } catch (error) {
        console.error('Erro ao buscar serviços:', error);
      }
    };

    // Chama as funções de forma independente
    
    fetchServicos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if(dataInicio >= dataFim){
      alert('A data início deve ser anterior à data de término');
      return;
  }

    try {
      const novoEvento = {
        title: `${servicoSelecionado} - ${clienteSelecionado}`, // Exibir serviço e cliente no título
        start: new Date(dataInicio),
        end: new Date(dataFim),
        resourceId: barberId,
        id_cliente: clienteSelecionado, // ID do cliente
        id_servico: servicoSelecionado, // ID do servi
      };

      // Faz o POST para o backend (substitua pela URL correta)
      await axios.post('http://localhost:8800/agendamentos', novoEvento);

      // Atualiza o estado de eventos com o novo evento
      setEventos([...eventos, novoEvento]);

      // Fecha o modal
      onClose();
    } catch (error) {
      console.error('Erro ao adicionar evento:', error);
    }
  };

  return (
    <div className='modal'>
      <div className='modal-content'>
        <h2>Adicionar Evento para Barbeiro</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Cliente:</label>
            <select
              value={clienteSelecionado}
              onChange={(e) => setClienteSelecionado(e.target.value)}
              required
            >
              <option value="">Selecione um cliente</option>
              {clientes.map((cliente) => (
                <option key={cliente.id_cliente} value={cliente.nome}>
                  {cliente.nome}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Serviço:</label>
            <select
              value={servicoSelecionado}
              onChange={(e) => setServicoSelecionado(e.target.value)}
              required
            >
              <option value="">Selecione um serviço</option>
              {servicos.map((servico) => (
                <option key={servico.id} value={servico.nome}>
                  {servico.nome}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Título (opcional):</label>
            <input
              type='text'
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: Corte Simples"
            />
          </div>
          <div>
            <label>Data Início:</label>
            <input
              type='datetime-local'
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Data Fim:</label>
            <input
              type='datetime-local'
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              required
            />
          </div>
          <button type='submit'>Adicionar Evento</button>
          <button type='button' onClick={onClose}>Cancelar</button>
        </form>
      </div>
    </div>
  );
};

export default AdicionarEventoModal;
