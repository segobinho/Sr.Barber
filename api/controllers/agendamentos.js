import { db } from "../db.js";
import moment from 'moment'; // Importe o Moment.js

// buscar agendamentos

export const getAgendamentos = (req, res) => {
  const { id_barbearia } = req.query; // Captura o id_barbearia da query string

  let q = `
      SELECT 
          a.id_agendamento, 
          a.id_funcionario, 
          a.id_cliente, 
          a.id_barbearia, 
          ca.id_carrinho, 
          ca.status,  -- Incluindo o status do carrinho
          GROUP_CONCAT(ic.id_servico) AS id_servicos,  -- Concatenando todos os id_servico
          GROUP_CONCAT(s.nome) AS servicos,  -- Concatenando todos os nomes dos serviços
          a.title, 
          a.start, 
          a.end, 
          c.nome as cliente, 
          f.nome as funcionario
      FROM agendamentos a
      JOIN clientes c ON a.id_cliente = c.id_cliente
      JOIN carrinho ca ON a.id_carrinho = ca.id_carrinho
      JOIN itenscarrinho ic ON ca.id_carrinho = ic.id_carrinho
      JOIN servicos s ON ic.id_servico = s.id_servico
      JOIN funcionarios f ON a.id_funcionario = f.id_funcionario
  `;

  // Adiciona o filtro de id_barbearia, se fornecido
  if (id_barbearia) {
      q += ` WHERE a.id_barbearia = ?`;
  }

  q += `
      GROUP BY 
          a.id_agendamento, a.id_funcionario, a.id_cliente, 
          a.id_barbearia, ca.id_carrinho, a.title, 
          a.start, a.end, c.nome, f.nome;
  `;

  const queryParams = id_barbearia ? [id_barbearia] : [];

  db.query(q, queryParams, (err, data) => {
      if (err) return res.status(500).json({ error: err.message });

      return res.status(200).json(data);
  });
};



// adicionar clientes


export const addAgendamentos = (req, res) => {
  const { title, start, end, resourceId, id_cliente, id_servicos, id_barbearia } = req.body;

  // Formatar datas usando Moment.js
  const formattedStart = moment(start).format('YYYY-MM-DD HH:mm:ss');
  const formattedEnd = moment(end).format('YYYY-MM-DD HH:mm:ss');
  const dataCriacao = moment().format('YYYY-MM-DD HH:mm:ss');

  // Status fixo para o carrinho
  const status = 'pendente';

  // Inserir um novo carrinho antes do agendamento
  const cartQuery = `
      INSERT INTO carrinho (id_cliente, id_funcionario, status, data_criacao, id_barbearia)
      VALUES (?, ?, ?, ?, ?)
  `;

  db.query(cartQuery, [id_cliente, resourceId, status, dataCriacao, id_barbearia], (cartErr, cartResult) => {
    if (cartErr) return res.status(500).json({ error: cartErr.message });

    const id_carrinho = cartResult.insertId; // Obter o ID do carrinho recém-criado

    // Inserir o agendamento com o id_carrinho e id_barbearia
    const agendamentoQuery = `  
        INSERT INTO agendamentos (title, start, end, id_funcionario, id_cliente, id_carrinho, id_barbearia)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(agendamentoQuery, [title, formattedStart, formattedEnd, resourceId, id_cliente, id_carrinho, id_barbearia], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      const id_agendamento = result.insertId;


      // Adicionar os serviços ao carrinho com quantidade fixa de 1 e preco_unitario fixo de 10
      const quantidade = 1; // Quantidade fixa para cada serviço
      const preco_unitario = 10; // Valor fixo para preco_unitario
      const itemQueries = id_servicos.map(id_servico => {
        const itemQuery = `
            INSERT INTO itenscarrinho (id_carrinho, id_servico, quantidade, preco_unitario)
            VALUES (?, ?, ?, ?)
        `;
        return new Promise((resolve, reject) => {
          db.query(itemQuery, [id_carrinho, id_servico, quantidade, preco_unitario], (itemErr, itemResult) => { 
            if (itemErr) {
              reject(itemErr);
            } else {
              resolve(itemResult);
            }
          });
        });
      });
      
      // Executar todas as promessas de inserção em itenscarrinho
      Promise.all(itemQueries)
        .then(itemResults => {
          return res.status(201).json({ 
            agendamento: { id_agendamento, title, start: formattedStart, end: formattedEnd, id_funcionario: resourceId, id_cliente, id_carrinho, id_barbearia },
            carrinho: { id_carrinho, status },
            items: itemResults
          });
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

  // Primeiro, buscar o id_carrinho associado ao agendamento
  const getCarrinhoQuery = "SELECT id_carrinho FROM agendamentos WHERE id_agendamento = ?";
  
  db.query(getCarrinhoQuery, [eventid], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.length === 0) {
      return res.status(404).json({ message: "Agendamento não encontrado" });
    }

    const id_carrinho = result[0].id_carrinho;

    // Agora, verificar o status do carrinho
    const getCarrinhoStatusQuery = "SELECT status FROM carrinho WHERE id_carrinho = ?";
    
    db.query(getCarrinhoStatusQuery, [id_carrinho], (err, carrinhoResult) => {
      if (err) return res.status(500).json({ error: err.message });

      if (carrinhoResult.length === 0) {
        return res.status(404).json({ message: "Carrinho não encontrado" });
      }

      const carrinhoStatus = carrinhoResult[0].status;

      // Verifica se o carrinho está finalizado
      if (carrinhoStatus === 'finalizado') {
        return res.status(400).json({ message: "Não é possível deletar o agendamento. O carrinho já foi finalizado." });
      }

      // Remover os itens do carrinho
      const removeItensCarrinhoQuery = "DELETE FROM itenscarrinho WHERE id_carrinho = ?";
      db.query(removeItensCarrinhoQuery, [id_carrinho], (err) => {
        if (err) return res.status(500).json({ error: err.message });

        // Após remover os itens, remover o carrinho
        const removeCarrinhoQuery = "DELETE FROM carrinho WHERE id_carrinho = ?";
        db.query(removeCarrinhoQuery, [id_carrinho], (err) => {
          if (err) return res.status(500).json({ error: err.message });

          // Agora, remover o agendamento
          const removeAgendamentoQuery = "DELETE FROM agendamentos WHERE id_agendamento = ?";
          db.query(removeAgendamentoQuery, [eventid], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            if (result.affectedRows === 0) {
              return res.status(404).json({ message: "Agendamento não encontrado" });
            }

            return res.status(200).json({ message: "Agendamento e carrinho deletados com sucesso" });
          });
        });
      });
    });
  });
};







export const atualizarAgendamento = (req, res) => {
  const { id } = req.params; // Pega o id do agendamento a ser atualizado
  const { title, start, end, id_funcionario, id_cliente, id_servicos } = req.body; // Extrai os dados do corpo da requisição

  // Formatar as datas usando Moment.js
  const formattedStart = moment(start).format('YYYY-MM-DD HH:mm:ss');
  const formattedEnd = moment(end).format('YYYY-MM-DD HH:mm:ss');

  // Consulta SQL para atualizar o agendamento
  const updateQuery = `
    UPDATE agendamentos
    SET title = ?, start = ?, end = ?, id_funcionario = ?, id_cliente = ?
    WHERE id_agendamento = ?;
  `;

  db.query(updateQuery, [title, formattedStart, formattedEnd, id_funcionario, id_cliente, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message }); // Tratamento de erro

    // Verifica se alguma linha foi afetada
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Agendamento não encontrado." });
    }

    // Buscar id_carrinho associado ao agendamento
    const getCarrinhoQuery = `
      SELECT id_carrinho FROM agendamentos WHERE id_agendamento = ?;
    `;
    
    db.query(getCarrinhoQuery, [id], (err, carrinhoResult) => {
      if (err) return res.status(500).json({ error: err.message });

      if (carrinhoResult.length === 0) {
        return res.status(404).json({ message: "Carrinho não encontrado" });
      }

      const id_carrinho = carrinhoResult[0].id_carrinho;

      // Buscar os id_servicos atuais no itenscarrinho
      const getServicosQuery = `
        SELECT id_servico FROM itenscarrinho WHERE id_carrinho = ?;
      `;
      
      db.query(getServicosQuery, [id_carrinho], (err, servicosResult) => {
        if (err) return res.status(500).json({ error: err.message });

        const currentServicos = servicosResult.map(row => row.id_servico.toString());
        const updatedServicos = id_servicos.split(',');

        const servicosToAdd = updatedServicos.filter(id => !currentServicos.includes(id));
        const servicosToRemove = currentServicos.filter(id => !updatedServicos.includes(id));

        // Inserir novos serviços no itenscarrinho
        const addServicosPromises = servicosToAdd.map(id_servico => {
          const insertQuery = `
            INSERT INTO itenscarrinho (id_carrinho, id_servico, quantidade, preco_unitario)
            VALUES (?, ?, 1, 10);
          `;
          return new Promise((resolve, reject) => {
            db.query(insertQuery, [id_carrinho, id_servico], (err, result) => {
              if (err) reject(err);
              resolve(result);
            });
          });
        });

        // Remover serviços antigos do itenscarrinho
        const removeServicosPromises = servicosToRemove.map(id_servico => {
          const deleteQuery = `
            DELETE FROM itenscarrinho WHERE id_carrinho = ? AND id_servico = ?;
          `;
          return new Promise((resolve, reject) => {
            db.query(deleteQuery, [id_carrinho, id_servico], (err, result) => {
              if (err) reject(err);
              resolve(result);
            });
          });
        });

        // Executar as promessas de inserção e remoção
        Promise.all([...addServicosPromises, ...removeServicosPromises])
          .then(results => {
            res.status(200).json({ message: "Agendamento atualizado com sucesso!" });
          })
          .catch(err => {
            res.status(500).json({ error: err.message });
          });
      });
    });
  });
};

