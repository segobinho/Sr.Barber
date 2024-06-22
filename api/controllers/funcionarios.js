import { db } from "../db.js";
export const getFuncionarios = (_, res) => {
    const q = `
        SELECT *
        FROM Funcionarios
    `;
    
    db.query(q, (err, data) => {
        if (err) return res.json(err);

        return res.status(200).json(data);
    });
};
