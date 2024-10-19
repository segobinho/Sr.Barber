import { db } from "../db.js";

export const Grafico = (_, res) => {
    const q = 
    `
      SELECT 
        f.id_funcionario,
        f.nome AS nome_funcionario,
        b.nome AS nome_barbearia,
        a.id_agendamento,
        a.end AS data_fim_agendamento,  -- Pegando a data de fim do agendamento
        a.title AS titulo_agendamento
      FROM 
        funcionarios f
      JOIN 
        barbearias b ON f.id_barbearia = b.id_barbearia
      LEFT JOIN 
        agendamentos a ON f.id_funcionario = a.id_funcionario
      ORDER BY 
        f.id_funcionario, a.end;  -- Ordenando pela data de fim
    `;

    db.query(q, (err, data) => {
        if (err) return res.status(500).json({ error: err.message });

        return res.status(200).json(data);
    }) 
}