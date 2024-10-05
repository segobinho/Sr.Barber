import { db } from "../db.js";


// Todos os funcionários
export const getFuncionarios = (_, res) => {
    const q = "SELECT * FROM funcionarios";


    db.query(q, (err, data) => {
        if (err) return res.status(500).json({ error: err.message });


        return res.status(200).json(data);
    });
};


// Adicionar funcionário
export const addFuncionario = (req, res) => {
    const { nome, cargo, telefone, id_barbearia } = req.body;
    const q = "INSERT INTO funcionarios (nome, cargo, telefone, id_barbearia) VALUES (?, ?, ?, ?)";


    db.query(q, [nome, cargo, telefone, id_barbearia], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });


        return res.status(201).json({ id: result.insertId, nome, cargo, telefone, id_barbearia });
    });
};


// Editar funcionário
export const editFuncionario = (req, res) => {
    const { nome, cargo, telefone } = req.body;
    const funcionarioId = req.params.id_funcionario;


    const q = "UPDATE funcionarios SET nome = ?, cargo = ?, telefone = ? WHERE id_funcionario = ?";


    db.query(q, [nome, cargo, telefone, funcionarioId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });


        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Funcionário não encontrado" });
        }


        return res.status(200).json({ id_funcionario: funcionarioId, nome, cargo, telefone });
    });
};


// Remover funcionário
export const removeFuncionario = (req, res) => {
    const funcionarioId = req.params.id_funcionario;


    const q = "DELETE FROM funcionarios WHERE id_funcionario = ?";


    db.query(q, [funcionarioId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });


        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Funcionário não encontrado" });
        }


        return res.status(200).json({ message: "Funcionário deletado com sucesso" });
    });
};
