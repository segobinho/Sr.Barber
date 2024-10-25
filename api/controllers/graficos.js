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

export const quantservicos = (_, res) => {
  const q =`


SELECT 
    s.nome AS nome,
    SUM(ic.quantidade) AS valor
FROM 
    itenscarrinho ic
JOIN 
    servicos s ON ic.id_servico = s.id_servico
GROUP BY 
    ic.id_servico
ORDER BY 
    valor DESC;

  `
  db.query(q, (err, data) => {
    if (err) return res.status(500).json({ error: err.message });

    return res.status(200).json(data);
}) 
}

export const receita = (_, res) => {
  const q = `
    SELECT
    p.id_barbearia,
    b.nome AS nome_barbearia,
    
    -- Receita diária
    SUM(CASE WHEN DATE(p.data_pagamento) = CURDATE() THEN p.valor_pago ELSE 0 END) AS receita_diaria,

    -- Receita semanal
    SUM(CASE WHEN YEARWEEK(p.data_pagamento, 1) = YEARWEEK(CURDATE(), 1) THEN p.valor_pago ELSE 0 END) AS receita_semanal,

    -- Receita mensal (considerando o mês completo)
    SUM(CASE WHEN MONTH(p.data_pagamento) = MONTH(CURDATE()) AND YEAR(p.data_pagamento) = YEAR(CURDATE()) THEN p.valor_pago ELSE 0 END) AS receita_mensal,

    -- Receita trimestral (considerando os últimos 3 meses completos)
    SUM(CASE WHEN 
        (YEAR(p.data_pagamento) = YEAR(CURDATE()) AND MONTH(p.data_pagamento) BETWEEN MONTH(CURDATE())-2 AND MONTH(CURDATE())) 
        OR (YEAR(p.data_pagamento) = YEAR(CURDATE())-1 AND MONTH(CURDATE()) = 1 AND MONTH(p.data_pagamento) = 12) 
        THEN p.valor_pago ELSE 0 END) AS receita_trimestral,

    -- Receita semestral (últimos 6 meses completos)
    SUM(CASE WHEN 
        (YEAR(p.data_pagamento) = YEAR(CURDATE()) AND MONTH(p.data_pagamento) BETWEEN MONTH(CURDATE())-5 AND MONTH(CURDATE())) 
        OR (YEAR(p.data_pagamento) = YEAR(CURDATE())-1 AND MONTH(CURDATE()) IN (1,2) AND MONTH(p.data_pagamento) IN (12,11)) 
        THEN p.valor_pago ELSE 0 END) AS receita_semestral,

    -- Receita anual
    SUM(CASE WHEN YEAR(p.data_pagamento) = YEAR(CURDATE()) THEN p.valor_pago ELSE 0 END) AS receita_anual

FROM pagamentos p
JOIN barbearias b ON p.id_barbearia = b.id_barbearia
GROUP BY p.id_barbearia, b.nome
ORDER BY p.id_barbearia;

  `;
  
  db.query(q, (err, data) => {
    if (err) return res.status(500).json({ error: err.message });

    return res.status(200).json(data);
  });
};


export const metodos = (_, res) => {
  const q = `
SELECT 
    m.nome_metodo AS nome,
    SUM(c.total_final) AS valor
FROM pagamentos p
JOIN metodos m ON p.id_metodo = m.id_metodo
JOIN carrinho c ON p.id_carrinho = c.id_carrinho
GROUP BY m.nome_metodo;


  `;
  
  db.query(q, (err, data) => {
    if (err) return res.status(500).json({ error: err.message });

    return res.status(200).json(data);
  });
};

export const barbersdata = (_, res) => {
  const q = `
SELECT 
    f.id_funcionario AS Id_Funcionario,
    f.nome AS Funcionario,
    COUNT(CASE WHEN MONTH(a.start) = 1 THEN a.id_agendamento END) AS Janeiro,
    COUNT(CASE WHEN MONTH(a.start) = 2 THEN a.id_agendamento END) AS Fevereiro,
    COUNT(CASE WHEN MONTH(a.start) = 3 THEN a.id_agendamento END) AS Marco,
    COUNT(CASE WHEN MONTH(a.start) = 4 THEN a.id_agendamento END) AS Abril,
    COUNT(CASE WHEN MONTH(a.start) = 5 THEN a.id_agendamento END) AS Maio,
    COUNT(CASE WHEN MONTH(a.start) = 6 THEN a.id_agendamento END) AS Junho,
    COUNT(CASE WHEN MONTH(a.start) = 7 THEN a.id_agendamento END) AS Julho,
    COUNT(CASE WHEN MONTH(a.start) = 8 THEN a.id_agendamento END) AS Agosto,
    COUNT(CASE WHEN MONTH(a.start) = 9 THEN a.id_agendamento END) AS Setembro,
    COUNT(CASE WHEN MONTH(a.start) = 10 THEN a.id_agendamento END) AS Outubro,
    COUNT(CASE WHEN MONTH(a.start) = 11 THEN a.id_agendamento END) AS Novembro,
    COUNT(CASE WHEN MONTH(a.start) = 12 THEN a.id_agendamento END) AS Dezembro
FROM funcionarios f
LEFT JOIN agendamentos a ON f.id_funcionario = a.id_funcionario
WHERE YEAR(a.start) = YEAR(CURDATE())  -- Filtra pelo ano atual
GROUP BY f.id_funcionario, f.nome
ORDER BY f.nome;



  `;
  
  db.query(q, (err, data) => {
    if (err) return res.status(500).json({ error: err.message });

    return res.status(200).json(data);
  });
};



export const quantprodutos = (_, res) => {
  const q =`


SELECT 
    p.name AS nome,
    SUM(ic.quantidade) AS valor
FROM 
    itenscarrinho ic
JOIN 
    products p ON ic.id_produto = p.id
GROUP BY 
    ic.id_produto
ORDER BY 
    valor DESC;


  `
  db.query(q, (err, data) => {
    if (err) return res.status(500).json({ error: err.message });

    return res.status(200).json(data);
}) 
}
