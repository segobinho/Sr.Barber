import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import './style.css'; // Importando o arquivo de estilo
import Header from '../../components/header';

const CarrinhosSemPagamento = () => {
  const [carrinhos, setCarrinhos] = useState([
    { id: 1, nomeCliente: 'João Silva', data: '2024-10-01', total: 150.00 },
    { id: 2, nomeCliente: 'Maria Santos', data: '2024-10-02', total: 200.50 },
    { id: 3, nomeCliente: 'Carlos Souza', data: '2024-10-03', total: 300.00 },
    
    
  ]);

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
    <div>
        <Header/>
      <header>
        <h1>Header</h1>
      </header>

      <h2 className="titulo">Carrinhos Sem Pagamento</h2>

      <div className="btn-container">
        <button className="btn-adicionar" onClick={adicionarCarrinho}>
          <FaPlus />
          Adicionar Carrinho
        </button>
      </div>

      <div className="carrinhos-container">
        {carrinhos.map((carrinho) => (
          <div key={carrinho.id} className="card-carrinho">
            <h3>Cliente: {carrinho.nomeCliente}</h3>
            <p>Data: {carrinho.data}</p>
            <p>Total: R${carrinho.total.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarrinhosSemPagamento;
