import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style.css';
import Header from '../../components/header';
import { Box, Typography, TextField, Button, Avatar, IconButton, Divider, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { CopyAll, AccountCircle, Lock, Email, Phone, CreditCard, LockOpen } from '@mui/icons-material';
import { toast, ToastContainer} from 'react-toastify';

function ProfileScreen() {
    const [funcionarios, SetFuncionarios] = useState([]);
    const [user, setUser] = useState([]);
    const [isEditing, setIsEditing] = useState(false); // Controla a exibição do modal
    const [selectedFile, setSelectedFile] = useState(null); // Novo estado para a foto
    const [senhaVerificada, setSenhaVerificada] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [senhaAtual, setSenhaAtual] = useState('');
    const [previewFile, setPreviewFile] = useState(null);  // Novo estado para pré-visualização da foto


    // Função para verificar a senha atual
    const verificarSenhaAtual = () => {
        if (senhaAtual === funcionarios.password) {
            setSenhaVerificada(true); // Permite edição da senha
            setOpenDialog(false); // Fecha o modal de verificação
        } else {
            toast.error('Senha atual incorreta.');
        }
    };

    const isValidEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        
        return emailRegex.test(email);
    };

    const isValidCPF = (cpf) => {
        // Remove caracteres não numéricos
        cpf = cpf.replace(/[^\d]+/g, '');

        // Verifica se tem 11 dígitos e não é uma sequência repetida
        if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

        // Valida os dígitos verificadores
        let soma = 0;
        for (let i = 0; i < 9; i++) {
            soma += parseInt(cpf.charAt(i)) * (10 - i);
        }
        let resto = 11 - (soma % 11);
        let digito1 = resto >= 10 ? 0 : resto;

        soma = 0;
        for (let i = 0; i < 10; i++) {
            soma += parseInt(cpf.charAt(i)) * (11 - i);
        }
        resto = 11 - (soma % 11);
        let digito2 = resto >= 10 ? 0 : resto;

        return digito1 === parseInt(cpf.charAt(9)) && digito2 === parseInt(cpf.charAt(10));
    };

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData) {
            setUser(userData);
            fetchFuncionario(userData.id_funcionario);
        }
    }, []);

    const fetchFuncionario = (id) => {
        axios.get(`http://localhost:8800/funcionariosByID/${id}`)
            .then(response => SetFuncionarios(response.data))
            .catch(error => console.error("Erro ao buscar funcionário:", error));
    };

    const handleSave = (e) => {
        if (!isValidEmail(funcionarios.email)) {
            return toast.error('E-mail inválido!', {
              
            });
        }

        if (!isValidCPF(funcionarios.cpf)) {
            return toast.error('CPF inválido!', {
               
            });
        }


        e.preventDefault();
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('password', funcionarios.password); // Adiciona a senha no formData
        formData.append('id_funcionario', user.id_funcionario);
        formData.append('nome', funcionarios.nome);
        formData.append('telefone', funcionarios.telefone);
        formData.append('email', funcionarios.email);
        formData.append('cpf', funcionarios.cpf);

        axios.put(`http://localhost:8800/funcionarios/${funcionarios.id_funcionario}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }   
        })
            .then(response => {
                window.location.reload()
                toast.success('Funcionário atualizado:', response.data);
                setIsEditing(false);
               
            })
            .catch(error => {
                const errorMessage = error.response?.data?.message || 'Erro ao atualizar o funcionário.';
                toast.error(errorMessage);
            });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file); // Atualiza o estado com a foto selecionada
    
        // Cria uma URL para a pré-visualização da imagem
        const previewUrl = URL.createObjectURL(file);
        setPreviewFile(previewUrl);  // Atualiza a pré-visualização com a nova foto
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        SetFuncionarios({
            ...funcionarios,
            [name]: value,
        });
    };

    return (
        <div style={{ backgroundColor: '#222831', width: '100%', minHeight:945, position:'absolute'}}>
                            <ToastContainer />

            <Header />
            <Box
                sx={{
                    width: 700,
                    height: 870,
                    borderRadius: 4,
                    boxShadow: 3,
                    backgroundColor: '#fff',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    mx: 'auto',
                    position: 'relative',
                    mt: 1,
                    mb: 1,
                   
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
                            bottom: -48,
                            left: 24,
                            border: '4px solid #fff',
                        }}
                    />
                </Box>

                {/* Nome e Email */}
                <Box sx={{ textAlign: 'left', mt: 5, ml: 2, position: 'relative' }}>
                    <Box sx={{
                        position: 'absolute',
                        top: '-50px',
                        right: '10px',
                        textAlign: 'right'
                    }}>
                        <Typography variant="h6" color='black'>{funcionarios.cargo}</Typography>
                    </Box>
                    <Typography variant="h6">{funcionarios.nome}</Typography>
                    <Typography color="textSecondary">{funcionarios.email}</Typography>
                </Box>

                {/* Formulário de Edição */}
                <Divider />
                <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, px: 3 }}>
                    <TextField label="Nome" name="nome" value={funcionarios.nome || ''} onChange={handleChange} fullWidth />
                    <Divider />
                    <TextField
                        label="Cpf"
                        name="cpf"
                        value={funcionarios.cpf || ''}
                        onChange={handleChange}
                        fullWidth
                        InputProps={{
                            endAdornment: <CreditCard sx={{ color: '#FFD369' }} />,
                        }}
                    />
                    <Divider />
                    <TextField
                        label="Telefone"
                        name="telefone"
                        value={funcionarios.telefone || ''}
                        onChange={handleChange}
                        fullWidth
                        InputProps={{
                            endAdornment: <Phone sx={{ color: '#FFD369' }} />,
                        }}
                    />
                    <Divider />
                    <TextField
                        label="Email"
                        name="email"
                        value={funcionarios.email || ''}
                        onChange={handleChange}
                        type="email"
                        fullWidth
                        InputProps={{
                            endAdornment: <Email sx={{ color: '#FFD369' }} />,
                        }}
                    />
                    <Divider />
                    <TextField
                        label="Senha"
                        name="password"
                        type={senhaVerificada ? "text" : "password"} // Altera o tipo de acordo com a verificação
                        value={funcionarios.password || ''}
                        onChange={handleChange}
                        disabled={!senhaVerificada} // Desabilita o campo se a senha não estiver verificada
                        InputProps={{
                            startAdornment: <Typography color="textSecondary"></Typography>,
                            endAdornment: (
                                <IconButton onClick={() => !senhaVerificada && setOpenDialog(true)}>
                                    {senhaVerificada ? <LockOpen sx={{ color: '#FFD369' }} /> : <Lock sx={{ color: '#FFD369' }} />}
                                </IconButton>
                            ),
                        }}
                        fullWidth
                    />
                    <Divider />

                    {/* Modal para verificar a senha atual */}
                    <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                        <DialogTitle>Verificar Senha Atual</DialogTitle>
                        <DialogContent>
                            <TextField
                                label="Senha Atual"
                                type="password"
                                value={senhaAtual}
                                onChange={(e) => setSenhaAtual(e.target.value)}
                                fullWidth
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
                            <Button onClick={verificarSenhaAtual} variant="contained" color="primary">
                                Confirmar
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Box>

                {/* Foto do Perfil */}
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    mt: 2,
                }}>
                    <Typography color="textSecondary" sx={{ mt: -7, ml: 3, mr: 9 }}>Foto de perfil</Typography>
                    <Avatar
                          src={previewFile || `http://localhost:8800/fotos/${funcionarios.imagens}`}
                        alt="Profile photo"
                        sx={{ width: 52, height: 52, ml: 0, mt: -2 }}
                    />
                    <Button
                        variant="outlined"
                        component="label"
                        sx={{
                            ml: 1,
                            mt: -4,
                            borderColor: '#FFD369',
                            color: 'black',
                            '&:hover': {
                                borderColor: '#FFD369',
                                backgroundColor: 'rgba(255, 211, 105, 0.1)',
                            },
                        }}
                    >
                        Clique para mudar
                        <input type="file" hidden onChange={handleFileChange} />
                    </Button>
                </Box>
                <Divider />

                {/* Botões de Ação */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    mt: 2,
                    mr: 3,
                    mb: 2,
                }}>
                    <Button variant="text" sx={{ mr: 2, color: 'black' }} onClick={() => window.location.reload()} >
                        Cancelar
                    </Button>
                    <Button variant="contained" onClick={handleSave} sx={{ background: '#FFD369', color: 'black' }}>
                        Salvar
                    </Button>
                </Box>
            </Box>
        </div>
    );
}

export default ProfileScreen;
