import { db } from "../db.js";


export const addBarbearia = (req, res) => {
    const { nome, endereco, email, telefone, id_barbearia } = req.body;

    if (!nome || !endereco || !email || !telefone) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios." });
    }

    // Verificar se já existe uma barbearia com o mesmo nome
    const checkQuery = "SELECT * FROM Barbearias WHERE nome = ?";
    db.query(checkQuery, [nome], (err, data) => {
        if (err) {
            return res.status(500).json({ message: "Erro ao verificar barbearia.", details: err });
        }

        if (data.length > 0) {
            return res.status(409).json({ message: "Barbearia já existe." });
        }

        // Inserir a nova barbearia
        const insertQuery = "INSERT INTO Barbearias (nome, endereco, email, telefone) VALUES (?, ?, ?, ?)";
        db.query(insertQuery, [nome, endereco, email, telefone], (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Erro ao adicionar barbearia.", details: err });
            }

            const newBarbeariaId = result.insertId;

            // Buscar os dados completos da barbearia criada
            const selectQuery = "SELECT * FROM Barbearias WHERE id_barbearia = ?";
            db.query(selectQuery, [newBarbeariaId], (err, data) => {
                if (err) {
                    return res.status(500).json({ message: "Erro ao buscar dados da barbearia criada.", details: err });
                }

                return res.status(201).json({
                    message: "Barbearia adicionada com sucesso!",
                    ...data[0], // Inclui os dados da barbearia diretamente no objeto de resposta
                });
            });
        });
    });
};


export const updateBarbearia = (req, res) => {
    const { id } = req.params;  // Extraindo o id da barbearia da URL
    const { nome, endereco, email, telefone } = req.body;

    if (!nome || !endereco || !email || !telefone) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios." });
    }

    // Verificar se a barbearia existe
    const checkQuery = "SELECT * FROM Barbearias WHERE id_barbearia = ?";
    db.query(checkQuery, [id], (err, data) => {
        if (err) {
            return res.status(500).json({ message: "Erro ao verificar a barbearia.", details: err });
        }

        if (data.length === 0) {
            return res.status(404).json({ message: "Barbearia não encontrada." });
        }

        // Atualizar os dados da barbearia
        const updateQuery = `
            UPDATE Barbearias 
            SET nome = ?, endereco = ?, email = ?, telefone = ? 
            WHERE id_barbearia = ?
        `;
        db.query(updateQuery, [nome, endereco, email, telefone, id], (err) => {
            if (err) {
                return res.status(500).json({ message: "Erro ao atualizar a barbearia.", details: err });
            }

            // Retornar os dados atualizados
            const selectQuery = "SELECT * FROM Barbearias WHERE id_barbearia = ?";
            db.query(selectQuery, [id], (err, updatedData) => {
                if (err) {
                    return res.status(500).json({ message: "Erro ao buscar os dados atualizados.", details: err });
                }

                return res.status(200).json({
                    message: "Barbearia atualizada com sucesso!",
                    ...updatedData[0], // Inclui os dados atualizados diretamente no objeto de resposta
                });
            });
        });
    });
};
