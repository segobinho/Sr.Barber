import { db } from "../db.js"
// todos os clientes
export const getClientes = (_, res) => {
    const q = "SELECT * FROM clientes";
    
    db.query(q, (err, data) => {
        if (err) return res.json(err);

        return res.status(200).json(data);
    });
};

// add clientes
export const addClientes = (req, res) => {
    const { nome, endereco, telefone, id_barbearia } = req.body;
    const q = "INSERT INTO clientes (nome, endereco, telefone, id_barbearia) VALUES (?, ?, ?, ?)";

    db.query(q, [nome, endereco, telefone, id_barbearia], (err, data) => {
        if (err) return res.json(err);

        return res.status(200).json("Serviço adicionado com sucesso");
    });
};