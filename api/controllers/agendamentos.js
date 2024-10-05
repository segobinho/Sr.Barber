import { db } from "../db.js";

// buscar agendamentos

export const getAgendamentos = (_, res) => {
    const q = 
    `SELECT a.id_agendamento, a.id_funcionario, a.id_cliente, a.title, a.start, a.end, c.nome as cliente, s.nome as servico, f.nome as funcionario
    FROM agendamentos a
    JOIN clientes c ON a.id_cliente = c.id_cliente
    JOIN servico s ON a.id_servico = s.id_servico
    JOIN funcionarios f ON a.id_funcionario = f.id_funcionario `;

    db.query(q, (err, data) => {
        if (err) return res.status(500).json({ error: err.message });

        return res.status(200).json(data);
    }) 
}




// adicionar clientes
export const addAgendamentos = (req,res) => {
    const {title, start, end, resourceId, id_cliente, id_servico} = req.body;
    const q = "INSERT INTO agendamentos (title, start, end, id_funcionario, id_cliente, id_servico) VALUES (?, ?, ?, ?, ?, ?)";

    db.query(q,  [title, start, end, resourceId, id_cliente, id_servico,], (err, result)  => {
        if (err) return res.status(500).json({ error: err.message });

        return res.status(201).json(result);
    })
};

// mover agendamento

export const moverAgendamento = (req,res) => {
    const { id } = req.params;
    const { start, end } = req.body;
  
    const query = `
      UPDATE agendamentos
      SET start = ?, end = ?
      WHERE id_agendamento = ?
    `;
  
    db.query(query, [ start, end, id], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao atualizar agendamento.' });
      }
      res.status(200).json({ message: 'Agendamento atualizado com sucesso!' });
    });
  };
    

