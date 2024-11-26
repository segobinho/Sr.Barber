import { db } from "../db.js"
import moment from 'moment';

export const getCarrinhos = (req, res) => {
    const { status, id_barbearia } = req.query; // Captura os parâmetros opcionais da URL

    // Base da consulta SQL
    let q = `SELECT 
        carrinho.id_carrinho,
        carrinho.id_cliente,
        clientes.nome AS nome_cliente, 
        carrinho.id_funcionario,
        funcionarios.nome AS nome_funcionario,
 carrinho.id_barbearia, -- Inclui o id_barbearia
        carrinho.status,    
        carrinho.data_criacao,
        a.end AS data_final_agendamento
    FROM 
        carrinho
    LEFT JOIN 
        clientes ON carrinho.id_cliente = clientes.id_cliente
    LEFT JOIN 
        funcionarios ON carrinho.id_funcionario = funcionarios.id_funcionario
    LEFT JOIN 
        agendamentos a ON carrinho.id_carrinho = a.id_carrinho`;

    // Filtros dinâmicos
    let conditions = [];
    if (status) {
        if (status === "dia") {
            conditions.push(`DATE(a.end) = CURDATE() AND carrinho.status = 'pendente'`);
        } else {
            conditions.push(`carrinho.status = '${status}'`);
        }
    }
    if (id_barbearia) {
        conditions.push(`carrinho.id_barbearia = '${id_barbearia}'`);
    }

    

    // Adiciona as condições à consulta se existirem
    if (conditions.length > 0) {
        q += ` WHERE ${conditions.join(" AND ")}`;
    }

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
                    nome_cliente: row.nome_cliente, // Inclui o nome do cliente
                    id_funcionario: row.id_funcionario,
                    nome_funcionario: row.nome_funcionario, // Inclui o nome do funcionário
                    id_barbearia: row.id_barbearia, // Inclui o id_barbearia
                    status: row.status,
                    data_criacao: row.data_criacao,
                    data_final_agendamento: row.data_final_agendamento,
                };
            }
        });

        // Converter o mapa de carrinhos para um array
        const carrinhos = Object.values(carrinhosMap);

        // Retornar o JSON dos carrinhos
        return res.status(200).json(carrinhos);
    });
};




export const getCarrinhoById = (req, res) => {
    const { id_carrinho } = req.params;

    const q = `
        SELECT 
            carrinho.id_carrinho,
            carrinho.id_cliente,
            carrinho.id_barbearia,
            clientes.nome AS nome_cliente,
            carrinho.id_funcionario,
            funcionarios.nome AS nome_funcionario,
            carrinho.status,
            carrinho.data_criacao,
            
            itenscarrinho.id_item,
            itenscarrinho.quantidade,
            itenscarrinho.preco_unitario,
            (itenscarrinho.quantidade * itenscarrinho.preco_unitario) AS subtotal,
            products.name AS nome_produto,
            products.price AS preco_produto,
             products.id AS id_produto, 
            servicos.nome AS nome_servico,
            servicos.preco AS preco_servico
        FROM 
            carrinho
        LEFT JOIN 
            itenscarrinho ON carrinho.id_carrinho = itenscarrinho.id_carrinho
        LEFT JOIN 
            products ON itenscarrinho.id_produto = products.id
        LEFT JOIN 
            servicos ON itenscarrinho.id_servico = servicos.id_servico
        LEFT JOIN 
            clientes ON carrinho.id_cliente = clientes.id_cliente
         LEFT JOIN 
            funcionarios ON carrinho.id_funcionario = funcionarios.id_funcionario -- Adicionando a relação com a tabela de funcionários
        WHERE 
            carrinho.id_carrinho = ?;
    `;

    db.query(q, [id_carrinho], (err, data) => {
        if (err) return res.json(err);

        if (data.length === 0) {
            return res.status(404).json({ message: "Carrinho não encontrado" });
        }

        // Inicializando o total como 0
        let total = 0;

        // Organizar os dados em um único objeto
        const carrinho = {
            id_carrinho: data[0].id_carrinho,
            id_cliente: data[0].id_cliente,
            nome_cliente: data[0].nome_cliente,
            id_funcionario: data[0].id_funcionario,
            nome_funcionario: data[0].nome_funcionario, // Incluindo o nome do funcionário no objeto
            status: data[0].status,
            data_criacao: data[0].data_criacao,
            id_barbearia:  data[0].id_barbearia,
            itens: []
        };

        // Adicionar os itens ao carrinho e calcular o total
        data.forEach(row => {
            const item = {
                id_item: row.id_item,
                id_produto: row.id_produto, // Adicionando id_produto
                quantidade: row.quantidade,
                preco_unitario: row.preco_unitario,
                subtotal: row.subtotal,
                nome_produto: row.nome_produto,
                preco_produto: row.preco_produto,
                nome_servico: row.nome_servico,
                preco_servico: row.preco_servico
            };

            // Adicionar o item ao carrinho
            carrinho.itens.push(item);

            // Somar o subtotal de cada item no total
            total += item.subtotal;
        });

        // Adicionar o campo total ao carrinho
        carrinho.total = total;

        // Retornar o JSON do carrinho com o campo total
        return res.status(200).json(carrinho);
    });
};


export const getMetodos = (_, res) => {
    const q = `
        SELECT 
            id_metodo,
            nome_metodo,
            desconto
        FROM 
            metodos;
    `;

    db.query(q, (err, data) => {
        if (err) return res.json(err);

        // Retornar os dados dos métodos
        return res.status(200).json(data);
    });
};


export const finalizarCompra = (req, res) => {
    const { id_carrinho, id_metodo, id_barbearia, valor_pago, produtos } = req.body;

    // 1. Buscar o desconto do método de pagamento
    const qDesconto = `SELECT desconto FROM metodos WHERE id_metodo = ?`;

    db.query(qDesconto, [id_metodo], (err, dataDesconto) => {
        if (err) return res.json(err);

        let desconto = 0;
        if (dataDesconto.length > 0 && dataDesconto[0].desconto) {
            desconto = dataDesconto[0].desconto;
        }

        // 2. Calcular o valor final com o desconto
        const valorFinal = desconto > 0 ? valor_pago * (1 - desconto / 100) : valor_pago;

        // 3. Inserir os dados na tabela 'pagamentos'
        const qInserirPagamento = `
            INSERT INTO pagamentos (id_carrinho, id_metodo, id_barbearia, valor_pago)
            VALUES (?, ?, ?, ?)
        `;
        db.query(qInserirPagamento, [id_carrinho, id_metodo, id_barbearia, valorFinal], (err, resultPagamento) => {
            if (err) return res.json(err);

            // 4. Atualizar o estoque dos produtos, se enviados
            if (produtos && produtos.length > 0) {
                const promises = produtos.map((produto) => {
                    const { id_produto, quantidade } = produto;

                    // Buscar o estoque atual
                    const qProduto = `SELECT amount FROM products WHERE id = ?`;

                    return new Promise((resolve, reject) => {
                        db.query(qProduto, [id_produto], (err, dataProduto) => {
                            if (err) return reject(err);

                            if (dataProduto.length === 0) {
                                return reject(`Produto com id ${id_produto} não encontrado.`);
                            }

                            const { amount } = dataProduto[0];

                            // Verificar se há estoque suficiente
                            if (amount < quantidade) {
                                return reject(`Estoque insuficiente para o produto ${id_produto}.`);
                            }

                            // Atualizar o estoque do produto
                            const novoEstoque = amount - quantidade;
                            const qAtualizarProduto = `UPDATE products SET amount = ? WHERE id = ?`;

                            db.query(qAtualizarProduto, [novoEstoque, id_produto], (err) => {
                                if (err) return reject(err);
                                resolve();
                            });
                        });
                    });
                });

                // Executar todas as atualizações de produtos
                Promise.all(promises)
                    .then(() => {
                        // 5. Atualizar o status do carrinho para 'finalizado'
                        const qAtualizarCarrinho = `UPDATE carrinho SET status = 'finalizado' WHERE id_carrinho = ?`;
                        db.query(qAtualizarCarrinho, [id_carrinho], (err) => {
                            if (err) return res.json(err);

                            // Resposta de sucesso
                            return res.status(200).json({
                                message: 'Compra finalizada com sucesso!',
                                valor_pago: valorFinal,
                            });
                        });
                    })
                    .catch((error) => {
                        return res.status(400).json({ error });
                    });
            } else {
                // Caso não tenha produtos, apenas finalize o carrinho
                const qAtualizarCarrinho = `UPDATE carrinho SET status = 'finalizado' WHERE id_carrinho = ?`;
                db.query(qAtualizarCarrinho, [id_carrinho], (err) => {
                    if (err) return res.json(err);

                    return res.status(200).json({
                        message: 'Compra finalizada com sucesso!',
                        valor_pago: valorFinal,
                        id_carrinho, // Incluindo o id_carrinho na respo
                    });
                });
            }
        });
    });
};
