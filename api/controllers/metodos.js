import { db } from "../db.js";

// Função para adicionar um método de pagamento
export const addMetodo = (req, res) => {
  const { nome_metodo, desconto } = req.body;

  // Verificar se os campos necessários foram preenchidos
  if (!nome_metodo || !desconto) {
    return res.status(400).json({ message: "Nome do método e desconto são obrigatórios" });
  }

  const q = `
    INSERT INTO metodos (nome_metodo, desconto)
    VALUES (?, ?);
  `;

  db.query(q, [nome_metodo, desconto], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Erro ao adicionar o método", error: err });
    }
    // Retornar os dados do método adicionado
    return res.status(201).json({
      message: "Método adicionado com sucesso",
      metodo: {
        id_metodo: result.insertId,
        nome_metodo,
        desconto,
      }
    });
  });
};

// Função para editar um método de pagamento
export const editMetodo = (req, res) => {
  const { id_metodo } = req.params;
  const { nome_metodo, desconto } = req.body;

  // Verificar se os campos necessários foram preenchidos
  if (!nome_metodo || !desconto) {
    return res.status(400).json({ message: "Nome do método e desconto são obrigatórios" });
  }

  const q = `
    UPDATE metodos
    SET nome_metodo = ?, desconto = ?
    WHERE id_metodo = ?;
  `;

  db.query(q, [nome_metodo, desconto, id_metodo], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Erro ao editar o método", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Método não encontrado" });
    }
    // Retornar os dados do método editado
    return res.status(200).json({
      message: "Método atualizado com sucesso",
      metodo: {
        id_metodo,
        nome_metodo,
        desconto,
      }
    });
  });
};

// Função para remover um método de pagamento
export const removeMetodo = (req, res) => {
  const { id_metodo } = req.params;

  const q = `
    DELETE FROM metodos
    WHERE id_metodo = ?;
  `;

  db.query(q, [id_metodo], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Erro ao remover o método", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Método não encontrado" });
    }
    // Retornar a confirmação de remoção
    return res.status(200).json({
      message: "Método removido com sucesso",
      id_metodo,
    });
  });
};
