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
import CreditCardIcon from '@mui/icons-material/CreditCard';
import MetodoPagamento from "./metodosss";
import { getMetodos, addMetodo, editMetodo, removeMetodo } from './controler';
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
    const [showTeste, setShowTeste] = useState(false); // Estado para controlar a exibição do h1
    const [showDetails, setShowDetails] = useState(false); // Estado para controlar o que mostrar
    const [metodosPagamento, setMetodosPagamento] = useState([]);




    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        setUser(userData);
    }, []);


    const fetchMetodosPagamento = async () => {
        try {
            const response = await fetch('http://localhost:8800/metodosPagamento');
            const data = await response.json();
            setMetodosPagamento(data);
        } catch (error) {
            console.error('Erro ao buscar métodos de pagamento:', error);
        }
    };

    // Chamada da função ao carregar o componente
    useEffect(() => {
        fetchMetodosPagamento();
    }, []); // Array vazio para executar apenas na montagem do componente


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
            axios.get('http://localhost:8800/barbearias', {
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
        if (!values.nome || !values.telefone || !values.endereco) {
            toast.warning("Por favor, preencha todos os campos obrigatórios.");
            return false;
        }
        return true;
    };


    const handleClienteAdd = () => {
        if (!validateFields()) return;

        const idBarbearia = user.cargo === 'admin' ? values.id_barbearia : user.id_barbearia;

        axios.post('http://localhost:8800/addBarbearia', {
            nome: values.nome,
            endereco: values.endereco,
            telefone: values.telefone,
            email: values.email,
            id_barbearia: idBarbearia,

        }).then((response) => {
            const successMessage = response.data.message || 'Barbearia adicionado com sucesso!';

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
            endereco: selectedCliente.endereco,
            telefone: selectedCliente.telefone,
            email: selectedCliente.email,

        });
        console.log("ID da Barbearia sendo enviado para edição:", selectedCliente);
        setShowAddClienteForm(true);
    };

    const handleSaveEdit = () => {
        axios.put(`http://localhost:8800/updateBarbearia/${selectedCliente.id_barbearia}`, values)
            .then((response) => {
                setClientes(clientes.map(cliente =>
                    cliente.id_barbearia === selectedCliente.id_barbearia ? response.data : cliente
                ));
                setIsEditing(false);
                setSelectedCliente(response.data);
                setShowAddClienteForm(false);
                toast.success('Barbearia editado com sucesso!');
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
                axios.delete(`http://localhost:8800/clientes/${clienteId}`)
                    .then((response) => {
                        setClientes(clientes.filter(cliente => cliente.id_cliente !== clienteId));
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


    const handleClickteste = () => {
        setShowDetails(true);
    };

    const handleAddMetodo = async (novoMetodo) => {
        try {
          const response = await axios.post("http://localhost:8800/metodoss", novoMetodo);
          setMetodosPagamento([...metodosPagamento, response.data.metodo]);
          toast.success(response.data.message)
        } catch (error) {
          console.error("Erro ao adicionar método de pagamento:", error);
          toast.error("Erro ao adicionar método de pagamento:", error)
        }
      };
      

      const handleEditMetodo = async (metodoEditado) => {
        try {
          const response = await axios.put(`http://localhost:8800/metodoss/${metodoEditado.id_metodo}`, metodoEditado);

          setMetodosPagamento((prevMetodos) =>
            prevMetodos.map((metodo) =>
              metodo.id_metodo === metodoEditado.id_metodo ? response.data.metodo : metodo
            )
          );
          toast.success(response.data.message)
        } catch (error) {
          console.error("Erro ao editar método de pagamento:", error);
        }
      };

      const handleDeleteMetodo = async (metodo) => {
        try {
          await axios.delete(`http://localhost:8800/metodoss/${metodo.id_metodo}`);
          setMetodosPagamento((prevMetodos) =>
            prevMetodos.filter((m) => m.id_metodo !== metodo.id_metodo)
          );
          toast.success('Método desativado')
        } catch (error) {
          console.error("Erro ao excluir método de pagamento:", error);
        }
      };
    return (
        <div>
            <Header />
            <Main>
                <ToastContainer />
                <div className="container">
                    <div className="bloco">
                        <div className="title" onClick={handleTitleClick}>
                            <h1>Barbearias</h1>
                            <CreditCardIcon className="button1" style={{ color: '#FFD369', fontSize: 20, marginLeft: '10px' }} onClick={handleClickteste} />

                            <AddCircleOutline className="button1" onClick={handleClienteAddForm} />
                        </div>
                        <hr />
                        <div>
                            <FiltroBusca itens={clientes} onFiltrar={setClientesFiltrados} placeholder={"Buscar Barbearia"} />
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
                                        height: '60px',
                                        '&:hover': {
                                            borderColor: 'rgba(255, 255, 255, 0.8)',
                                        },
                                    }}
                                >
                                    <CardContent>
                                        <Typography variant="subtitle2" className="clientep" sx={{ color: 'yellow', fontSize: '0.8rem' }}>
                                            <strong>Nome:</strong> {cliente.nome}
                                        </Typography>
                                        <Typography variant="subtitle2" className="clientep" sx={{ color: 'yellow', fontSize: '0.8rem' }}>
                                            <strong>Endereço:</strong> {cliente.endereco}
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
                                    <h2 className="cliente-title3">{isEditing ? "Editar Barbearia" : "Adicionar Barbearia"}</h2>
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
                                        label="Telefone"
                                        type="number"
                                        name="telefone"
                                        variant="outlined"
                                        placeholder="Telefone"
                                        value={values.telefone || ''}
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
                                        label="Endereço"
                                        type="text"
                                        name="endereco"
                                        variant="outlined"
                                        placeholder="Endereço"
                                        value={values.endereco || ''}
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
                                        type="text"
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
                                    <h2 className="cliente-title3">Detalhes do Cliente</h2>
                                    <div className="cliente-info3">
                                        <p><strong>Nome:</strong> {selectedCliente.nome}</p>
                                        <p><strong>Endereço:</strong> {selectedCliente.endereco}</p>
                                        <p><strong>Telefone:</strong> {selectedCliente.telefone}</p>
                                        <p><strong>Email:</strong> {selectedCliente.email}</p>

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
                            {!showAddClienteForm && showTeste && !isEditing && !selectedCliente && (
                                <h1>teste</h1> // Exibido quando showTeste for true


                            )}

                            {!showAddClienteForm && !isEditing && !selectedCliente && (

                                <div>
                                    {!showDetails && (
                                        <p className="clique" onClick={handleClickteste} style={{ cursor: 'pointer' }}>
                                            Clique em um cliente para ver os detalhes
                                        </p>
                                    )}

                                    {showDetails && (
                                        <div>

                                            {metodosPagamento && metodosPagamento.length > 0 ? (
                                                <div>
                                                    {/* <h4 style={{ color: '#FFD369' }}>Métodos:</h4>
                                                    <ul>
                                                        {metodosPagamento.map((metodo, index) => (
                                                            <li key={index}>
                                                                <strong style={{ color: '#FFD369' }}>Nome do Método: {metodo.nome_metodo},</strong>
                                                                <strong style={{ color: '#FFD369' }}> Desconto: {metodo.desconto}%</strong>
                                                            </li>
                                                        ))}
                                                    </ul> */}
                                                    <MetodoPagamento
                                                        metodosPagamento={metodosPagamento}
                                                        onAdd={handleAddMetodo}
                                                        onEdit={handleEditMetodo}
                                                        onDelete={handleDeleteMetodo}

                                                    />
                                                </div>
                                            ) : (
                                                <p>Nenhum método disponível.</p>
                                            )}

                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Main >
        </div >
    );
}

export default Clientes;
