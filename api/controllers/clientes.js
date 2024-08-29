import { db } from "../db.js"

// Todos os clientes
export const getClientes = (_, res) => {
    const q = "SELECT * FROM clientes";
    
    db.query(q, (err, data) => {
        if (err) return res.status(500).json({ error: err.message });

        return res.status(200).json(data);
    });
};

// Adicionar cliente
export const addClientes = (req, res) => {
    const { nome, endereco, telefone, id_barbearia } = req.body;
    const q = "INSERT INTO clientes (nome, endereco, telefone, id_barbearia) VALUES (?, ?, ?, ?)";

    db.query(q, [nome, endereco, telefone, id_barbearia], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        return res.status(201).json({ id: result.insertId, nome, endereco, telefone, id_barbearia });
    });
};

// Editar cliente
export const editCliente = (req, res) => {
    const { nome, endereco, telefone } = req.body; // Remova id_barbearia se não for necessário
    const clienteId = req.params.id_cliente; // Use o nome correto do parâmetro da rota

    // Ajuste a consulta SQL para usar o nome correto do campo do ID
    const q = "UPDATE clientes SET nome = ?, endereco = ?, telefone = ? WHERE id_cliente = ?";

    db.query(q, [nome, endereco, telefone, clienteId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Cliente não encontrado" });
        }

        // Retorne o cliente atualizado ou qualquer outra informação necessária
        return res.status(200).json({ id_cliente: clienteId, nome, endereco, telefone });
    });
};


export const removeCliente = (req, res) => {
    const clienteId = req.params.id_cliente;  // Ajustado para corresponder ao nome do parâmetro da rota

    const q = "DELETE FROM clientes WHERE id_cliente = ?";

    db.query(q, [clienteId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Cliente não encontrado" });
        }

        return res.status(200).json({ message: "Cliente deletado com sucesso" });
    });
};
 