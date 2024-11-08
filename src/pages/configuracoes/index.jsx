import React, { useState, useEffect } from 'react';
import axios from "axios";
import './style.css';
import Main from '../../components/main/index';
import Header from '../../components/header';
import EditForm from '../../components/componenteteste/Editform';
import EditField from '../../components/componenteteste/EditField';
import EditButton from '../../components/componenteteste/EditButton';
import Modal from '../../components/componenteteste/modal';
import { Box, Typography, TextField, Button, Avatar, IconButton, Divider } from '@mui/material';
import { CopyAll, AccountCircle, Lock, Email, Phone } from '@mui/icons-material';


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
<div style={{ backgroundColor: '#222831', width: '100%',height: '945px' }}>
<Header />
            <Box
                sx={{
                    width: 600,
                    borderRadius: 4,
                    boxShadow: 3,
                    backgroundColor: '#fff',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    mx: 'auto',
                    position: 'relative',
                    mt: 4, // Margem superior
                    mb: 5, // Margem inferior
                }}
            >
                {/* Barra Cinza e Foto */}
                <Box
                    sx={{
                        position: 'relative',
                        height: 90,
                        backgroundColor: '#f0f0f0',
                        borderTopLeftRadius: '16px',
                        borderTopRightRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Avatar
                        src={`http://localhost:8800/fotos/${funcionarios.imagens}`}
                        alt="Amélie Laurent"
                        sx={{
                            width: 96,
                            height: 96,
                            position: 'absolute',
                            bottom: -48, // Faz com que a imagem fique metade fora da barra cinza
                            left: 24,
                            border: '4px solid #fff',
                        }}
                    />
                </Box>

                {/* Nome e Email */}

                <Box sx={{ textAlign: 'left', mt: 5, ml: 2, position: 'relative' }}>
                    <Box sx={{
                        position: 'absolute',
                        top: '-50px',  // Ajuste o valor conforme necessário
                        right: '10px',
                        textAlign: 'right'
                    }}>
                        <Typography variant="h6" color='black'>{funcionarios.cargo}</Typography>
                    </Box>
                    <Typography variant="h6">{funcionarios.nome}</Typography>
                    <Typography color="textSecondary">{funcionarios.email}</Typography>
                </Box>

                {/* Botões de Link e Ver Perfil */}


                {/* Formulário de Edição */}
                <Divider />

                <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, px: 3 }}>
                    <TextField label="Nome" defaultValue={funcionarios.nome} fullWidth />
                    <Divider />
                    <TextField
                        label="Telefone"
                        defaultValue={funcionarios.telefone}
                        fullWidth
                        InputProps={{
                            endAdornment: <Phone sx={{ color: '#FFD369' }}  />,
                        }}
                    />
                    <Divider />
                    <TextField
                        label="Email"
                        defaultValue={funcionarios.email}
                        type="email"
                        fullWidth
                        InputProps={{
                            endAdornment: <Email sx={{ color: '#FFD369' }}  />,
                        }}
                    />
                    <Divider />
                    <TextField
                        label="Senha"
                        type="password"  // Adiciona o tipo "password" para esconder o texto
                        InputProps={{
                            startAdornment: <Typography color="textSecondary" ></Typography>,
                            endAdornment: <Lock sx={{ color: '#FFD369' }}  />,
                        }}
                        defaultValue="amelie"
                        fullWidth
                    />
                    <Divider />
                </Box>

                {/* Foto do Perfil */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        mt: 2,
                    }}
                >
    <Typography color="textSecondary" sx={{ mt: -7, ml: 3, mr: 9}}>Foto de perfil</Typography>  {/* Ajustando o espaço superior da tipografia */}

    <Avatar 
        src={`http://localhost:8800/fotos/${funcionarios.imagens}`} 
        alt="Profile photo" 
        sx={{ width: 52, height: 52, ml: 0,mt:-2 }} // Ajustando margem à esquerda se necessário
    />
    <Button 
        variant="outlined" 
        component="label"
        sx={{
            ml: 1,
            mt: -4,
            borderColor: '#FFD369',  // Cor da borda
            color: 'black',  // Cor do texto
            '&:hover': {
                borderColor: '#FFD369',  // Cor da borda ao passar o mouse
                backgroundColor: 'rgba(255, 211, 105, 0.1)',  // Cor de fundo ao passar o mouse
            },
        }}  // Adicionando um pequeno afastamento à esquerda do botão
    >
        Clique para mudar
        <input type="file" hidden />
    </Button>
                </Box>
                <Divider />

                {/* Botões de Ação */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end', // Alinha os botões no canto direito
                        alignItems: 'center', // Centraliza os botões verticalmente
                        mt: 2, // Margem superior
                        mr: 3, // Margem direita para afastar dos lados
                        mb: 2, // Margem inferior para afastar dos botões da parte de baixo
                    }}
                >
                    <Button variant="text" sx={{ mr: 2, color:'black' }}>
                        Cancelar
                    </Button>
                    <Button variant="contained" sx={{ background: '#FFD369', color:'#f0f0f0' }} >
                        Salvar
                    </Button>
                </Box>
            </Box>

        </div>
    );
}

export default ProfileScreen;
