import { db } from "../db.js"

export const getClientes = (req, res) => {
    const { cargo } = req.query;  // Corrigido para req.query
    const { id_barbearia } = req.query; // Também usando req.query

    let q;

    if (cargo === 'admin') {
        // Se o cargo for admin, buscar todos os clientes
        q = "SELECT * FROM clientes WHERE ativo = true";
    } else if (cargo === 'gerente') {
        // Se o cargo for gerente, buscar apenas os clientes da mesma barbearia
        q = "SELECT * FROM clientes WHERE id_barbearia = ? AND ativo = true";
    } else {
        // Caso o cargo não seja válido, retornar erro
        return res.status(403).json({ message: "Acesso negado" });
    }

    // Executa a consulta com ou sem o id_barbearia dependendo do cargo
    db.query(q, cargo === 'gerente' ? [id_barbearia] : [], (err, data) => {
        if (err) return res.status(500).json({ error: err.message });

        return res.status(200).json(data);
    });
};


// Adicionar cliente
export const addClientes = (req, res) => {
    const { nome, endereco, telefone, id_barbearia } = req.body;

    // Consulta para verificar se o cliente já existe na mesma barbearia
    const qCheck = "SELECT * FROM clientes WHERE nome = ? AND endereco = ? AND telefone = ? AND id_barbearia = ?";

    db.query(qCheck, [nome, endereco, telefone, id_barbearia], (err, data) => {
        if (err) return res.status(500).json({ error: err.message });

        if (data.length > 0) {
            if (data[0].ativo) {
                // Se o cliente já existir e estiver ativo, retorna uma mensagem indicando isso
                return res.status(200).json({ message: "Cliente já existe e está ativo" });
            } else {
                const qUpdate = "UPDATE clientes SET ativo = true WHERE id_cliente = ?";
                db.query(qUpdate, [data[0].id_cliente], (err, result) => {
                    if (err) return res.status(500).json({ error: err.message });

                    // Retorna os dados do cliente reativado
                    return res.status(200).json({
                        id_cliente: data[0].id_cliente,
                        nome: data[0].nome,
                        endereco: data[0].endereco,
                        telefone: data[0].telefone,
                        id_barbearia: data[0].id_barbearia,
                        message: "Cliente já existia, foi reativado"
                    });
                });
            }
        } else {
            // Se o cliente não existir, adici  oná-lo
            const qInsert = "INSERT INTO clientes (nome, endereco, telefone, id_barbearia, ativo) VALUES (?, ?, ?, ?, true)";

            db.query(qInsert, [nome, endereco, telefone, id_barbearia], (err, result) => {
                if (err) return res.status(500).json({ error: err.message });

                return res.status(201).json({ id_cliente: result.insertId, nome, endereco, telefone, id_barbearia });
            });
        }
    });
};




// Editar cliente
export const editCliente = (req, res) => {
    const { nome, endereco, telefone, id_barbearia } = req.body; // Adicione id_barbearia
    const clienteId = req.params.id_cliente; // Use o nome correto do parâmetro da rota

    // Ajuste a consulta SQL para incluir id_barbearia
    const q = "UPDATE clientes SET nome = ?, endereco = ?, telefone = ?, id_barbearia = ? WHERE id_cliente = ?";

    db.query(q, [nome, endereco, telefone, id_barbearia, clienteId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Cliente não encontrado" });
        }

        // Retorne o cliente atualizado ou qualquer outra informação necessária
        return res.status(200).json({ id_cliente: clienteId, nome, endereco, telefone, id_barbearia }); // Inclua id_barbearia na resposta
    });
};



export const removeCliente = (req, res) => {
    const clienteId = req.params.id_cliente;

    const query = "UPDATE clientes SET ativo = false WHERE id_cliente = ?";
    db.query(query, [clienteId], (err, result) => {
        if (err) {
            console.error("Erro ao desativar cliente:", err);
            return res.status(500).json({ error: "Erro interno ao desativar cliente" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Cliente não encontrado" });
        }

        res.status(200).json({ message: "Cliente desativado com sucesso" });
    });
};
 