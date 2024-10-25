import { db } from "../db.js"

export const getCarrinhos = (_, res) => {
    const q = `SELECT 
        carrinho.id_carrinho,
        carrinho.id_cliente,
        carrinho.id_funcionario,
        carrinho.status,
        carrinho.data_criacao,
        carrinho.total_bruto,
        carrinho.total_final,
        itenscarrinho.id_item,
        itenscarrinho.quantidade,
        itenscarrinho.preco_unitario,
        itenscarrinho.subtotal,
        products.name AS nome_produto,
        products.price AS preco_produto,
        servicos.nome AS nome_servico,
        servicos.preco AS preco_servico
    FROM 
        carrinho
    LEFT JOIN 
        itenscarrinho ON carrinho.id_carrinho = itenscarrinho.id_carrinho
    LEFT JOIN 
        products ON itenscarrinho.id_produto = products.id
    LEFT JOIN 
        servicos ON itenscarrinho.id_servico = servicos.id_servico;
    `;
    
    db.query(q, (err, data) => {
        if (err) return res.json(err);

        // Organizar os dados em um objeto agrupado por carrinho
        let carrinhosMap = {};

        data.forEach(row => {
            const carrinhoId = row.id_carrinho;

            // Se o carrinho não existir no mapa, cria uma nova entrada
            if (!carrinhosMap[carrinhoId]) {
                carrinhosMap[carrinhoId] = {
                    id_carrinho: row.id_carrinho,
                    id_cliente: row.id_cliente,
                    id_funcionario: row.id_funcionario,
                    status: row.status,
                    data_criacao: row.data_criacao,
                    total_bruto: row.total_bruto,
                    total_final: row.total_final,
                    itens: []
                };
            }

            // Adicionar o item (produto ou serviço) ao carrinho
            carrinhosMap[carrinhoId].itens.push({
                id_item: row.id_item,
                quantidade: row.quantidade,
                preco_unitario: row.preco_unitario,
                subtotal: row.subtotal,
                nome_produto: row.nome_produto,
                preco_produto: row.preco_produto,
                nome_servico: row.nome_servico,
                preco_servico: row.preco_servico
            });
        });

        // Converter o mapa de carrinhos para um array
        const carrinhos = Object.values(carrinhosMap);

        // Retornar o JSON dos carrinhos
        return res.status(200).json(carrinhos);
    });
};
