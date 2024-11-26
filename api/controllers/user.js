import { db } from "../db.js";

export const getUsers = (req, res) => {
    const { id_barbearia } = req.query; // Obtém o id_barbearia dos parâmetros de consulta

    let q = `
        SELECT s.*, b.nome AS barbearia_nome, b.endereco AS barbearia_endereco
        FROM Servicos s
        JOIN Barbearias b ON s.id_barbearia = b.id_barbearia
        WHERE s.ativo = 1
    `;

    // Adiciona o filtro por id_barbearia, se fornecido
    if (id_barbearia) {
        q += ` AND s.id_barbearia = ?`;
    }

    db.query(q, id_barbearia ? [id_barbearia] : [], (err, data) => {
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
        WHERE s.id_servico = ? AND s.ativo = 1
    `;
    
    db.query(q, [id], (err, data) => {
        if (err) return res.json(err);

        // Verifica se o serviço existe e está ativo
        if (data.length === 0) {
            return res.status(404).json({ message: 'Serviço não encontrado ou desativado' });
        }

        return res.status(200).json(data[0]);
    });
};

export const updateService = (req, res) => {
    const { id } = req.params;
    const { nome, duracao, preco } = req.body;

    // Primeiro, busca o serviço atual para comparar com os novos dados
    const selectServiceQuery = "SELECT * FROM Servicos WHERE id_servico = ?";
    db.query(selectServiceQuery, [id], (err, data) => {
        if (err) return res.json(err);

        if (data.length === 0) {
            return res.status(404).json({ message: "Serviço não encontrado." });
        }

        const currentService = data[0];

        // Verifica se houve alguma alteração no nome ou preço
        if (currentService.nome === nome && currentService.preco === preco) {
            return res.status(400).json({ message: "Nenhuma modificação detectada no nome ou preço." });
        }

        // Atualiza o serviço com base no ID fornecido
        const updateQuery = "UPDATE Servicos SET nome = ?, duracao = ?, preco = ? WHERE id_servico = ?";

        db.query(updateQuery, [nome, duracao, preco, id], (err) => {
            if (err) return res.json(err);

            // Busca os dados do serviço atualizado
            const selectUpdatedServiceQuery = "SELECT * FROM Servicos WHERE id_servico = ?";
            db.query(selectUpdatedServiceQuery, [id], (err, data) => {
                if (err) return res.json(err);

                if (data.length === 0) {
                    return res.status(404).json({ message: "Serviço não encontrado." });
                }

                return res.status(200).json({
                    message: "Serviço atualizado com sucesso.",
                    service: data[0], // Retorna os dados do serviço atualizado
                });
            });
        });
    });
};

export const deleteService = (req, res) => {
    
    const q = "UPDATE Servicos SET ativo = 0 WHERE `id_servico` = ?";

    db.query(q, [req.params.id_servico], (err) => {
        if (err) return res.json({ message: err.message });

        return res.status(200).json({ message: "Serviço desativado com sucesso" });
    });
};

export const addService = (req, res) => {
    const { nome, duracao, preco, id_barbearia } = req.body;

    // Verificar se já existe um serviço ativo com o mesmo nome, preço e id_barbearia
    const checkActiveServiceQuery = `
        SELECT * FROM Servicos WHERE nome = ? AND preco = ? AND id_barbearia = ? AND ativo = 1
    `;
    
    db.query(checkActiveServiceQuery, [nome, preco, id_barbearia], (err, activeServiceData) => {
        if (err) return res.json(err);

        if (activeServiceData.length > 0) {
            return res.status(400).json({ message: 'Já existe um serviço ativo com esse nome, preço e barbearia.' });
        }

        // Verificar se existe um serviço desativado com o mesmo nome, preço e id_barbearia
        const checkInactiveServiceQuery = `
            SELECT * FROM Servicos WHERE nome = ? AND preco = ? AND id_barbearia = ? AND ativo = 0
        `;
        
        db.query(checkInactiveServiceQuery, [nome, preco, id_barbearia], (err, inactiveServiceData) => {
            if (err) return res.json(err);

            if (inactiveServiceData.length > 0) {
                // Reativar o serviço desativado
                const updateServiceQuery = `
                    UPDATE Servicos SET ativo = 1 WHERE nome = ? AND preco = ? AND id_barbearia = ? AND ativo = 0
                `;
                
                db.query(updateServiceQuery, [nome, preco, id_barbearia], (err) => {
                    if (err) return res.json(err);

                    // Buscar os dados do serviço reativado
                    const getServiceQuery = `
                        SELECT * FROM Servicos WHERE nome = ? AND preco = ? AND id_barbearia = ? AND ativo = 1
                    `;
                    
                    db.query(getServiceQuery, [nome, preco, id_barbearia], (err, reactivatedServiceData) => {
                        if (err) return res.json(err);

                        return res.status(200).json({ 
                            message: 'Serviço já existia, foi reativado com sucesso.',
                            service: reactivatedServiceData[0]  // Retorna os dados do serviço reativado
                        });
                    });
                });
            } else {
                // Caso não exista nenhum serviço com o mesmo nome, preço e barbearia
                const insertServiceQuery = `
                    INSERT INTO Servicos (nome, duracao, preco, id_barbearia) VALUES (?, ?, ?, ?)
                `;

                db.query(insertServiceQuery, [nome, duracao, preco, id_barbearia], (err) => {
                    if (err) return res.json(err);

                    // Buscar os dados do serviço recém-adicionado
                    const getServiceQuery = `
                        SELECT * FROM Servicos WHERE nome = ? AND preco = ? AND id_barbearia = ? AND ativo = 1
                    `;
                    
                    db.query(getServiceQuery, [nome, preco, id_barbearia], (err, addedServiceData) => {
                        if (err) return res.json(err);

                        return res.status(200).json({ 
                            message: 'Serviço adicionado com sucesso.',
                            service: addedServiceData[0]  // Retorna os dados do serviço recém-adicionado
                        });
                    });
                });
            }
        });
    });
};




export const getBarbearias = (_, res) => {
    const q = "SELECT * FROM Barbearias";
    
    db.query(q, (err, data) => {
        if (err) return res.json(err);

        return res.status(200).json(data);
    });
};


