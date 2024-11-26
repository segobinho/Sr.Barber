import { db } from "../db.js";
import fs from 'fs'; // Importar o módulo fs para manipulação de arquivos



export const getFuncionariosBG = (req, res) => {
    const { cargo } = req.query;  // Corrigido para req.query
    const { id_barbearia } = req.query; // Também usando req.query

    let q;

    if (cargo === 'admin') {
        // Se o cargo for 'admin', buscar todos os funcionários ativos, excluindo os 'admin'
        q = "SELECT * FROM funcionarios WHERE cargo != 'admin' AND ativo = 1";
    } else if (cargo === 'Gerente' || cargo === 'Barbeiro'  || cargo === 'Recepcionista') {
        // Se o cargo for 'gerente' ou 'barbeiro', buscar os funcionários ativos da barbearia correspondente
        q = "SELECT * FROM funcionarios WHERE id_barbearia = ? AND cargo IN ('gerente', 'barbeiro') AND ativo = 1";
    } else {
        // Caso o cargo não seja admin, gerente ou barbeiro, retorna um erro
        return res.status(403).json({ message: "Acesso negado" });
    }

    // Executar a consulta
    db.query(q, [id_barbearia], (err, data) => {
        if (err) return res.status(500).json({ message: err.message });

        // Verifica se a consulta retornou algum funcionário
        if (data.length === 0) {
            return res.status(404).json({ message: "Ainda não possui funcionários ativos com o cargo solicitado" });
        }

        return res.status(200).json(data);
    });
};




// Todos os funcionários
export const getFuncionarios = (req, res) => {
    const { cargo } = req.query;  // Corrigido para req.query
    const { id_barbearia } = req.query; // Também usando req.query

    let q;

    if (cargo === 'admin') {
        // Se o cargo for 'admin', buscar todos os funcionários ativos, excluindo os 'admin'
        q = "SELECT * FROM funcionarios WHERE cargo != 'admin' AND ativo = 1";
    } else if (cargo === 'Gerente' || cargo === 'Recepcionista' || cargo === 'Barbeiro') {
        // Se o cargo for 'gerente', buscar apenas os funcionários da barbearia correspondente e ativos, excluindo os 'admin'
        q = "SELECT * FROM funcionarios WHERE id_barbearia = ? AND cargo != 'admin' AND ativo = 1";
        
    } else {
        // Caso o cargo não seja admin ou gerente, pode retornar uma resposta vazia ou um erro, se desejar
        return res.status(403).json({ message: "Acesso negado" });
    }

    // Executar a consulta
    db.query(q, [id_barbearia], (err, data) => {
        if (err) return res.status(500).json({ message: err.message });

        // Verifica se a consulta retornou algum funcionário
        if (data.length === 0) {
            return res.status(404).json({ message: "Ainda não possui funcionários ativos" });
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
    const { nome, email, password, cargo, id_barbearia } = req.body;
    const senha = 1;  // A senha será sempre 1

    // Primeiro, verificar se já existe um funcionário com o mesmo e-mail
    const checkEmailQuery = "SELECT * FROM funcionarios WHERE email = ?";

    db.query(checkEmailQuery, [email], (err, result) => {
        if (err) return res.status(500).json({ message: err.message });

        if (result.length > 0) {
            // Se o funcionário já existir, verificar o status ativo
            const existingFuncionario = result[0];
            if (existingFuncionario.ativo === 0) {
                // Ativar o funcionário
                const updateQuery = "UPDATE funcionarios SET ativo = 1 WHERE id_funcionario = ?";
                db.query(updateQuery, [existingFuncionario.id_funcionario], (err, updateResult) => {
                    if (err) return res.status(500).json({ message: err.message });

                    return res.status(200).json({
                        message: 'Funcionário reativado com sucesso.',
                        id_funcionario: existingFuncionario.id_funcionario,
                        nome: existingFuncionario.nome,
                        cargo: existingFuncionario.cargo,
                        email: existingFuncionario.email,
                        ativo: 1
                    });
                });
            } else {
                // Se já estiver ativo, retornar erro
                return res.status(400).json({ message: 'Já existe um funcionário ativo com este e-mail.' });
            }
        } else {
            // Se o funcionário não existir, inserir um novo
            const insertQuery = "INSERT INTO funcionarios (id_barbearia, nome, cargo, email, senha, password) VALUES (?, ?, ?, ?, ?, ?)";
            db.query(insertQuery, [id_barbearia, nome, cargo, email, senha, password], (err, result) => {
                if (err) return res.status(500).json({ message: err.message });

                return res.status(201).json({
                    message: 'Funcionário adicionado com sucesso.',
                    id: result.insertId,
                    id_barbearia,
                    nome,
                    cargo,
                    email,
                    senha,
                    password
                });
            });
        }
    });
};


// Editar funcionário

export const editFuncionario = (req, res) => {
    const { nome, telefone, email, cpf, password } = req.body;
    const funcionarioId = req.params.id_funcionario;
    let imageName = null;

    if (req.file) {
        imageName = req.file.filename; // Nome da nova imagem
    }

    // Verifica se o CPF ou Email já existem para outro funcionário
    const checkQuery = `
        SELECT * FROM funcionarios 
        WHERE (email = ? OR cpf = ?) AND id_funcionario != ?
    `;

    db.query(checkQuery, [email, cpf, funcionarioId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao verificar email ou CPF." });
        }

        if (result.length > 0) {
            const existingFields = [];
            if (result[0].email === email) existingFields.push("email");
            if (result[0].cpf === cpf) existingFields.push("CPF");

            return res.status(400).json({
                message: `Os seguintes campos já estão em uso: ${existingFields.join(", ")}.`,
            });
        }

        // Busca o funcionário atual para verificar alterações
        db.query(
            "SELECT * FROM funcionarios WHERE id_funcionario = ?",
            [funcionarioId],
            (err, result) => {
                if (err) {
                    return res.status(500).json({ error: "Erro ao buscar o funcionário." });
                }

                if (result.length === 0) {
                    return res.status(404).json({ message: "Funcionário não encontrado." });
                }

                const funcionarioAtual = result[0]; // Dados atuais do funcionário

                // Verifica se algum campo foi modificado
                const isModified =
                    nome !== funcionarioAtual.nome ||
                    telefone !== funcionarioAtual.telefone ||
                    email !== funcionarioAtual.email ||
                    cpf !== funcionarioAtual.cpf ||
                    (password && password !== funcionarioAtual.password) || // Apenas compara senha se ela foi enviada
                    (imageName && imageName !== funcionarioAtual.imagens); // Compara a imagem se uma nova foi enviada

                if (!isModified) {
                    return res.status(400).json({ message: "Nenhuma alteração foi feita." });
                }

                // Remove a imagem antiga se uma nova foi enviada
                if (imageName && funcionarioAtual.imagens) {
                    const oldImagePath = `../images/${funcionarioAtual.imagens}`;
                    fs.unlink(oldImagePath, (err) => {
                        if (err) {
                            console.error("Erro ao remover a imagem antiga:", err);
                        }
                    });
                }

                // Monta a consulta SQL para atualizar os dados do funcionário
                let query =
                    "UPDATE funcionarios SET nome = ?, telefone = ?, email = ?, cpf = ?";
                const queryParams = [nome, telefone, email, cpf];

                if (password) {
                    query += ", password = ?";
                    queryParams.push(password);
                }

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

                    if (result.affectedRows === 0) {
                        return res.status(404).json({ message: "Funcionário não encontrado." });
                    }

                    const response = {
                        id_funcionario: funcionarioId,
                        nome,
                        telefone,
                        email,
                        cpf,
                    };

                    if (imageName) {
                        response.imageUrl = `/images/${imageName}`;
                    }

                    return res.status(200).json(response);
                });
            }
        );
    });
};






// Remover funcionário
export const removeFuncionario = (req, res) => {
    const funcionarioId = req.params.id_funcionario;

    // Consulta para desativar o funcionário
    const q = "UPDATE funcionarios SET ativo = 0 WHERE id_funcionario = ?";

    db.query(q, [funcionarioId], (err, result) => {
        if (err) return res.status(500).json({ message: err.message });

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Funcionário não encontrado" });
        }

        return res.status(200).json({ message: "Funcionário desativado com sucesso" });
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

