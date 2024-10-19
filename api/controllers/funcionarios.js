import { db } from "../db.js";
import fs from 'fs'; // Importar o módulo fs para manipulação de arquivos



// Todos os funcionários
export const getFuncionarios = (req, res) => {
    const { cargo } = req.query;  // Corrigido para req.query
    const { id_barbearia } = req.query; // Também usando req.query

    let q;

    if (cargo === 'admin') {
        // Se o cargo for 'admin', buscar todos os funcionários
        q = "SELECT * FROM funcionarios";
    } else if (cargo === 'gerente') {
        // Se o cargo for 'gerente', buscar apenas os funcionários da barbearia correspondente
        q = "SELECT * FROM funcionarios WHERE id_barbearia = ?";
    } else {
        // Caso o cargo não seja admin ou gerente, pode retornar uma resposta vazia ou um erro, se desejar
        return res.status(403).json({ error: "Acesso negado" });
    }

    // Executar a consulta
    db.query(q, [id_barbearia], (err, data) => {
        if (err) return res.status(500).json({ error: err.message });

        // Verifica se a consulta retornou algum funcionário
        if (data.length === 0) {
            return res.status(404).json({ message: "Ainda não possui funcionários" });
        }

        return res.status(200).json(data);
    });
};


export const getFuncionarioById = (req, res) => {
    const { id_funcionario } = req.params;  // Recebe o id_funcionario a partir dos parâmetros da URL

    const q = "SELECT * FROM funcionarios WHERE id_funcionario = ?";

    // Executa a consulta no banco de dados
    db.query(q, [id_funcionario], (err, data) => {
        if (err) {
            return res.status(500).json({ error: err.message }); // Retorna erro de servidor
        }

        // Verifica se encontrou o funcionário com o id fornecido
        if (data.length === 0) {
            return res.status(404).json({ message: "Funcionário não encontrado" }); // Retorna erro 404 se não encontrar o funcionário
        }

        return res.status(200).json(data[0]); // Retorna os dados do funcionário
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
    const { nome, telefone, email, cpf } = req.body;
    const funcionarioId = req.params.id_funcionario;
    let imageName = null;

    // Verifica se uma nova imagem foi enviada
    if (req.file) {
        imageName = req.file.filename; // Pega o nome da nova imagem
    }

    // Primeiro, buscamos o funcionário para pegar a imagem atual
    db.query("SELECT imagens FROM funcionarios WHERE id_funcionario = ?", [funcionarioId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao buscar o funcionário." });
        }

        // Verifica se o funcionário existe
        if (result.length === 0) {
            return res.status(404).json({ message: "Funcionário não encontrado." });
        }

        // Se uma nova imagem foi enviada, removemos a imagem antiga
        const oldImageName = result[0].imagens; // Nome da imagem atual

        if (imageName && oldImageName) {
            const oldImagePath = `../images/${oldImageName}`; // Ajuste o caminho conforme necessário
            fs.unlink(oldImagePath, (err) => {
                if (err) {
                    console.error("Erro ao remover a imagem antiga:", err);
                }
            });
        }

        // Monta a consulta SQL para atualizar os dados do funcionário
        let query = "UPDATE funcionarios SET nome = ?, telefone = ?, email = ?, cpf = ?";
        const queryParams = [nome, telefone, email, cpf];

        // Se uma nova imagem foi enviada, adiciona a coluna `imagens` à consulta
        if (imageName) {
            query += ", imagens = ?";
            queryParams.push(imageName);
        }

        query += " WHERE id_funcionario = ?";
        queryParams.push(funcionarioId);

        // Executa a consulta para atualizar os dados
        db.query(query, queryParams, (err, result) => {
            if (err) {
                return res.status(500).json({ error: "Erro ao atualizar o funcionário." });
            }

            // Verifica se alguma linha foi afetada
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Funcionário não encontrado." });
            }

            // Monta a resposta
            const response = {
                id_funcionario: funcionarioId,
                nome,
                telefone,
                email,
                cpf,
            };

            // Se a imagem foi atualizada, inclui o URL da nova imagem no retorno
            if (imageName) {
                response.imageUrl = `/images/${imageName}`;
            }

            return res.status(200).json(response);
        });
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


export const getBarbeiros = (_, res) => {
    const q = "SELECT * FROM funcionarios WHERE cargo = 'barbeiro'";
  
    db.query(q, (err, data) => {
      if (err) return res.status(500).json({ error: err.message });
  
      return res.status(200).json(data);
    });
  };
  

  export const uploadImage = (req, res) => {
    // Nome da imagem
    const imageName = req.file.filename;
    
    // Pega o id_funcionario do corpo da requisição
    const { id_funcionario } = req.body;

    // Salvar o nome da imagem na tabela funcionarios
    const query = "UPDATE funcionarios SET imagens = ? WHERE id_funcionario = ?";
    db.query(query, [imageName, id_funcionario], (error, results) => {
        if (error) {
            return res.status(500).json({ error: "Erro ao salvar a imagem no banco de dados." });
        }

        // Verifica se nenhuma linha foi afetada
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "Funcionário não encontrado ou nenhuma linha foi atualizada." });
        }

        // Retorna o caminho da imagem salva
        const imagePath = `/images/${imageName}`;
        return res.status(201).json({ imageUrl: imagePath });
    });
};