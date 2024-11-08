import React, { useState, useEffect } from 'react';
import { FaPlus, FaClock, FaCheck } from 'react-icons/fa';
import './style.css'; // Importando o arquivo de estilo
import Header from '../../components/header';
import Modal from '../../components/componenteteste/modal'; // Importando o componente Modal

const CarrinhosSemPagamento = () => {
  const [carrinhos, setCarrinhos] = useState([]);
  const [carrinhoSelecionado, setCarrinhoSelecionado] = useState(null);
  const [precoTotal, setPrecoTotal] = useState(0);
  const [modalAberto, setModalAberto] = useState(false); // Estado para controlar o modal

  // Função para buscar carrinhos e seus itens do backend
  const fetchCarrinhos = async () => {
    try {
      const response = await fetch('http://localhost:8800/carrinhos'); // URL do backend
      const data = await response.json();
      setCarrinhos(data);
    } catch (error) {
      console.error('Erro ao buscar os carrinhos:', error);
    }
  };

  // Executa a função fetchCarrinhos ao carregar o componente
  useEffect(() => {
    fetchCarrinhos();
  }, []);

  // Quando um carrinho é clicado, ele seleciona o carrinho, exibe seus itens e abre o modal
  const handleCarrinhoClick = (carrinho) => {
    setCarrinhoSelecionado(carrinho);

    // Calcular o preço total dos itens no carrinho
    const total = carrinho.itens.reduce((acc, item) => acc + item.subtotal, 0);
    setPrecoTotal(total);

    // Abrir o modal após selecionar o carrinho
    setModalAberto(true);
    console.log("Modal Aberto:", modalAberto);

  };

  const adicionarCarrinho = () => {
    const novoCarrinho = {
      id: carrinhos.length + 1,
      nomeCliente: 'Novo Cliente',
      data: new Date().toISOString().split('T')[0],
      total: 100.00,
    };
    setCarrinhos([...carrinhos, novoCarrinho]);
  };

  return (
    <div className='teste1223'>
      <Header />
      

      <h2 className="titulo">Carrinhos Sem Pagamento</h2>

      <div className="btn-container">
    <button className="btn-adicionar" onClick={adicionarCarrinho}>
      <FaPlus />
      Adicionar Carrinho
    </button>
    <button className="btn-finalizado" >
      <FaCheck /> Carrinhos Finalizados
    </button>
    <button className="btn-atrasado" >
      <FaClock /> Carrinhos Atrasados
    </button>
    
    
  </div>


      <div className="carrinhos-container">
        {carrinhos.length > 0 ? (
          carrinhos.map((carrinho) => (
            <div 
              key={carrinho.id_carrinho} 
              className="card-carrinho" 
              onClick={() => handleCarrinhoClick(carrinho)} // Chama a função para abrir o modal com o carrinho selecionado
            >
              <h3 className='h3cliente'>Cliente: {carrinho.id_cliente}</h3>
              <p className='pcliente'>Data: {new Date(carrinho.data_criacao).toLocaleDateString()}</p>
              {/* <p>Total Bruto: R${carrinho.total_bruto.toFixed(2)}</p> */}
              <p className='pcliente'>  Total Final: R${carrinho.total_final.toFixed(2)}</p>
            </div>
          ))
        ) : (
          <p>Nenhum carrinho encontrado.</p>
        )}
      </div>

      {/* Modal para exibir os itens do carrinho selecionado */}
      {modalAberto && (
        <Modal onClose={() => setModalAberto(false)}>
          <h3>Itens do Carrinho {carrinhoSelecionado?.id_carrinho}</h3>
          {carrinhoSelecionado?.itens && carrinhoSelecionado.itens.length > 0 ? (
            <>
              {carrinhoSelecionado.itens.map((item) => (
                <div key={item.id_item} className="card-item">
                  {item.nome_produto ? (
                    <div>
                      <p>Produto: {item.nome_produto}</p>
                      <p>Quantidade: {item.quantidade}</p>
                      <p>Preço Unitário: R${item.preco_unitario.toFixed(2)}</p>
                      <p>Subtotal: R${item.subtotal.toFixed(2)}</p>
                    </div>
                  ) : (
                    <div>
                      <p>Serviço: {item.nome_servico}</p>
                      <p>Preço do Serviço: R${item.preco_unitario.toFixed(2)}</p>
                    </div>
                  )}
                </div>
              ))}
              <div className="preco-total">
                <h3>Preço Total do Carrinho: R${precoTotal.toFixed(2)}</h3>
              </div>
            </>
          ) : (
            <p>Este carrinho não possui itens.</p>
          )}
        </Modal>
      )}
    </div>
  );
};

export default CarrinhosSemPagamento;
