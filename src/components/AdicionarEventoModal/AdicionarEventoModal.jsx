import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';

const AdicionarEventoModal = ({ barberId, onClose, setEventos, eventos }) => {
  const [titulo, setTitulo] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [clientes, setClientes] = useState([]); // Lista de clientes
  const [servicos, setServicos] = useState([]); // Lista de serviços
  const [clienteSelecionado, setClienteSelecionado] = useState(''); // Cliente selecionado
  const [servicosSelecionados, setServicosSelecionados] = useState([]); // IDs dos serviços selecionados
  const [user, setUser] = useState([]);
  const [funcionario, setFuncionario] = useState([]); // Estado para armazenar os dados do funcionário



  useEffect(() => {
    // Função para buscar o funcionário (barbeiro) pelo ID
    const getFuncionarioById = async () => {
      try {
        const response = await axios.get(`http://localhost:8800/funcionariosByID/${barberId}`);
        setFuncionario(response.data);
      } catch (error) {
        console.error('Erro ao buscar dados do funcionário:', error);
      }
    };

    if (barberId) {
      getFuncionarioById();
    }
  }, [barberId]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
  }, []);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);

    if (userData) {
      axios.get('http://localhost:8800/clientes', {
        params: {
          cargo: userData.cargo,
          id_barbearia: userData.id_barbearia
        }
      })
      .then(response => {
        setClientes(response.data);
      })
      .catch(error => {
        console.error("Erro ao buscar clientes:", error);
      });
    }
  }, []);
  console.log(clientes)

  useEffect(() => {
    // Função para buscar os serviços do backend
    const fetchServicos = async () => {
      try {
        if (funcionario.id_barbearia) {
          const servicosResponse = await axios.get(`http://localhost:8800/se?id_barbearia=${funcionario.id_barbearia}`);
          setServicos(servicosResponse.data);
        }
      } catch (error) {
        console.error('Erro ao buscar serviços:', error);
      }
    };
    
    fetchServicos();
  }, [funcionario.id_barbearia]);

  const handleServicoChange = (e) => {
    const { value, checked } = e.target;
    setServicosSelecionados(prev => 
      checked ? [...prev, value] : prev.filter(id => id !== value)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    
    if (dataInicio >= dataFim) {
      toast.warning('A data de fim não pode ser anterior à data de início!');
      return;
    }

    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      setUser(userData);
      const cliente = clientes.find(cliente => cliente.id_cliente.toString() === clienteSelecionado);
      const nomeCliente = cliente ? cliente.nome : '';
  
      // Pegando o nome do primeiro serviço selecionado
      const primeiroServico = servicos.find(servico => servico.id_servico.toString() === servicosSelecionados[0]);
      const nomeServico = primeiroServico ? primeiroServico.nome : '';
  
      // Construindo o título
      const tituloEvento = `${nomeCliente} - ${nomeServico}`;

      const novoEvento = {
        title:  tituloEvento, // Exibir título
        start: new Date(dataInicio),
        end: new Date(dataFim),
        resourceId: barberId,
        id_cliente: clienteSelecionado, // ID do cliente
        id_servicos: servicosSelecionados, // Array de IDs dos serviços
        id_barbearia:  funcionario.id_barbearia

      };
      console.log('Novo evento:', novoEvento); // Console log para ver o conteúdo de novoEvento



      const response =  await axios.post('http://localhost:8800/agendamentos', novoEvento);
      
      const idAgendamentoCriado = response.data.agendamento.id_agendamento;
      const carrinhoStatus = response.data.carrinho.status; // Pegando o status diretamente da resposta


      const eventoComId = {
        title:  tituloEvento, // Exibir título
        start: new Date(dataInicio),
        end: new Date(dataFim),
        id: idAgendamentoCriado,
        resourceId: barberId,
        status: carrinhoStatus,  // Status do carrinho adicionado
        id_cliente: clienteSelecionado, // ID do cliente
        id_barbearia:  userData.id_barbearia,
        id_servicos: servicosSelecionados.join(','),
        id_funcionario: barberId
      };
console.log('comid, ',  eventoComId )
      setEventos([...eventos,  eventoComId]);
      onClose();
    } catch (error) {
      console.error('Erro ao adicionar evento:', error);
    }
  };
console.log(servicosSelecionados)



  return (
    <div className='modal'>
      <ToastContainer />

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
                <option key={cliente.id_cliente} value={cliente.id_cliente}>
                  {cliente.nome}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Serviços:</label>
            <div className='servicos-list'>
              {servicos.map((servico) => (
                <div key={servico.id_servico}>
                  <input
                    type="checkbox"
                    value={servico.id_servico}
                    onChange={handleServicoChange}
                  />
                  <label>{servico.nome}</label>
                </div>
              ))}
            </div>
          </div>
          {/* <div>
            <label>Título (opcional):</label>
            <input
              type='text'
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: Corte Simples"
            />
          </div> */}
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
          <button className='save-btn' type='submit'>Adicionar Evento</button>
          <button className='delete-btn' type='button' onClick={onClose}>Cancelar</button>
        </form>
      </div>
    </div>
  );
};

export default AdicionarEventoModal;
