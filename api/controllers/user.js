import { db } from "../db.js";

export const getUsers = (_, res) => {
    const q = `
        SELECT s.*, b.nome AS barbearia_nome, b.endereco AS barbearia_endereco
        FROM Servicos s
        JOIN Barbearias b ON s.id_barbearia = b.id_barbearia
    `;
    
    db.query(q, (err, data) => {
        if (err) return res.json(err);

        return res.status(200).json(data);
    });
};


export const getServiceById = (req, res) => {
    const { id } = req.params;
    const q = `
        SELECT s.*, b.nome AS barbearia_nome, b.endereco AS barbearia_endereco
        FROM Servicos s
        JOIN Barbearias b ON s.id_barbearia = b.id_barbearia
        WHERE s.id_servico = ?
    `;
    
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

export const deleteService = (req, res) => {
    
    const q = "DELETE FROM Servicos WHERE `id_servico` = ?";

    db.query(q, [req.params.id_servico], (err) => {
        if (err) return res.json(err);

        return res.status(200).json("Serviço excluído com sucesso");
    });
};

export const addService = (req, res) => {
    const { nome, duracao, preco, id_barbearia } = req.body;
    const q = "INSERT INTO Servicos (nome, duracao, preco, id_barbearia) VALUES (?, ?, ?, ?)";

    db.query(q, [nome, duracao, preco, id_barbearia], (err, data) => {
        if (err) return res.json(err);

        return res.status(200).json("Serviço adicionado com sucesso");
    });
};


export const getBarbearias = (_, res) => {
    const q = "SELECT * FROM Barbearias";
    
    db.query(q, (err, data) => {
        if (err) return res.json(err);

        return res.status(200).json(data);
    });
};
