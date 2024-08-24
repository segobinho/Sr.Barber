import React, { useState, useEffect } from "react";
import Header from '../../components/header/index';
import Main from '../../components/main/index';
import './style.css';
import axios from "axios";
import { IoIosAddCircleOutline } from "react-icons/io";
import useGetData from "../../hooks/Alldata/Getdata";
import { CiTrash } from "react-icons/ci";
import { GoPencil } from "react-icons/go";


// get clietes 
function Clientes() {
    const [clientes, setClietes] = useState([]);
    const [user, setUser] = useState([]);
    const [selectedCliente, setSelectedCliente] = useState(null); // Estado para armazenar o cliente selecionado
    const [values, setValues] = useState();
    const [showAddClienteForm, setShowAddClienteForm] = useState(false);
    const [formcliente, setFormcliente] = useState({
        name: '',

    })

    // Define user com o valor do localStorage
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        setUser(userData);
        console.log(userData);
        console.log(clientes)

    }, []);

    //função get clietes
    useGetData('http://localhost:8800/clientes', user, setClietes);



    const handleaddValues = (value) => {
        setValues((prevValues) => ({
            ...prevValues,
            [value.target.name]: value.target.value,
        }));
    };

    const handleClienteadd = () => {
        axios.post('http://localhost:8800/clientes', {
            name: values.nome,
            telefone: values.telefone,
            endereco: values.edereco,
        }).then((response) => {
            console.log(response);
        })
    }

    // selecionar info cliente ao cliclar 
    const handleClienteClick = (cliente) => {
        setSelectedCliente(cliente); // Atualiza o estado com o cliente selecionado
    };

    const handleClienteaddform = () => {
        setShowAddClienteForm((prev) => !prev); // Alterna entre mostrar e esconder o formulário
    };



    return (
        <div>
            <Header />
            <Main>
                <div className="container">
                    <div className="bloco">
                        <div className="title">
                            <h1>Clientes</h1>
                            < IoIosAddCircleOutline className="button1" onClick={(handleClienteaddform)} />
                        </div>
                        <hr />
                        <div >
                            {clientes.map(cliente => (
                                <div className="barbearias-list" key={cliente.id}>
                                    <div onClick={() => handleClienteClick(cliente)}>
                                        <p className="clientep"><strong>Nome:</strong> {cliente.nome}</p>
                                    </div>
                                    <p className="clientep"><strong>Endereço:</strong> {cliente.telefone}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bloco1">
                        <div className="container1">
                            {selectedCliente ? (
                                <div className="container2">
                                    <h2 className="cliente-title">Detalhes do Cliente</h2>
                                    <div className="cliente-info">
                                        <p><strong>Nome:</strong> {selectedCliente.nome}</p>
                                        <p><strong>Endereço:</strong> {selectedCliente.endereco}</p>
                                        <p><strong>Telefone:</strong> {selectedCliente.telefone}</p>
                                    </div>
                                    <div className="icon-container">
                                        <GoPencil className="icon-edit" title="Editar Cliente" />
                                        <CiTrash className="icon-delete" title="Remover Cliente" />
                                        <button>deletar</button>
                                        <button type="button">editar</button>
                                    </div>
                                </div>
                            ) : (
                                <p>Clique em um cliente para ver os detalhes</p>

                            )}

                            {showAddClienteForm ? (
                                <div>
                                    <input
                                        type="text"
                                        name="nome"
                                        placeholder="nome"
                                        className=""
                                        onChange={handleaddValues}
                                    />
                                    <input
                                        type="number"
                                        name="telefone"
                                        placeholder="telefone"
                                        className=""
                                        onChange={handleaddValues}
                                    />
                                    <input
                                        type="text"
                                        name="endereco"
                                        placeholder="endereço"
                                        className=""
                                        onChange={handleaddValues}
                                    />

                                    <input type="button" value="" />
                                </div>
                            ) : (
                                <h2>2</h2>
                            )

                            }
                        </div>
                    </div>
                </div>
            </Main>
        </div>
    );
}
export default Clientes;
