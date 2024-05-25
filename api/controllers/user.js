import { db } from "../db.js";

export const getUsers = (_, res) => {
    const q = "SELECT * FROM Servicos";
    
    db.query(q, (err, data) => {
        if (err) return res.json(err);

        return res.status(200).json(data);
    });
};

export const getServiceById = (req, res) => {
    const { id } = req.params;
    const q = "SELECT * FROM Servicos WHERE id_servico = ?";
    
    db.query(q, [id], (err, data) => {
        if (err) return res.json(err);

        return res.status(200).json(data[0]);
    });
};

export const updateService = (req, res) => {
    const { id } = req.params;
    const { nome, duracao, preco } = req.body;
    const q = "UPDATE Servicos SET nome = ?, duracao = ?, preco = ? WHERE id_servico = ?";

    db.query(q, [nome, duracao, preco, id], (err, data) => {
        if (err) return res.json(err);

        return res.status(200).json("Serviço atualizado com sucesso");
    });
};

// Função para excluir um serviço
export const deleteService = (req, res) => {
    const { id } = req.params;
    const q = "DELETE FROM Servicos WHERE id_servico = ?";

    db.query(q, [id], (err, data) => {
        if (err) return res.json(err);

        return res.status(200).json("Serviço excluído com sucesso");
    });
};
