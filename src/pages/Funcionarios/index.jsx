import React, { useState, useEffect } from "react";
import Header from '../../components/header/index';
import Main from '../../components/main/index';
import FiltroBusca from '../../components/filltro/inndex';
import './style.css';
import axios from "axios";
import { CiTrash } from "react-icons/ci";
import { GoPencil } from "react-icons/go";
import { Card, CardContent, Typography, IconButton, Select, TextField, FormControl, Button, MenuItem, InputLabel, Box } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AddCircleOutline } from "@mui/icons-material";
import Swal from 'sweetalert2';
import CategoriasClientes from "../../components/retorno";

function Clientes() {
    const [clientes, setClientes] = useState([]);
    const [user, setUser] = useState([]);
    const [selectedCliente, setSelectedCliente] = useState(null);
    const [values, setValues] = useState({});
    const [showAddClienteForm, setShowAddClienteForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [clientesFiltrados, setClientesFiltrados] = useState(clientes);
    const [barbearias, setBarbearias] = useState([]);
    const [receba, setReceba] = useState([
        { id: 1, nome: "João Silva", categoria: "1 mes" },

    ]);

    

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        setUser(userData);
    }, []);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        setUser(userData);

        if (userData?.cargo === 'admin') {
            axios.get('http://localhost:8800/barbearias')
                .then((response) => setBarbearias(response.data))
                .catch((error) => console.error('Erro ao buscar barbearias:', error));
        }
    }, []);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        setUser(userData);
        console.log(userData.cargo);
        console.log(user.cargo);


        if (userData) {
            axios.get('http://localhost:8800/funcionarios', {
                params: {
                    cargo: userData.cargo,
                    id_barbearia: userData.id_barbearia
                }
            })
                .then(response => {
                    setClientes(response.data);
                })
                .catch(error => {
                    console.error("Erro ao buscar clientes:", error);
                });
        }
    }, []);


    const handleAddValues = (event) => {
        setValues((prevValues) => ({
            ...prevValues,
            [event.target.name]: event.target.value,
        }));
    };
    const validateFields = () => {
        if (!values.nome || !values.email || !values.password || !values.cargo || (user.cargo === 'admin' && !values.id_barbearia)) {
            toast.warning("Por favor, preencha todos os campos obrigatórios.");
            return false;
        }

        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(values.email)) {
            toast.warning("Por favor, insira um e-mail válido.");
            return false;
        }
        return true;
    };


    const handleClienteAdd = () => {
        if (!validateFields()) return;

        const idBarbearia = user.cargo === 'admin' ? values.id_barbearia : user.id_barbearia;

        axios.post('http://localhost:8800/funcionarios', {
            nome: values.nome,
            email: values.email,
            password: values.password,
            cargo: values.cargo,
            id_barbearia: idBarbearia,

        }).then((response) => {
            const successMessage = response.data.message || 'Funcionario adicionado com sucesso!';

            if (successMessage === "Cliente já existe e está ativo") {

                toast.info(successMessage);
            } else {

                setClientes([...clientes, response.data]);
                setClientesFiltrados([...clientes, response.data]);
                setValues({});
                setShowAddClienteForm(false);
                toast.success(successMessage);
            }
        }).catch((error) => {
            console.error("Erro ao adicionar cliente:", error);
            const errorMessage = error.response?.data?.message || 'Erro ao adicionar cliente.';
            toast.error(errorMessage);
        });
    };

    console.log('adad', values)

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
            email: selectedCliente.email,
            password: selectedCliente.password,
            cargo: selectedCliente.cargo,

            id_barbearia: user.cargo === 'admin' ? selectedCliente.id_barbearia : user.id_barbearia,

        });
        console.log("ID da Barbearia sendo enviado para edição:", selectedCliente);
        setShowAddClienteForm(true);
    };

    const handleSaveEdit = () => {
        axios.put(`http://localhost:8800/funcionarios/${selectedCliente.id_funcionario}`, values)
            .then((response) => {
                setClientes(clientes.map(cliente =>
                    cliente.id_funcionario === selectedCliente.id_funcionario ? response.data : cliente
                ));
                setIsEditing(false);
                setSelectedCliente(response.data);
                setShowAddClienteForm(false);
                toast.success('Cliente editado com sucesso!');
            })
            .catch((error) => {
                console.error("Erro ao salvar edição:", error);
                console.log(values)
                toast.error('Erro ao editar cliente.');

            });
    };

    const handleClienteAddForm = () => {
        setIsEditing(false);
        setSelectedCliente(null);
        setValues({});
        setShowAddClienteForm(true);
    };

    const handleClienteDelete = (clienteId) => {
        Swal.fire({
            title: 'Tem certeza que deseja deletar?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sim, deletar!',
            cancelButtonText: 'Cancelar',
            customClass: {
                popup: 'swal-custom-popup',
                title: 'swal-custom-title',
                content: 'swal-custom-text',
                confirmButton: 'swal-custom-confirm-button',
                cancelButton: 'swal-custom-cancel-button'
            },
            width: '300px',
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`http://localhost:8800/funcionarios/${clienteId}`)
                    .then((response) => {
                        setClientes(clientes.filter(cliente => cliente.id_funcionario !== clienteId));
                        setSelectedCliente(null);
                        const successMessage = response.data.message || 'Cliente deletado com sucesso!';
                        toast.success(successMessage);
                    })
                    .catch((error) => {
                        console.error("Erro ao deletar cliente:", error);
                        const errorMessage = error.response?.data?.message || 'Erro ao deletar cliente.';
                        toast.error(errorMessage);
                    });
            }
        });
    };
    const handleTitleClick = () => {
        setSelectedCliente(null);
    };

    return (
        <div>
            <Header />
            <Main>
                <ToastContainer />
                <div className="container">
                    <div className="bloco">
                        <div className="title" onClick={handleTitleClick}>
                            <h1>Funcionários</h1>
                            <AddCircleOutline className="button1" onClick={handleClienteAddForm} />
                        </div>
                        <hr />
                        <div>
                            <FiltroBusca itens={clientes} onFiltrar={setClientesFiltrados} placeholder={"Buscar Funcionário"} />
                            {clientesFiltrados.map(cliente => (
                                <Card
                                    className="barbearias-list"
                                    key={cliente.id_cliente}
                                    variant="outlined"
                                    onClick={() => handleClienteClick(cliente)}
                                    sx={{
                                        margin: 1,
                                        borderColor: 'rgba(255, 255, 255, 0.5)',
                                        backgroundColor: 'transparent',
                                        width: '200px',
                                        height: '70px',
                                        '&:hover': {
                                            borderColor: 'rgba(255, 255, 255, 0.8)',
                                        },
                                    }}
                                >
                                    <CardContent>
                                        <Typography variant="subtitle2" className="clientep" sx={{ color: 'yellow', fontSize: '0.8rem' }}>
                                            <strong className="strongg">Nome:</strong> {cliente.nome}
                                        </Typography>
                                        <Typography variant="subtitle2" className="clientep" sx={{ color: 'yellow', fontSize: '0.8rem' }}>
                                            <strong className="strongg" >Cargo:</strong> {cliente.cargo}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                    <div className="bloco1">
                        <div className="container1">
                            {showAddClienteForm && (
                                <div className="container2">
                                    <h2 className="cliente-title3">{isEditing ? "Editar" : "Adicionar "}</h2>
                                    <TextField
                                        label="Nome"
                                        type="text"
                                        name="nome"
                                        variant="outlined"
                                        placeholder="Nome"
                                        value={values.nome || ''}
                                        onChange={handleAddValues}
                                        InputLabelProps={{
                                            shrink: true, // Garante que o label fique posicionado corretamente
                                        }}
                                        sx={{
                                            margin: '10px 0', // Margem superior e inferior
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    borderColor: 'white', // Cor da borda
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: 'white', // Cor da borda ao passar o mouse
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: 'white', // Cor da borda quando focado
                                                },
                                            },
                                            '& .MuiInputLabel-root': {
                                                color: 'white', // Cor do label
                                                '&.Mui-focused': {
                                                    color: 'yellow', // Cor do label quando focado
                                                },
                                            },
                                            '& .MuiInputBase-input': {
                                                color: 'yellow', // Cor do texto digitado
                                                padding: '4px 8px', // Padding reduzido para texto digitado
                                                height: '1.5em', // Ajusta a altura mínima
                                            },
                                        }}
                                    />


                                    <TextField
                                        label="Email"
                                        type="email"
                                        name="email"
                                        variant="outlined"
                                        placeholder="Email"
                                        value={values.email || ''}
                                        onChange={handleAddValues}
                                        InputLabelProps={{
                                            shrink: true, // Garante que o label fique posicionado corretamente
                                        }}
                                        sx={{
                                            margin: '10px 0', // Margem superior e inferior
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    borderColor: 'white', // Cor da borda
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: 'white', // Cor da borda ao passar o mouse
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: 'white', // Cor da borda quando focado
                                                },
                                            },
                                            '& .MuiInputLabel-root': {
                                                color: 'white', // Cor do label
                                                '&.Mui-focused': {
                                                    color: 'yellow', // Cor do label quando focado
                                                },
                                            },
                                            '& .MuiInputBase-input': {
                                                color: 'yellow', // Cor do texto digitado
                                                padding: '4px 8px', // Padding reduzido para texto digitado
                                                height: '1.5em', // Ajusta a altura mínima
                                            },
                                        }}
                                    />

                                    <TextField
                                        label="Senha"
                                        type="text"
                                        name="password"
                                        variant="outlined"
                                        placeholder="Senha"
                                        value={values.password || ''}
                                        onChange={handleAddValues}
                                        InputLabelProps={{
                                            shrink: true, // Garante que o label fique posicionado corretamente
                                        }}
                                        sx={{
                                            margin: '10px 0', // Margem superior e inferior
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    borderColor: 'white', // Cor da borda
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: 'white', // Cor da borda ao passar o mouse
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: 'white', // Cor da borda quando focado
                                                },
                                            },
                                            '& .MuiInputLabel-root': {
                                                color: 'white', // Cor do label
                                                '&.Mui-focused': {
                                                    color: 'yellow', // Cor do label quando focado
                                                },
                                            },
                                            '& .MuiInputBase-input': {
                                                color: 'yellow', // Cor do texto digitado
                                                padding: '4px 8px', // Padding reduzido para texto digitado
                                                height: '1.5em', // Ajusta a altura mínima
                                            },
                                        }}
                                    />

                                    <TextField
                                        select
                                        label="Cargo"
                                        name="cargo"

                                        value={values.cargo || ''}
                                        onChange={handleAddValues}
                                        fullWidth
                                        variant="outlined"
                                        InputLabelProps={{
                                            shrink: true, // Garante que o label fique posicionado corretamente
                                        }}
                                        sx={{
                                            margin: '10px 0', // Margem superior e inferior
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    borderColor: 'white', // Cor da borda
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: 'white', // Cor da borda ao passar o mouse
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: 'white', // Cor da borda quando focado
                                                },
                                            },
                                            '& .MuiInputLabel-root': {
                                                color: 'yellow', // Cor do label
                                                '&.Mui-focused': {
                                                    color: 'yellow', // Cor do label quando focado
                                                },
                                            },
                                            '& .MuiInputBase-input': {
                                                color: 'yellow', // Cor do texto digitado
                                                padding: '4px 8px', // Padding reduzido para texto digitado
                                                height: '1.5em', // Ajusta a altura mínima
                                            },
                                        }}
                                    >

                                        <MenuItem value="" disabled>
                                            Escolha o cargo
                                        </MenuItem>
                                        {/* Apenas exibe "Gerente" se o cargo do usuário for admin */}
                                        {user.cargo === 'admin' && (
                                            <MenuItem value="Gerente">
                                                Gerente
                                            </MenuItem>
                                        )}
                                        <MenuItem value="Barbeiro">
                                            Barbeiro
                                        </MenuItem>
                                        <MenuItem value="Recepcionista">
                                            Recepcionista
                                        </MenuItem>
                                    </TextField>



                                    {user.cargo === 'admin' && (
                                        <TextField
                                            select
                                            label="Barbearia"
                                            name="id_barbearia"

                                            value={values.id_barbearia || ''}
                                            onChange={handleAddValues}
                                            fullWidth
                                            variant="outlined"
                                            InputLabelProps={{
                                                shrink: true, // Garante que o label fique posicionado corretamente
                                            }}
                                            sx={{
                                                margin: '10px 0', // Margem superior e inferior
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': {
                                                        borderColor: 'white', // Cor da borda
                                                    },
                                                    '&:hover fieldset': {
                                                        borderColor: 'white', // Cor da borda ao passar o mouse
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: 'white', // Cor da borda quando focado
                                                    },
                                                },
                                                '& .MuiInputLabel-root': {
                                                    color: 'yellow', // Cor do label
                                                    '&.Mui-focused': {
                                                        color: 'yellow', // Cor do label quando focado
                                                    },
                                                },
                                                '& .MuiInputBase-input': {
                                                    color: 'yellow', // Cor do texto digitado
                                                    padding: '4px 8px', // Padding reduzido para texto digitado
                                                    height: '1.5em', // Ajusta a altura mínima
                                                },
                                            }}
                                        >

                                            <MenuItem value="" disabled>
                                                Escolha a barbearia
                                            </MenuItem>
                                            {barbearias.map((barbearia) => (
                                                <MenuItem key={barbearia.id_barbearia} value={barbearia.id_barbearia}>
                                                    {barbearia.nome} {/* Exibe o nome da barbearia */}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    )}
                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        <Button
                                            variant="contained"
                                            onClick={isEditing ? handleSaveEdit : handleClienteAdd}
                                            sx={{
                                                backgroundColor: 'yellow',
                                                color: 'black',
                                                textTransform: 'uppercase', // Texto em maiúsculas
                                                '&:hover': {
                                                    backgroundColor: 'gold',
                                                },
                                                padding: '8px 16px',
                                            }}
                                        >
                                            {isEditing ? 'Salvar' : 'Adicionar'}
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            onClick={() => setShowAddClienteForm(false)}
                                            sx={{
                                                color: 'white',
                                                borderColor: 'white',
                                                textTransform: 'uppercase', // Texto em maiúsculas
                                                '&:hover': {
                                                    borderColor: 'yellow',
                                                    color: 'yellow',
                                                },
                                                padding: '8px 16px',
                                            }}
                                        >
                                            Cancelar
                                        </Button>
                                    </Box>
                                </div>
                            )}
                            {!showAddClienteForm && !isEditing && selectedCliente && (
                                <div className="container2">
                                    <h2 className="cliente-title3">Detalhes do Funcionário</h2>
                                    <div className="cliente-info3">
                                        <p><strong>Nome:</strong> {selectedCliente.nome}</p>
                                        <p><strong>Cargo:</strong> {selectedCliente.cargo}</p>
                                        <p><strong>Email:</strong> {selectedCliente.email}</p>
                                        <p><strong>Telefone:</strong> {selectedCliente.telefone}</p>

                                    </div>
                                    <div className="icon-container">
                                        <GoPencil className="icon-edit" title="Editar Cliente" onClick={handleClienteEditForm} />
                                        <CiTrash className="icon-delete" title="Deletar Cliente" onClick={() => {
                                            console.log('Tentando deletar cliente com ID:', selectedCliente.id_funcionario);
                                            handleClienteDelete(selectedCliente.id_funcionario);
                                        }} />

                                    </div>
                                </div>
                            )}
                            {!showAddClienteForm && !isEditing && !selectedCliente && (

                                <>
                                    <p className="clique">Clique em um cliente para ver os detalhes</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </Main>
        </div>
    );
}

export default Clientes;
