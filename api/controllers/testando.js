import { db } from "../db.js";

export const testesla = (req, res) => {
    const q = "SELECT * FROM funcionarios WHERE `email` = ? AND `password` = ?";
   

    db.query(q, [req.body.email,req.body.password ], (err, data) => {
        if (err) {
            return res.json("error");
        } 

       if(data.length > 0) {
        return res.json({
            status: "Sucesso",
            cargo: data[0].cargo,
            id_barbearia: data[0].id_barbearia,
            id_funcionario: data[0].id_funcionario // Inclui o id do funcionário

        });
       }else {
        return res.json("fail");

       }
    });
};
