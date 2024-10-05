import React, { useState, useEffect } from "react";
import Header from '../../components/header/index';
import Main from '../../components/main/index';
import './style.css';
import axios from "axios";
import { IoIosAddCircleOutline } from "react-icons/io";
import useGetData from "../../hooks/Alldata/Getdata";
import { CiTrash } from "react-icons/ci";
import { GoPencil } from "react-icons/go";


function Funcionarios() {
    const [funcionarios, setFuncionarios] = useState([]);
    const [user, setUser] = useState([]);
    const [selectedFuncionario, setSelectedFuncionario] = useState(null);
    const [values, setValues] = useState({});
    const [showAddFuncionarioForm, setShowAddFuncionarioForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);


    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        setUser(userData);
    }, []);


    useGetData('http://localhost:8800/funcionarios', user, setFuncionarios);


    const handleAddValues = (event) => {
        setValues((prevValues) => ({
            ...prevValues,
            [event.target.name]: event.target.value,
        }));
    };


    const handleFuncionarioAdd = () => {
        axios.post('http://localhost:8800/add', {
            nome: values.nome,
            cargo: values.cargo,
            telefone: values.telefone,
        }).then((response) => {
            setFuncionarios([...funcionarios, response.data]);
            setValues({});
            setShowAddFuncionarioForm(false);
        });
    };


    const handleFuncionarioClick = (funcionario) => {
        setSelectedFuncionario(funcionario);
        setIsEditing(false);
        setShowAddFuncionarioForm(false);
    };


    const handleFuncionarioEditForm = () => {
        setIsEditing(true);
        setValues({
            nome: selectedFuncionario.nome,
            cargo: selectedFuncionario.cargo,
            telefone: selectedFuncionario.telefone,
        });
        setShowAddFuncionarioForm(true);
    };


    const handleSaveEdit = () => {
        axios.put(`http://localhost:8800/funcionarios/${selectedFuncionario.id_funcionario}`, values)
            .then((response) => {
                setFuncionarios(funcionarios.map(funcionario =>
                    funcionario.id_funcionario === selectedFuncionario.id_funcionario ? response.data : funcionario
                ));
                setIsEditing(false);
                setSelectedFuncionario(response.data);
                setShowAddFuncionarioForm(false);
            })
            .catch((error) => {
                console.error("Erro ao salvar edição:", error);
            });
    };


    const handleFuncionarioAddForm = () => {
        setIsEditing(false);
        setSelectedFuncionario(null);
        setValues({});
        setShowAddFuncionarioForm(true);
    };


    const handleFuncionarioDelete = (funcionarioId) => {
        axios.delete(`http://localhost:8800/funcionarios/${funcionarioId}`)
            .then(() => {
                setFuncionarios(funcionarios.filter(funcionario => funcionario.id_funcionario !== funcionarioId));
                setSelectedFuncionario(null);
            })
            .catch((error) => {
                console.error("Erro ao deletar funcionário:", error);
            });
    };


    return (
        <div>
            <Header />
            <Main>
                <div className="container">
                    <div className="bloco">
                        <div className="title">
                            <h1>Funcionários</h1>
<IoIosAddCircleOutline className="button1" onClick={handleFuncionarioAddForm} />
                        </div>
                        <hr />
                        <div>
                            {funcionarios.map(funcionario => (
                                <div className="barbearias-list" key={funcionario.id_funcionario}>
                                    <div
                                        onClick={() => handleFuncionarioClick(funcionario)}>
                                        <p className="clientep2"><strong>Nome:</strong> {funcionario.nome}</p>
                                    </div>
                                    <p className="clientep2"><strong>Cargo:</strong> {funcionario.cargo}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bloco1">
                        <div className="container1">
                            {showAddFuncionarioForm && (
                                <div className="container2">
                                    <h2 className="funcionario-title">{isEditing ? "Editar Funcionário" : "Adicionar Funcionário"}</h2>
                                    <input
                                        type="text"
                                        name="nome"
                                        placeholder="Nome"
                                        value={values.nome || ''}
                                        onChange={handleAddValues}
                                    />
                                    <input
                                        type="text"
                                        name="cargo"
                                        placeholder="Cargo"
                                        value={values.cargo || ''}
                                        onChange={handleAddValues}
                                    />
                                    <input
                                        type="number"
                                        name="telefone"
                                        placeholder="Telefone"
                                        value={values.telefone || ''}
                                        onChange={handleAddValues}
                                    />
                                    <button className="button-save" onClick={isEditing ? handleSaveEdit : handleFuncionarioAdd}>
                                        {isEditing ? 'Salvar' : 'Adicionar Funcionário'}
                                    </button>
                                </div>
                            )}
                            {!showAddFuncionarioForm && !isEditing && selectedFuncionario && (
                                <div className="container2">
                                    <h2 className="funcionario-title">Detalhes do Funcionário</h2>
                                    <div className="funcionario-info">
                                        <p><strong>Nome:</strong> {selectedFuncionario.nome}</p>
                                        <p><strong>Cargo:</strong> {selectedFuncionario.cargo}</p>
                                        <p><strong>Telefone:</strong> {selectedFuncionario.telefone}</p>
                                    </div>
                                    <div className="icon-container">
                                        <GoPencil className="icon-edit" title="Editar Funcionário" onClick={handleFuncionarioEditForm} />
                                        <CiTrash className="icon-delete" title="Deletar Funcionário" onClick={() => handleFuncionarioDelete(selectedFuncionario.id_funcionario)} />
                                    </div>
                                </div>
                            )}
                            {!showAddFuncionarioForm && !isEditing && !selectedFuncionario && (
                                <p className="clique">Clique em um funcionário para ver os detalhes</p>
                            )}
                        </div>
                    </div>
                </div>
            </Main>
        </div>
    );
}


export default Funcionarios;
