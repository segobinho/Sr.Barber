import { db } from "../db.js";

// Get all products
export const getProducts = (_, res) => {
    const q = "SELECT * FROM products";
    
    db.query(q, (err, data) => {
        if (err) return res.json(err);

        return res.status(200).json(data);
    });
};

// Add a product
export const addProduct = (req, res) => {
    const { barcode, name, price, salePrice, amount, expirationDate, id_barbearia } = req.body;
    const q = "INSERT INTO products (barcode, name, price, salePrice, amount, expirationDate, id_barbearia) VALUES (?, ?, ?, ?, ?, ?, ?)";

    // Use NULL for barcode if it is not provided
    db.query(q, [barcode || null, name, price || null, salePrice, amount, expirationDate || null, id_barbearia], (err, data) => {
        if (err) return res.json(err);

        return res.status(200).json("Product added successfully");
    });
};

// Edit a product
export const editProduct = (req, res) => {
    const { barcode, name, price, salePrice, amount, expirationDate, id_barbearia } = req.body;
    const productId = req.params.id;

    const q = "UPDATE products SET barcode = ?, name = ?, price = ?, salePrice = ?, amount = ?, expirationDate = ?, id_barbearia = ? WHERE id = ?";

    // Use NULL for barcode and price if they are not provided
    db.query(q, [barcode || null, name, price || null, salePrice, amount, expirationDate || null, id_barbearia, productId], (err, data) => {
        if (err) return res.json(err);

        return res.status(200).json("Product updated successfully");
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
