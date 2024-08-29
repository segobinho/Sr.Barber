import React, { useState, useEffect } from "react";
import Header from '../../components/header/index';
import Main from '../../components/main/index';
import './style.css';
import axios from "axios";
import { IoIosAddCircleOutline } from "react-icons/io";
import useGetData from "../../hooks/Alldata/Getdata";
import { CiTrash } from "react-icons/ci";
import { GoPencil } from "react-icons/go";

function Clientes() {
    const [clientes, setClientes] = useState([]);
    const [user, setUser] = useState([]);
    const [selectedCliente, setSelectedCliente] = useState(null);
    const [values, setValues] = useState({});
    const [showAddClienteForm, setShowAddClienteForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        setUser(userData);
    }, []);

    useGetData('http://localhost:8800/clientes', user, setClientes);

    const handleAddValues = (event) => {
        setValues((prevValues) => ({
            ...prevValues,
            [event.target.name]: event.target.value,
        }));
    };

    const handleClienteAdd = () => {
        axios.post('http://localhost:8800/add', {
            nome: values.nome,
            telefone: values.telefone,
            endereco: values.endereco,
        }).then((response) => {
            setClientes([...clientes, response.data]);
            setValues({});
            setShowAddClienteForm(false);
        });
    };

    const handleClienteClick = (cliente) => {
        setSelectedCliente(cliente);
        setIsEditing(false);
        setShowAddClienteForm(false);
    };

    const handleClienteEditForm = () => {
        setIsEditing(true);
        setValues({
            nome: selectedCliente.nome,
            telefone: selectedCliente.telefone,
            endereco: selectedCliente.endereco,
        });
        setShowAddClienteForm(true);
    };

    const handleSaveEdit = () => {
        axios.put(`http://localhost:8800/clientes/${selectedCliente.id_cliente}`, values)
            .then((response) => {
                setClientes(clientes.map(cliente =>
                    cliente.id_cliente === selectedCliente.id_cliente ? response.data : cliente
                ));
                setIsEditing(false);
                setSelectedCliente(response.data);
                setShowAddClienteForm(false);
            })
            .catch((error) => {
                console.error("Erro ao salvar edição:", error);
            });
    };

    const handleClienteAddForm = () => {
        setIsEditing(false);
        setSelectedCliente(null); 
        setValues({});
        setShowAddClienteForm(true);
    };

    const handleClienteDelete = (clienteId) => {
        axios.delete(`http://localhost:8800/clientes/${clienteId}`)
            .then(() => {
                setClientes(clientes.filter(cliente => cliente.id_cliente !== clienteId));
                setSelectedCliente(null);
            })
            .catch((error) => {
                console.error("Erro ao deletar cliente:", error);
            });
    };

    return (
        <div>
            <Header />
            <Main>
                <div className="container">
                    <div className="bloco">
                        <div className="title">
                            <h1>Clientes</h1>
                            <IoIosAddCircleOutline className="button-add" onClick={handleClienteAddForm} />
                        </div>
                        <hr />
                        <div>
                            {clientes.map(cliente => (
                                <div className="barbearias-list" key={cliente.id_cliente}>
                                    <div onClick={() => handleClienteClick(cliente)}>
                                        <p className="clientep"><strong>Nome:</strong> {cliente.nome}</p>
                                    </div>
                                    <p className="clientep"><strong>Endereço:</strong> {cliente.endereco}</p>
                                    <CiTrash className="icon-delete" title="Deletar Cliente" onClick={() => handleClienteDelete(cliente.id_cliente)} />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bloco1">
                        <div className="container1">
                            {showAddClienteForm && (
                                <div className="container2">
                                    <h2 className="cliente-title">{isEditing ? "Editar Cliente" : "Adicionar Cliente"}</h2>
                                    <input
                                        type="text"
                                        name="nome"
                                        placeholder="Nome"
                                        value={values.nome || ''}
                                        onChange={handleAddValues}
                                    />
                                    <input
                                        type="number"
                                        name="telefone"
                                        placeholder="Telefone"
                                        value={values.telefone || ''}
                                        onChange={handleAddValues}
                                    />
                                    <input
                                        type="text"
                                        name="endereco"
                                        placeholder="Endereço"
                                        value={values.endereco || ''}
                                        onChange={handleAddValues}
                                    />
                                    <button className="button-save" onClick={isEditing ? handleSaveEdit : handleClienteAdd}>
                                        {isEditing ? 'Salvar' : 'Adicionar Cliente'}
                                    </button>
                                </div>
                            )}
                            {!showAddClienteForm && !isEditing && selectedCliente && (
                                <div className="container2">
                                    <h2 className="cliente-title">Detalhes do Cliente</h2>
                                    <div className="cliente-info">
                                        <p><strong>Nome:</strong> {selectedCliente.nome}</p>
                                        <p><strong>Endereço:</strong> {selectedCliente.endereco}</p>
                                        <p><strong>Telefone:</strong> {selectedCliente.telefone}</p>
                                    </div>
                                    <div className="icon-container">
                                        <GoPencil className="icon-edit" title="Editar Cliente" onClick={handleClienteEditForm} />
                                        <CiTrash className="icon-delete" title="Deletar Cliente" onClick={() => handleClienteDelete(selectedCliente.id_cliente)} />
                                    </div>
                                </div>
                            )}
                            {!showAddClienteForm && !isEditing && !selectedCliente && (
                                <p>Clique em um cliente para ver os detalhes</p>
                            )}
                        </div>
                    </div>
                </div>
            </Main>
        </div>
    );
}

export default Clientes;
