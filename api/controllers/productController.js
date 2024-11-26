import { db } from "../db.js";

// Get all products
export const getProducts = (req, res) => {
    const { id_barbearia } = req.query; // Obtém o filtro da URL

    let q = `
        SELECT 
            p.id AS id_produto, 
            p.barcode, 
            p.name, 
            p.salePrice, 
            p.amount, 
            p.expirationDate, 
            p.id_barbearia, 
            p.price, 
            b.nome AS nome_barbearia
        FROM products p
        LEFT JOIN barbearias b ON p.id_barbearia = b.id_barbearia
    `;

    const params = [];

    // Adiciona o filtro de `id_barbearia` se fornecido
    if (id_barbearia) {
        q += " WHERE p.id_barbearia = ?";
        params.push(id_barbearia);
    }

    db.query(q, params, (err, data) => {
        if (err) {
            console.error('Erro ao buscar produtos:', err);
            return res.status(500).json({ message: "Erro ao buscar produtos." });
        }

        return res.status(200).json(data);
    });
};

// Add a product
export const addProduct = (req, res) => {
    const { barcode, name, price, salePrice, amount, expirationDate, id_barbearia } = req.body;

    // Verifica se os dados obrigatórios estão presentes
    if (!name || !salePrice || !amount || !id_barbearia) {
        return res.status(400).json({ error: "Dados obrigatórios faltando: nome, preço de venda, quantidade e barbearia." });
    }

    // Query para adicionar o produto
    const insertQuery = `
        INSERT INTO products (barcode, name, price, salePrice, amount, expirationDate, id_barbearia) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    // Executa a query de inserção
    db.query(insertQuery, [barcode || null, name, price || null, salePrice, amount, expirationDate || null, id_barbearia], (err, result) => {
        if (err) {
            console.error("Erro ao adicionar produto:", err);
            return res.status(500).json({ error: "Erro ao adicionar produto. Tente novamente mais tarde." });
        }

        // Obtém o produto recém-adicionado com base no ID gerado
        const selectQuery = `
            SELECT 
                p.id AS id_produto, 
                p.barcode, 
                p.name, 
                p.salePrice, 
                p.amount, 
                p.expirationDate, 
                p.id_barbearia, 
                p.price, 
                b.nome AS nome_barbearia
            FROM products p
            LEFT JOIN barbearias b ON p.id_barbearia = b.id_barbearia
            WHERE p.id = ?
        `;

        db.query(selectQuery, [result.insertId], (err, data) => {
            if (err) {
                console.error("Erro ao buscar o produto adicionado:", err);
                return res.status(500).json({ error: "Erro ao buscar o produto adicionado." });
            }

            return res.status(201).json(data[0]); // Retorna o produto recém-criado
        });
    });
};


// Edit a product
export const editProduct = (req, res) => {
    const { barcode, name, price, salePrice, amount, expirationDate, id_barbearia } = req.body;
    const productId = req.params.id;

    // Verifica se os dados necessários estão presentes
    if (!name || !salePrice || !amount) {
        return res.status(400).json({ message: "Dados obrigatórios faltando: nome, preço de venda e quantidade." });
    }

    const q = "UPDATE products SET barcode = ?, name = ?, price = ?, salePrice = ?, amount = ?, expirationDate = ?, id_barbearia = ? WHERE id = ?";

    db.query(q, [barcode || null, name, price || null, salePrice, amount, expirationDate || null, id_barbearia, productId], (err, data) => {
        if (err) {
            console.error('Erro no banco:', err);
            return res.status(500).json({ message: "Erro ao atualizar produto. Tente novamente mais tarde." });
        }

        if (data.affectedRows === 0) {
            return res.status(404).json({ message: "Produto não encontrado ou não atualizado." });
        }

        // Recupera o produto atualizado
        const selectQuery = "SELECT * FROM products WHERE id = ?";
        db.query(selectQuery, [productId], (err, result) => {
            if (err) {
                console.error('Erro ao recuperar produto:', err);
                return res.status(500).json({ message: "Erro ao recuperar produto atualizado." });
            }

            return res.status(200).json(result[0]); // Retorna o produto atualizado
        });
    });
};


// Delete a product
export const deleteProduct = (req, res) => {
    const productId = req.params.id;
    const q = "DELETE FROM products WHERE id = ?";

    db.query(q, [productId], (err, data) => {
        if (err) return res.json(err);

        return res.status(200).json("Product deleted successfully");
    });
};




export const adicionarProdutosCarrinho = (req, res) => {
    const { id_carrinho, produtos } = req.body;

    // Verificar se os produtos foram passados na requisição
    if (!produtos || produtos.length === 0) {
        return res.status(400).json({ message: 'Nenhum produto foi fornecido.' });
    }

    const promises = produtos.map((produto) => {
        const { id_produto, quantidade, preco_unitario } = produto;

        return new Promise((resolve, reject) => {
            // Verificar se o produto já está no carrinho
            const qVerificarProduto = `
                SELECT id_produto FROM itenscarrinho
                WHERE id_carrinho = ? AND id_produto = ?
            `;

            db.query(qVerificarProduto, [id_carrinho, id_produto], (err, results) => {
                if (err) return reject(err);

                if (results.length > 0) {
                    if (quantidade === 0) {
                        // Remover produto do carrinho
                        const qRemoverProduto = `
                            DELETE FROM itenscarrinho
                            WHERE id_carrinho = ? AND id_produto = ?
                        `;

                        db.query(qRemoverProduto, [id_carrinho, id_produto], (err, result) => {
                            if (err) return reject(err);
                            resolve(result);
                        });
                    } else {
                        // Produto já está no carrinho, atualizar a quantidade
                        const qAtualizarProduto = `
                            UPDATE itenscarrinho
                            SET quantidade = ?, preco_unitario = ?
                            WHERE id_carrinho = ? AND id_produto = ?
                        `;

                        db.query(qAtualizarProduto, [quantidade, preco_unitario, id_carrinho, id_produto], (err, result) => {
                            if (err) return reject(err);
                            resolve(result);
                        });
                    }
                } else {
                    if (quantidade > 0) {
                        // Produto não está no carrinho, inserir como novo
                        const qInserirProduto = `
                            INSERT INTO itenscarrinho (id_carrinho, id_produto, quantidade, preco_unitario)
                            VALUES (?, ?, ?, ?)
                        `;

                        db.query(qInserirProduto, [id_carrinho, id_produto, quantidade, preco_unitario], (err, result) => {
                            if (err) return reject(err);
                            resolve(result);
                        });
                    } else {
                        // Se a quantidade for 0 e o produto não estiver no carrinho, apenas resolver
                        resolve();
                    }
                }
            });
        });
    });

    Promise.all(promises)
        .then(() => {
            // Retornar uma resposta de sucesso
            return res.status(200).json({
                message: 'Produtos adicionados, atualizados ou removidos do carrinho com sucesso!',
            });
        })
        .catch((error) => {
            // Se houver algum erro, retornar a resposta com erro
            return res.status(500).json({ error: error.message });
        });
};
