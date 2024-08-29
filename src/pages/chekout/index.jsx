import React, { useState, useEffect } from "react";
import Header from '../../components/header/index';
import useGetData from "../../hooks/Alldata/Getdata";
import './style.css';

const Checkout = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        setUser(userData);
    }, []);

    useGetData('http://localhost:8800/products', user, setProducts);

    const addToCart = (product, quantity) => {
        if (quantity > product.amount) {
            alert(`Quantidade indisponível! Estoque atual: ${product.amount}`);
            return;
        }

        const existingProduct = cart.find(item => item.product.id === product.id);
        if (existingProduct) {
            setCart(cart.map(item =>
                item.product.id === product.id
                    ? { ...item, quantity: item.quantity + quantity }
                    : item
            ));
        } else {
            setCart([...cart, { product, quantity }]);
        }

        // Atualiza a quantidade no banco de dados com todos os dados do produto
        fetch(`http://localhost:8800/products/${product.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ...product,
                amount: product.amount - quantity,  // Diminui a quantidade do produto
            }),
        })
        .then(res => res.json())
        .then((data) => {
            if (data === "Product updated successfully") {
                // Opcional: Atualizar o estado dos produtos no frontend se necessário
            }
        })
        .catch(err => console.error(err));
    };

    useEffect(() => {
        const newTotal = cart.reduce((acc, item) => acc + item.product.salePrice * item.quantity, 0);
        setTotal(newTotal);
    }, [cart]);

    const handleCheckout = () => {
        // Atualiza a quantidade dos produtos no banco de dados
        const updateProductsPromises = cart.map(item => {
            return fetch(`http://localhost:8800/products/${item.product.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...item.product,
                    amount: item.product.amount - item.quantity // Atualiza a quantidade no banco de dados
                }),
            })
            .then(res => res.json())
            .catch(err => console.error(`Erro ao atualizar o produto ${item.product.id}:`, err));
        });

        // Aguarda todas as promessas de atualização serem resolvidas
        Promise.all(updateProductsPromises)
            .then(() => {
                // Limpa o carrinho e reseta o total
                setCart([]);
                setTotal(0);
                alert("Venda realizada com sucesso!");
            })
            .catch(err => {
                console.error("Erro ao finalizar a venda:", err);
                alert("Ocorreu um erro ao finalizar a venda. Tente novamente.");
            });
    };

    return (
        <div className="checkout-content">
            <Header />
            <h4>Frente de Caixa</h4>
            <div className="products-section">
                <h5>Produtos Disponíveis</h5>
                <div className="product-list">
                    {products.filter(product => product.amount > 0).map(product => (
                        <div key={product.id} className="product-item">
                            <p className="product-name">{product.name}</p>
                            <p className="product-price">Preço: R$ {product.salePrice}</p>
                            <input
                                type="number"
                                min="1"
                                placeholder="Quantidade"
                                onChange={(e) => addToCart(product, parseInt(e.target.value))}
                                className="product-quantity-input"
                            />
                        </div>
                    ))}
                </div>
            </div>
            <div className="cart-section">
                <h5>Carrinho</h5>
                {cart.map(item => (
                    <div key={item.product.id} className="cart-item">
                        <p className="cart-item-name">{item.product.name} - {item.quantity}x</p>
                        <p className="cart-item-total">Total: R$ {item.product.salePrice * item.quantity}</p>
                    </div>
                ))}
                <h5 className="cart-total">Total da Compra: R$ {total}</h5>
                <button onClick={handleCheckout} className="btn btn-success">Finalizar Venda</button>
            </div>
        </div>
    );
};

export default Checkout;
