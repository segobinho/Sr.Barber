import { db } from "../db.js";
import moment from 'moment'; // Importe o Moment.js

// buscar agendamentos

export const getAgendamentos = (_, res) => {
    const q = 
    `SELECT a.id_agendamento, a.id_funcionario, a.id_cliente, a.id_servico, a.title, a.start, a.end, c.nome as cliente, s.nome as servicos, f.nome as funcionario
    FROM agendamentos a
    JOIN clientes c ON a.id_cliente = c.id_cliente
    JOIN servicos s ON a.id_servico = s.id_servico
    JOIN funcionarios f ON a.id_funcionario = f.id_funcionario `;

    db.query(q, (err, data) => {
        if (err) return res.status(500).json({ error: err.message });

        return res.status(200).json(data);
    }) 
}




// adicionar clientes


export const addAgendamentos = (req, res) => {
  const { title, start, end, resourceId, id_cliente, id_servicos, id_barbearia } = req.body;

  // Converta as datas usando Moment.js
  const formattedStart = moment(start).format('YYYY-MM-DD HH:mm:ss');
  const formattedEnd = moment(end).format('YYYY-MM-DD HH:mm:ss');

  // Dados para o carrinho
  const status = 'aberto';
  const dataCriacao = moment().format('YYYY-MM-DD HH:mm:ss');
  const total_bruto = 10; // Valor de teste
  const total_final = 10; // Valor de teste
  const quantidade = 1; // Quantidade fixa para cada serviço
  const preco_unitario = 10; // Valor de teste para preço unitário
  const subtotal = 10; // Valor de teste para subtotal

  // Inserir um novo carrinho antes do agendamento
  const cartQuery = `
      INSERT INTO carrinho (id_cliente, id_funcionario, status, data_criacao, id_barbearia, total_bruto, total_final)
      VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(cartQuery, [id_cliente, resourceId, status, dataCriacao, id_barbearia, total_bruto, total_final], (cartErr, cartResult) => {
      if (cartErr) return res.status(500).json({ error: cartErr.message });

      const id_carrinho = cartResult.insertId; // Obter o ID do carrinho recém-criado

      // Inserir o agendamento com o id_carrinho
      const agendamentoQuery = `
          INSERT INTO agendamentos (title, start, end, id_funcionario, id_cliente, id_carrinho)
          VALUES (?, ?, ?, ?, ?, ?)
      `;

      db.query(agendamentoQuery, [title, formattedStart, formattedEnd, resourceId, id_cliente, id_carrinho], (err, result) => {
          if (err) return res.status(500).json({ error: err.message });

          // Adicionar os serviços ao carrinho com quantidade fixa de 1 e valores de teste
          const itemQueries = id_servicos.map(id_servico => {
              const itemQuery = `
                  INSERT INTO itenscarrinho (id_carrinho, id_servico, quantidade, preco_unitario, subtotal)
                  VALUES (?, ?, ?, ?, ?)
              `;
              return new Promise((resolve, reject) => {
                  db.query(itemQuery, [id_carrinho, id_servico, quantidade, preco_unitario, subtotal], (itemErr, itemResult) => {
                      if (itemErr) {
                          reject(itemErr);
                      } else {
                          resolve(itemResult);
                      }
                  });
              });
          });

          // Executar todas as promessas de inserção em itens_carrinho
          Promise.all(itemQueries)
              .then(itemResults => {
                  return res.status(201).json({ agendamento: result, carrinho: { id_carrinho }, items: itemResults });
              })
              .catch(itemErr => {
                  return res.status(500).json({ error: itemErr.message });
              });
      });
  });
};




// mover agendamento

export const moverAgendamento = (req, res) => {
  const { id } = req.params;
  const { start, end } = req.body;

  console.log("Recebido:", { id, start, end }); // Log para verificação de dados

  const query = `
    UPDATE agendamentos
    SET start = ?, end = ?
    WHERE id_agendamento = ?
  `;

  db.query(query, [start, end, id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao atualizar agendamento.' });
    }

    // Verifica se alguma linha foi afetada
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Agendamento não encontrado.' });
    }

    res.status(200).json({ message: 'Agendamento atualizado com sucesso!' });
  });
};

export const removeAgendamento = (req, res) => {
  const eventid = req.params.id;  
  const q = "DELETE FROM agendamentos WHERE id_agendamento = ?";

  db.query(q, [eventid], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      if (result.affectedRows === 0) {
          return res.status(404).json({ message: "agendamento não encontrado" });
      }

      return res.status(200).json({ message: "agendamento deletado com sucesso" });
  });
};



export const atualizarAgendamento = (req, res) => {
  const { id } = req.params; // Pega o id do agendamento a ser atualizado
  const { title, start, end, id_funcionario, id_cliente, id_servico } = req.body; // Extrai os dados do corpo da requisição

  // Formatar as datas usando Moment.js
  const formattedStart = moment(start).format('YYYY-MM-DD HH:mm:ss');
  const formattedEnd = moment(end).format('YYYY-MM-DD HH:mm:ss');

  // Consulta SQL para atualizar o agendamento
  const query = `
    UPDATE agendamentos
    SET title = ?, start = ?, end = ?, id_funcionario = ?, id_cliente = ?, id_servico = ?
    WHERE id_agendamento = ?
  `;

  // Executar a consulta
  db.query(query, [title, formattedStart, formattedEnd, id_funcionario, id_cliente, id_servico, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message }); // Tratamento de erro

    // Verifica se alguma linha foi afetada
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Agendamento não encontrado." });
    }

    // Retorna uma resposta de sucesso
    return res.status(200).json({ message: "Agendamento atualizado com sucesso!" });
  });
};
