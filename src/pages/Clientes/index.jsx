import React, { useState, useEffect } from "react";
import Header from '../../components/header/index';
import Main from '../../components/main/index';
import FiltroBusca from '../../components/filltro/inndex';
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
    const [clientesFiltrados, setClientesFiltrados] = useState(clientes);
    const [barbearias, setBarbearias] = useState([]);



    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        setUser(userData);
    }, []);


    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        setUser(userData);

        // Buscar barbearias se o usuário for admin
        if (userData?.cargo === 'admin') {
            axios.get('http://localhost:8800/barbearias')
                .then((response) => setBarbearias(response.data))
                .catch((error) => console.error('Erro ao buscar barbearias:', error));
        }
    }, []);

    useEffect(() => {
        // Obtém o usuário do localStorage
        const userData = JSON.parse(localStorage.getItem('user'));
        setUser(userData);
        console.log(userData.cargo);
        console.log(user.cargo);


        if (userData) {
            // Faz a requisição para buscar os clientes
            axios.get('http://localhost:8800/clientes', {
                params: {
                    cargo: userData.cargo,
                    id_barbearia: userData.id_barbearia  // Corrigido aqui
                }
            })
                .then(response => {
                    setClientes(response.data);  // Define os clientes com os dados da resposta
                })
                .catch(error => {
                    console.error("Erro ao buscar clientes:", error);
                });
        }
    }, []);  // Executa apenas uma vez, ao montar o componente



    const handleAddValues = (event) => {
        setValues((prevValues) => ({
            ...prevValues,
            [event.target.name]: event.target.value,
        }));
    };
    console.log("receba")

    const handleClienteAdd = () => {
        const idBarbearia = user.cargo === 'admin' ? values.id_barbearia : user.id_barbearia;

        axios.post('http://localhost:8800/add', {
            nome: values.nome,
            telefone: values.telefone,
            endereco: values.endereco,
            id_barbearia: idBarbearia, // Enviando o id_barbearia conforme a lógica

        }).then((response) => {
            setClientes([...clientes, response.data]);
            setClientesFiltrados([...clientes, response.data]);

            setValues({});
            setShowAddClienteForm(false);
        }).catch((error) => {
            console.error("Erro ao adicionar cliente:", error);
        });
    };

    const handleClienteClick = (cliente) => {
        setSelectedCliente(cliente);
        console.log(cliente)
        setIsEditing(false);
        setShowAddClienteForm(false);
        
    };

    const handleClienteEditForm = () => {
        setIsEditing(true);
        setValues({
            nome: selectedCliente.nome,
            telefone: selectedCliente.telefone,
            endereco: selectedCliente.endereco,
            id_barbearia: user.cargo === 'admin' ? selectedCliente.id_barbearia : user.id_barbearia,

        });
        console.log("ID da Barbearia sendo enviado para edição:", selectedCliente); // Adicionando o console.log
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
                console.log(values)
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
                            <IoIosAddCircleOutline className="button1" onClick={handleClienteAddForm} />
                        </div>
                        <hr />
                        <div>
                            <FiltroBusca itens={clientes} onFiltrar={setClientesFiltrados} placeholder={"Buscar cliente"} />
                            {clientesFiltrados.map(cliente => (
                                <div className="barbearias-list" key={cliente.id_cliente}>
                                    <div onClick={() => handleClienteClick(cliente)}>
                                        <p className="clientep"><strong>Nome:</strong> {cliente.nome}</p>
                                    </div>
                                    <p className="clientep"><strong>Endereço:</strong> {cliente.telefone}</p>
                                    <p></p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bloco1">
                        <div className="container1">
                            {showAddClienteForm && (
                                <div className="container2">
                                    <h2 className="cliente-title3">{isEditing ? "Editar Cliente" : "Adicionar Cliente"}</h2>
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
                                    {user.cargo === 'admin' && (
                                        <select
                                            name="id_barbearia"
                                            value={values.id_barbearia || ''}
                                            onChange={handleAddValues}
                                        >
                                            <option value="">Selecione a Barbearia</option>
                                            {barbearias.map(barbearia => (
                                                <option key={barbearia.id_barbearia} value={barbearia.id_barbearia}>
                                                    {barbearia.nome}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                    <button className="button-save" onClick={isEditing ? handleSaveEdit : handleClienteAdd}>
                                        {isEditing ? 'Salvar' : 'Adicionar Cliente'}
                                    </button>
                                </div>
                            )}
                            {!showAddClienteForm && !isEditing && selectedCliente && (
                                <div className="container2">
                                    <h2 className="cliente-title3">Detalhes do Cliente</h2>
                                    <div className="cliente-info3">
                                        <p><strong>Nome:</strong> {selectedCliente.nome}</p>
                                        <p><strong>Endereço:</strong> {selectedCliente.endereco}</p>
                                        <p><strong>Telefone:</strong> {selectedCliente.telefone}</p>
                                    </div>
                                    <div className="icon-container">
                                        <GoPencil className="icon-edit" title="Editar Cliente" onClick={handleClienteEditForm} />
                                        <CiTrash className="icon-delete" title="Deletar Cliente" onClick={() => {
                                            console.log('Tentando deletar cliente com ID:', selectedCliente.id_cliente);
                                            handleClienteDelete(selectedCliente.id_cliente);
                                        }} />

                                    </div>
                                </div>
                            )}
                            {!showAddClienteForm && !isEditing && !selectedCliente && (

                              <p className="clique">Clique em um cliente para ver os detalhes</p>
                           




                            )}
                        </div>
                    </div>
                </div>
            </Main>
        </div>
    );
}

export default Clientes;
