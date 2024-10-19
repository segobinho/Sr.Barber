import React, { useState, useEffect } from 'react';
import axios from "axios";
import './style.css';
import Main from '../../components/main/index';
import Header from '../../components/header';
import EditForm from '../../components/componenteteste/Editform';
import EditField from '../../components/componenteteste/EditField';
import EditButton from '../../components/componenteteste/EditButton';
import Modal from '../../components/componenteteste/modal';
import BarberCutsChart from "../../components/graficoos/teste";



function ProfileScreen() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [funcionarios, SetFuncionarios] = useState([])
    const [user, setUser] = useState([]);
    const [isEditing, setIsEditing] = useState(false); // Controla a exibição do modal
    const [selectedFile, setSelectedFile] = useState(null); // Novo estado para a foto






    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        setUser(userData);
    }, []);

    useEffect(() => {
        // Obtém o usuário do localStorage
        const userData = JSON.parse(localStorage.getItem('user'));
        setUser(userData);
        console.log(userData);
        console.log(user.cargo);
        console.log(user.id_funcionario);


        if (userData) {
            // Faz a requisição para buscar os clientes
            axios.get(`http://localhost:8800/funcionariosByID/${userData.id_funcionario}`, {

            })
                .then(response => {
                    SetFuncionarios(response.data);  // Define os clientes com os dados da resposta
                })
                .catch(error => {
                    console.error("Erro ao buscar clientes:", error);
                });
        }
    }, []);  // Executa apenas uma vez, ao montar o componente


    const handleSave = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('id_funcionario', user.id_funcionario); // Envia o id_funcionario
        formData.append('nome', funcionarios.nome);
        formData.append('telefone', funcionarios.telefone);
        formData.append('email', funcionarios.email);
        formData.append('cpf', funcionarios.cpf);

        axios.put(`http://localhost:8800/funcionarios/${funcionarios.id_funcionario}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => {
            console.log('Funcionário atualizado:', response.data);
            setIsEditing(false);
        })
        .catch(error => {
            console.error("Erro ao atualizar funcionário:", error);
        });
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]); // Atualiza o estado com a foto selecionada
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        SetFuncionarios({
            ...funcionarios,
            [name]: value,
        });
    };
    

    return (
        <div>
            <Header />
            <Main>
                <div className="profile-container">
                    <h2>Tela de Perfil</h2>
                    <div className="profile-info">
                        <div className="profile-header">
                            <img alt="Foto do Perfil" className="profile-photo"
                                src={`http://localhost:8800/fotos/${funcionarios.imagens}`}
                            />
                            <h1>{funcionarios.nome} </h1>
                            <h2>Cargo: {funcionarios.cargo}</h2>
                        </div>
                        <hr />
                        <div className="profile-boxes">
                            <div className="profile-box">
                                <strong>Nome:</strong> {funcionarios.nome}
                            </div>

                            <div className="profile-box">
                                <strong>Telefone:</strong> {funcionarios.telefone}
                            </div>
                            <div className="profile-box">
                                <strong>Email:</strong> {funcionarios.email}
                            </div>
                            <div className="profile-box">
                                <strong>CPF:</strong> {funcionarios.cpf}
                            </div>
                        </div>
                        <button onClick={() => setIsEditing(true)}>Editar Perfil</button>
                        <BarberCutsChart/>
                        
                        
                        {isEditing && (
                            <div className="modal">
                               <Modal>
                                <EditForm onSubmit={handleSave}>
                                    <EditField 
                                        label="Nome" 
                                        name="nome" 
                                        value={funcionarios.nome || ''} 
                                        onChange={handleChange} 
                                    />
                                    <EditField 
                                        label="Telefone" 
                                        name="telefone" 
                                        value={funcionarios.telefone || ''} 
                                        onChange={handleChange} 
                                    />
                                    <EditField 
                                        label="Email" 
                                        name="email" 
                                        value={funcionarios.email || ''} 
                                        onChange={handleChange} 
                                    />
                                    <EditField 
                                        label="CPF" 
                                        name="cpf" 
                                        value={funcionarios.cpf || ''} 
                                        onChange={handleChange} 
                                    />
                                     <EditField 
                                            label="Foto do Perfil" 
                                            name="foto" 
                                            type="file" 
                                            onChange={handleFileChange} 
                                        />
                                    <div className="button-group">
                                        <EditButton type="submit" onClick={handleSave}>Salvar</EditButton>
                                        <EditButton type="button" onClick={() => setIsEditing(false)}>Cancelar</EditButton>

                                        

                                    </div>
                                </EditForm>
                                </Modal>

                            </div>
                        )}
                    </div>

                </div>
            </Main>
        </div>
    );
}

export default ProfileScreen;
