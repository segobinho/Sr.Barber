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
    const { title, start, end, resourceId, id_cliente, id_servico } = req.body;

    // Converta as datas usando Moment.js
    const formattedStart = moment(start).format('YYYY-MM-DD HH:mm:ss');
    const formattedEnd = moment(end).format('YYYY-MM-DD HH:mm:ss');

    const q = "INSERT INTO agendamentos (title, start, end, id_funcionario, id_cliente, id_servico) VALUES (?, ?, ?, ?, ?, ?)";
    
    db.query(q, [title, formattedStart, formattedEnd, resourceId, id_cliente, id_servico], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        return res.status(201).json(result);
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
