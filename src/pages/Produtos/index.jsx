import React, { useState, useEffect } from "react";
import "./style.css";
import Header from '../../components/header/index';
import { GoPencil } from "react-icons/go";
import { CiTrash } from "react-icons/ci";
import useGetData from "../../hooks/Alldata/Getdata";
import FiltroBusca from '../../components/filltro/inndex';

const Products = () => {
    const [form, setForm] = useState({
        barcode: "",
        name: "",
        salePrice: "",
        price: "", // Adicionado o campo price
        amount: "",
        expirationDate: "",
        id_barbearia: ""
    });
    const [products, setProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [searchBarcode, setSearchBarcode] = useState("");
    const [searchName, setSearchName] = useState("");
    const [searchIdBarbearia, setSearchIdBarbearia] = useState("");
    const [barbearias, setBarbearias] = useState([]);
    const [message, setMessage] = useState("");
    const [filterActive, setFilterActive] = useState(false);
    const [user, setUser] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [produtosFiltrados, setProdutosFiltrados] = useState(products);


    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        setUser(userData);
    }, []);

    useGetData('http://localhost:8800/products', user, (data) => {
        setProducts(data);
        setAllProducts(data);
    });

    useGetData('http://localhost:8800/barbearias', user, setBarbearias);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const registerProduct = (e) => {
        e.preventDefault();
        const method = editingProduct ? "PUT" : "POST";
        const url = editingProduct ? `http://localhost:8800/products/${editingProduct.id}` : "http://localhost:8800/products";

        fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(form),
        })
            .then((res) => res.json())
            .then((data) => {
                if (editingProduct) {
                    // Atualiza o produto existente na lista
                    setProducts(products.map((product) => product.id === data.id ? data : product));
                    setMessage("Produto atualizado com sucesso!");
                } else {
                    // Adiciona o novo produto à lista
                    setProducts([...products, data]);
                    setMessage("Produto cadastrado com sucesso!");
                }
                // Limpa o formulário e o estado de edição
                setForm({
                    barcode: "",
                    name: "",
                    salePrice: "",
                    price: "", // Limpa o campo price
                    amount: "",
                    expirationDate: "",
                    id_barbearia: ""
                });
                setEditingProduct(null);
            })
            .catch((err) => {
                setMessage("Erro ao cadastrar ou atualizar produto.");
                console.error(err);
            });
    };

    const deleteProduct = (id) => {
        if (window.confirm("Deseja realmente deletar o produto?")) {
            fetch(`http://localhost:8800/products/${id}`, {
                method: "DELETE",
            })
                .then(() => {
                    setProducts(products.filter((product) => product.id !== id));
                })
                .catch((err) => console.error(err));
        }
    };

  

    const startEditing = (product) => {
        setEditingProduct(product);
        setForm({
            barcode: product.barcode,
            name: product.name,
            salePrice: product.salePrice,
            price: product.price, // Adicionado o campo price
            amount: product.amount,
            expirationDate: product.expirationDate ? new Date(product.expirationDate).toISOString().split('T')[0] : "",
            id_barbearia: product.id_barbearia
        });
    };

    const cancelEditing = () => {
        setEditingProduct(null);
        setForm({
            barcode: "",
            name: "",
            salePrice: "",
            price: "", // Limpa o campo price
            amount: "",
            expirationDate: "",
            id_barbearia: ""
        });
    };
    console.log(products)

    return (
        <div className="content">
            <Header />
         
                <div className="bloco1a">
                    <h4>{editingProduct ? "Editar Produto" : "Cadastro de Produtos"}</h4>
                    <form className="form-product" onSubmit={registerProduct}>
                        <div className="row">
                            <p className="message-error">{message}</p>
                            <div className="col-md-3">
                                <label className="form-label">Código do produto</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    name="barcode"
                                    placeholder="Código do produto"
                                    value={form.barcode}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">Nome do produto *</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    name="name"
                                    placeholder="Nome do produto"
                                    value={form.name}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">Preço *</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    name="price"
                                    placeholder="Preço"
                                    value={form.price}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">Preço de venda *</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    name="salePrice"
                                    placeholder="Preço de venda"
                                    value={form.salePrice}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">Quantidade *</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    name="amount"
                                    placeholder="Quantidade"
                                    value={form.amount}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">Data de Vencimento</label>
                                <input
                                    className="form-control"
                                    type="date"
                                    name="expirationDate"
                                    placeholder="Data de validade"
                                    value={form.expirationDate}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">Barbearia *</label>
                                <select
                                    className="form-control"
                                    name="id_barbearia"
                                    value={form.id_barbearia}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Selecione uma barbearia</option>
                                    {barbearias.map((barbearia) => (
                                        <option key={barbearia.id_barbearia} value={barbearia.id_barbearia}>
                                            {barbearia.nome}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-3">
                                <br />
                                <button className="btn btn-primary bnt-product" type="submit">
                                    {editingProduct ? "Salvar" : "Cadastrar"}
                                </button>
                                {editingProduct && (
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={cancelEditing}
                                    >
                                        Cancelar
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>

                   
                        
                    <FiltroBusca itens={products} onFiltrar={setProdutosFiltrados} placeholder='buscar produtos' />


                    <div className="bloco">
                    <table className="table">
                        
    <thead>
        <tr>
            <th>Código</th>
            <th>Nome</th>
            <th>Preço</th>
            <th>Preço de Venda</th>
            <th>Quantidade</th>
            <th>Vencimento</th>
            <th>Barbearia</th>
            <th>Ação</th>
        </tr>
    </thead>
    <tbody>


        {produtosFiltrados.map((product) => (
            <tr key={product.id}>
                <td>{product.barcode}</td>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>{product.salePrice}</td>
                <td>{product.amount}</td>
                <td>{product.expirationDate}</td>
                <td>{barbearias.nome}</td>
                <td>
                    <div className="action">
                        <button
                            type="button"
                            className="edit"
                            onClick={() => startEditing(product)}
                        >
                            <GoPencil />
                        </button>
                        <button
                            type="button"
                            className="delete"
                            onClick={() => deleteProduct(product.id)}
                        >
                            <CiTrash />
                        </button>
                    </div>
                </td>
            </tr>
        ))}
    </tbody>
</table>
                    </div>
                </div>
        </div>
    );
};

export default Products;
