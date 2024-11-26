import React, { useState, useEffect } from 'react';
import { FaPlus, FaClock, FaCheck, FaCalendarDay, FaBoxOpen, FaList, FaTh } from 'react-icons/fa';
import './style.css';
import Header from '../../components/header';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Select, MenuItem, TextField, Checkbox, FormControlLabel, InputLabel, FormControl } from '@mui/material';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';


const CarrinhosSemPagamento = () => {
  const [carrinhos, setCarrinhos] = useState([]);
  const [carrinhoSelecionado, setCarrinhoSelecionado] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [detalhesCarrinho, setDetalhesCarrinho] = useState(null);
  const [metodosPagamento, setMetodosPagamento] = useState([]);
  const [metodoSelecionado, setMetodoSelecionado] = useState('');
  const [produtos, setProdutos] = useState([]);
  const [produtosSelecionados, setProdutosSelecionados] = useState([]);
  const [checkboxStatus, setCheckboxStatus] = useState({}); // Para controlar quais produtos estão selecionados
  const [exibirBotoesSalvar, setExibirBotoesSalvar] = useState(false); // Controle para mostrar os botões de salvar e cancelar
  const [exibirProdutos, setExibirProdutos] = useState(false); // Controle para exibir ou esconder a lista de produtos
  const [statusCarrinhos, setStatusCarrinhos] = useState(''); // Novo estado para status
  const [filtroData, setFiltroData] = useState('');
  const [filtroNomeCliente, setFiltroNomeCliente] = useState('');


  // Função para buscar carrinhos do backend
  const fetchCarrinhos = async (status = '') => {
    let url = 'http://localhost:8800/carrinhos';
  
    // Recuperar o objeto 'user' do localStorage e acessar as propriedades
    const user = JSON.parse(localStorage.getItem('user'));
  
    // Verificar o cargo no objeto user
    const cargo = user ? user.cargo : null;
  
    // Se não for admin, adicionar o id_barbearia à URL
    if (cargo !== 'admin' && user) {
      const idBarbearia = user.id_barbearia;
      if (idBarbearia) {
        url = `${url}?id_barbearia=${idBarbearia}`;
      }
    }
    console.log( 'usuarii', user)
  
    // Adicionar o parâmetro de status, se fornecido
    if (status) {
      url = `${url}${url.includes('?') ? '&' : '?'}status=${status}`;
    }
  
    try {
      const response = await fetch(url);
      const data = await response.json();
      setCarrinhos(data);
    } catch (error) {
      console.error('Erro ao buscar os carrinhos:', error);
    }
  };

console.log(metodoSelecionado)
  useEffect(() => {
    fetchCarrinhos(statusCarrinhos); // Passando o status de carrinhos
    fetchMetodosPagamento();
    setFiltroData('');
    setFiltroNomeCliente('');
  }, [statusCarrinhos]); // Recarrega os carrinhos sempre que o status mudar

  // Alteração no estado de status ao clicar nos botões
  const handleStatusClick = (status) => {
    setStatusCarrinhos(status); // Atualiza o status e dispara a requisição
  };

  console.log(produtosSelecionados)
  // Função para buscar detalhes de um carrinho
  const fetchDetalhesCarrinho = async (id_carrinho) => {
    try {
      const response = await fetch(`http://localhost:8800/carrinhos/${id_carrinho}`);
      const data = await response.json();
      setDetalhesCarrinho(data);
      console.log('teeste', data )
    } catch (error) {
      console.error('Erro ao buscar detalhes do carrinho:', error);
    }
  };

  // Função para buscar métodos de pagamento
  const fetchMetodosPagamento = async () => {
    try {
      const response = await fetch('http://localhost:8800/metodosPagamento');
      const data = await response.json();
      setMetodosPagamento(data);
    } catch (error) {
      console.error('Erro ao buscar métodos de pagamento:', error);
    }
  };

  // Função para buscar produtos
  const fetchProdutos = async () => {
    try {
      const response = await fetch('http://localhost:8800/products');
      const data = await response.json();
      setProdutos(data);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
  };

  useEffect(() => {
    fetchCarrinhos();
    fetchMetodosPagamento();
  }, []);

  const handleCarrinhoClick = async (carrinho) => {
    setCarrinhoSelecionado(carrinho);
    await fetchDetalhesCarrinho(carrinho.id_carrinho);
    setModalAberto(true);
  };

  const handleCloseModal = () => {
    setModalAberto(false);
    setCarrinhoSelecionado(null);
    setDetalhesCarrinho(null);
    setMetodoSelecionado('');
    setProdutosSelecionados([]);
    setCheckboxStatus({});
    setExibirBotoesSalvar(false); // Resetar o estado dos botões
    setExibirProdutos(false); // Esconder a lista de produtos ao fechar o modal
  };



  const finalizarCompra = async () => {
    const { id_carrinho, id_barbearia, itens, total } = detalhesCarrinho;
  
    // Garantindo que o valor_pago será passado com 2 casas decimais
    const valor_pago = parseFloat(total).toFixed(2);
  
    // Filtrando os itens para pegar apenas os que têm id_produto válido
    const produtos = itens
      .filter(item => item.id_produto != null) // Filtra itens com id_produto não nulo
      .map(item => ({
        id_produto: item.id_produto, // Supondo que `id_item` seja equivalente ao `id_produto`
        quantidade: item.quantidade
      }));
  
    try {
      // Prepara o payload com o campo produtos apenas se ele tiver dados
      const payload = {
        id_carrinho,
        id_barbearia,
        valor_pago,
        id_metodo: metodoSelecionado.id_metodo // Adicionando id_metodo ao payload
      };
  
      // Se houver produtos válidos, adiciona o campo produtos ao payload
      if (produtos.length > 0) {
        payload.produtos = produtos;
      }
  
      // Enviando os dados para o backend via POST
      const response = await axios.post('http://localhost:8800/pagamento', payload);
  
      // Log para verificar a resposta do servidor
      toast.success(response.data.message || 'Compra finalizada com sucesso!', {

      });

      setCarrinhos(prevCarrinhos => 
        prevCarrinhos.filter(carrinho => carrinho.id_carrinho !== response.data.id_carrinho)
      );
  
  
      // Fechar o modal após finalizar a compra
      handleCloseModal();
    } catch (error) {
      toast.error('Erro ao finalizar a compra:', error);
    }
  };
  
  const exibirBotoesDeSalvar = () => {
    setExibirBotoesSalvar(true); // Mostrar os botões de salvar e cancelar
    setExibirProdutos(true); // Exibir a lista de produtos
    fetchProdutos(); // Carregar os produtos
  };

  const cancelarAdicionarProdutos = () => {
    setExibirBotoesSalvar(false); // Esconder os botões ao cancelar
    setExibirProdutos(false); // Esconder a lista de produtos
    setProdutosSelecionados([]); // Limpar a seleção dos produtos
    setCheckboxStatus({});
  };

  const handleProdutoCheckboxChange = (produtoId) => {
    setCheckboxStatus((prev) => ({
      ...prev,
      [produtoId]: !prev[produtoId],
    }));
  };

  const handleProdutoChange = (produtoId, quantidade,) => {
    // Verificar se a quantidade selecionada não é maior que a disponível
    const produto = produtos.find((p) => p.id_produto === produtoId);
    if (quantidade < 0) {
      toast.error ('A quantidade não pode ser negativa.');
      return;
    }
    if (quantidade > produto.amount) {
      toast.error (`Quantidade máxima disponível para este produto é ${produto.amount}`);
      return;
    }

    setProdutosSelecionados((prev) => {
      const produtoExistente = prev.find((p) => p.id_produto === produtoId);

      if (produtoExistente) {
        return prev.map((p) =>
          p.id_produto === produtoId
            ? { ...p, quantidade, salePrice: produto.salePrice }
            : p
        );
      } else {
        return [...prev, { id_produto: produtoId, quantidade, salePrice: produto.salePrice }];
      }
    });
  };
  const salvarProdutos = async () => {
    const produtosPost = produtosSelecionados.map((produto) => ({
      id_produto: produto.id_produto,
      quantidade: produto.quantidade,
      preco_unitario: produto.salePrice,  // Incluindo o preco_unitario dos produtos
    }));

    const dados = {
      id_carrinho: carrinhoSelecionado.id_carrinho,
      // id_metodo: metodoSelecionado,  // A ID do método de pagamento
      //id_barbearia: 45,  // Use a ID da barbearia conforme necessário
      // valor_pago: 200.0,  // Coloque o valor pago aqui
      produtos: produtosPost,
    };

    console.log(dados); // Apenas para depuração, pode remover depois

    try {
      const response = await fetch('http://localhost:8800/addProductsCar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dados),
      });

      if (response.ok) {
        // Recarregar os dados do carrinho após o sucesso
        await fetchDetalhesCarrinho(carrinhoSelecionado.id_carrinho);
        toast.success('Produtos salvos com sucesso!');
        setExibirBotoesSalvar(false); // Resetar o estado dos botões  
        setExibirProdutos(false); // Esconder a lista de produtos
      } else {
        // Exibir mensagem de erro caso a resposta não seja bem-sucedida
        const errorData = await response.json();
        toast.error(`Erro ao salvar os produtos: ${errorData.message || 'Erro desconhecido'}`);
      }
    } catch (error) {
      toast.error('Erro ao salvar os produtos.' , error);
    }
  };

  const filtrarCarrinhos = () => {
    return carrinhos.filter((carrinho) => {
      // Verifica se a data_final_agendamento existe e se o filtro de data está ativo
      if (filtroData) {
        // Verifica se carrinho.data_final_agendamento é válido
        const dataFinal = carrinho.data_final_agendamento;
        if (dataFinal && !dataFinal.includes(filtroData)) {
          return false; // Se a data não coincidir com o filtro, exclui o carrinho
        }
      }

      // Filtrar por nome do cliente se um filtro de nome do cliente estiver ativo
      if (filtroNomeCliente && carrinho.nome_cliente && !carrinho.nome_cliente.toLowerCase().includes(filtroNomeCliente.toLowerCase())) {
        return false; // Se o nome do cliente não coincidir, exclui o carrinho
      }

      return true; // Caso contrário, inclui o carrinho
    });
  };
  console.log(produtosSelecionados)
  const handleMetodoChange = (e) => { const selectedMetodo = metodosPagamento.find(metodo => metodo.nome_metodo === e.target.value); setMetodoSelecionado({ nome_metodo: e.target.value, id_metodo: selectedMetodo ? selectedMetodo.id_metodo : '' }); };

  return (
    <div className="teste1223">

      <Header />
      <ToastContainer />

      <h2 className="titulo" >Carrinhos Sem Pagamento</h2>
      <h4 className="titulo2">
        {statusCarrinhos === '' && 'Exibindo todos os carrinhos'}
        {statusCarrinhos === 'dia' && 'Carrinhos do dia'}
        {statusCarrinhos === 'finalizado' && 'Carrinhos Finalizados'}
        {statusCarrinhos === 'atrasado' && 'Carrinhos Atrasados'}
        {statusCarrinhos === 'pendente' && 'Carrinhos pendentes'}

      </h4>

      <div className="btn-container">
        <button className="btn-todos" onClick={() => handleStatusClick('pendente')} >
          <FaList /> Carrinhos Pendentes
        </button>
        <button className="btn-dia" onClick={() => handleStatusClick('dia')}>
          <FaCalendarDay />  Carrinhos do dia
        </button>
        <button className="btn-finalizado" onClick={() => handleStatusClick('finalizado')}>
          <FaCheck /> Carrinhos Finalizados
        </button>
        <button className="btn-atrasado" onClick={() => handleStatusClick('atrasado')}>
          <FaClock /> Carrinhos Atrasados
        </button>

      </div>

      <div className="filtros">
        <TextField
          label="Filtrar por Nome "
          variant="outlined"
          fullWidth
          value={filtroNomeCliente}
          onChange={(e) => setFiltroNomeCliente(e.target.value)}
        />
        <TextField
          label="Filtrar por Data"
          type="date"
          variant="outlined"
          fullWidth
          value={filtroData}
          onChange={(e) => setFiltroData(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </div>


      <div className="carrinhos-container">
        {filtrarCarrinhos().length > 0 ? (
          filtrarCarrinhos()
            .slice()
            .sort((a, b) => {
              if (!a.data_final_agendamento) return 1;
              if (!b.data_final_agendamento) return -1;
              return (
                new Date(a.data_final_agendamento) - new Date(b.data_final_agendamento)
              );
            })
            .map((carrinho) => (
              <div
                key={carrinho.id_carrinho}
                className={`card-carrinho ${carrinho.status}`}
                onClick={() => handleCarrinhoClick(carrinho)}
              >
                <h3 className="h3cliente">Cliente: {carrinho.nome_cliente}</h3>
                <p className="pcliente">
                  Data Final:{' '}
                  {carrinho.data_final_agendamento
                    ? new Date(carrinho.data_final_agendamento).toLocaleString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                    : 'Data não disponível'}
                </p>
              </div>
            ))
        ) : (
          <p>Nenhum carrinho encontrado.</p>
        )}
      </div>

      {/* Modal para exibir detalhes do carrinho */}
      <Dialog open={modalAberto} onClose={handleCloseModal} fullWidth>
        <DialogTitle className='carrinhoitediv'>Detalhes do Carrinho</DialogTitle>
        <DialogContent className='carrinhoitediv'>
          {detalhesCarrinho ? (
            <div className='carrinhoitediv'>
              <p className='carrinhop'>Cliente: {detalhesCarrinho.nome_cliente}</p>
              <p className='carrinhop'>Funcionário: {detalhesCarrinho.nome_funcionario}</p>
              <p className='carrinhop'>Status: {detalhesCarrinho.status}</p>
              <p className='carrinhop'>Preço Total: R$ {detalhesCarrinho.total.toFixed(2)}</p>
              <ul>
                {detalhesCarrinho.itens.map((item) => (
                  <li className='lip' key={item.id_item}>
                    {item.nome_produto
                      ? `Produto: ${item.nome_produto}`
                      : `Serviço: ${item.nome_servico}`} - Quantidade: {item.quantidade} - Subtotal: R${' '}{item.subtotal}
                  </li>
                ))}
              </ul>

              {/* Select para métodos de pagamento */}
              <div>
                {statusCarrinhos !== 'finalizado' && (
                  <FormControl
                    sx={{
                      width: '300px', // Defina a largura desejada
                      height: '40px', // Defina a altura desejada
                      mb: '20px',
                      backgroundColor: 'white', // Fundo branco
                      '& .MuiOutlinedInput-root': {
                        height: '100%', // Faz o input preencher a altura do FormControl
                        '& fieldset': {
                          border: 'none', // Remove a borda
                        },
                        '&:hover fieldset': {
                          border: 'none', // Remove a borda no hover
                        },
                        '&.Mui-focused fieldset': {
                          border: 'none', // Remove a borda quando focado
                        },
                      },
                    }}
                  >

                    <Select
                      labelId="metodo-pagamento-label"
                      value={metodoSelecionado.nome_metodo}
                      onChange={handleMetodoChange}
                      displayEmpty
                      sx={{
                        color: 'black', // Letra preta
                        height: '40px', // Garante que o Select preencha a altura do FormControl
                      }}
                    >
                      <MenuItem value="" disabled>
                        Selecione um método de pagamento
                      </MenuItem>
                      {metodosPagamento.map((metodo) => (
                        <MenuItem key={metodo.id_metodo} value={metodo.nome_metodo}>
                          {metodo.nome_metodo}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              </div>
              <div>
                {statusCarrinhos !== 'finalizado' && !exibirProdutos && (
                  <Button variant="contained" onClick={exibirBotoesDeSalvar}>
                    Adicionar Produtos
                  </Button>
                )}

              </div>

              {/* Adicionar Produtos */}
              {exibirProdutos && (
                <div>

                  {produtos.length > 0 && (
                    <div>
                      {produtos.map((produto) => (
                        <div key={produto.id_produto}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={checkboxStatus[produto.id_produto] || false}
                                onChange={() => handleProdutoCheckboxChange(produto.id_produto)}
                                sx={{
                                  color: "#FFD369", // Cor das bordas
                                  '&.Mui-checked': {
                                    color: "#FFD369", // Cor quando está marcado
                                  },
                                }}
                              />
                            }
                            label={
                              <span style={{ color: "var(--cor2, #BD9E54)" }}>
                                {`${produto.name} - Estoque: ${produto.amount} - Preço: ${produto.salePrice}`}
                              </span>
                            }
                          />
                          {checkboxStatus[produto.id_produto] && (
                            <TextField
                              type="number"
                              label="Quantidade"
                              value={
                                produtosSelecionados.find((p) => p.id_produto === produto.id_produto)?.quantidade || ''
                              }
                              onChange={(e) => {
                                const quantidade = parseInt(e.target.value);
                                if (!isNaN(quantidade)) {
                                  handleProdutoChange(produto.id_produto, quantidade);
                                }
                              }}
                              fullWidth
                              inputProps={{
                                min: 0, // Impede números negativos
                                max: produto.amount, // Limita o valor ao estoque
                              }}
                            />
                          )}
                        </div>
                      ))}
                      {exibirBotoesSalvar && (
                        <div
                          style={{
                            display: 'flex', // Alinha os botões horizontalmente
                            gap: '16px', // Espaçamento entre os botões
                          }}
                        >
                          <Button
                            variant="contained"
                            color="success"
                            onClick={salvarProdutos}
                          >
                            Salvar Produtos
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            onClick={cancelarAdicionarProdutos}
                          >
                            Cancelar
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <p>Carregando detalhes...</p>
          )}
        </DialogContent>
        <DialogActions className="carrinhoitediv" sx={{ gap: 1 }}>
          <Button
            onClick={handleCloseModal}
            sx={{ mr: 2, color: 'black' }} // Botão "Fechar" com espaçamento à direita e texto preto
          >
            Fechar
          </Button>
          {statusCarrinhos !== 'finalizado' && (
            <Button
              onClick={finalizarCompra}
              sx={{
                background: '#FFD369', // Cor de fundo para o botão "Finalizar Compra"
                color: 'black', // Texto preto
                '&:hover': { background: '#FFC947' }, // Cor de fundo no hover
              }}
              disabled={!metodoSelecionado || exibirProdutos}
            >
              Finalizar Compra
            </Button>
          )}
        </DialogActions>

      </Dialog>
    </div>
  );
};

export default CarrinhosSemPagamento;
