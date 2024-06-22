import React, { useState, useEffect } from "react";
import Header from '../components/header/index';
import Main from '../components/main/index';
import { CiTrash } from "react-icons/ci";
import { GoPencil } from "react-icons/go";
import Modal from '../components/modal/index';
import './style.css';
import useFetchServices from "../components/FetchAllData/index";
import axios from "axios";
import { toast} from "react-toastify";
import { IoIosAddCircleOutline } from "react-icons/io";


function Receba() {
    const { services, setServices,  setFilteredServices } = useFetchServices("http://localhost:8800/se");
    const [selectedService, setSelectedService] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({ nome: '', duracao: '', preco: '', id_barbearia: '' });
    const [showAddModal, setShowAddModal] = useState(false);
    const [barbearias, setBarbearias] = useState([]);
    const [user, setUser] = useState(null); // Inicializa user como null

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        setUser(userData); // Define user com o valor do localStorage

        fetch("http://localhost:8800/barbearias")
            .then(response => response.json())
            .then(data => setBarbearias(data));
    }, []);

    useEffect(() => {
        if (user && user.cargo) { // Verifica se user e user.cargo existem antes de acessar
            fetch("http://localhost:8800/se")
                .then(response => response.json())
                .then(data => {
                    if (user.cargo === 'admin') {
                        setServices(data);
                        setFilteredServices(data);
                    } else if (user.cargo === 'gerente') {
                        const filteredData = data.filter(service => service.id_barbearia === user.id_barbearia);
                        setServices(filteredData);
                        setFilteredServices(filteredData);
                    }
                });
        }
    }, [user]); // Executa o useEffect sempre que user mudar

    const handleServiceClick = (id) => {
        fetch(`http://localhost:8800/service/${id}`)
            .then((response) => response.json())
            .then((data) => {
                setSelectedService(data);
                setFormData({ nome: data.nome, duracao: data.duracao, preco: data.preco, id_barbearia: data.id_barbearia });
                setEditMode(false);
            });
    };

    const handleEditService = (id) => {
        fetch(`http://localhost:8800/service/${id}`)
            .then((response) => response.json())
            .then((data) => {
                setSelectedService(data);
                setFormData({ nome: data.nome, duracao: data.duracao, preco: data.preco });
                setEditMode(true);
            });
    };

    const handleDelete = async (id_servico) => {
        if (!window.confirm("Tem certeza que deseja excluir este serviço?")) {
            return;
        }
        await axios
            .delete("http://localhost:8800/service/" + id_servico)
            .then(({ data }) => {
                const newArray = services.filter((services) => services.id_servico !== id_servico);

                setServices(newArray);
                toast.success("Serviço excluído com sucesso");
            })
            .catch(({ data }) => toast.error(data));
    };

    const handleInputChange = (e) => {
        const { value } = e.target;
        const filtered = services.filter(service =>
            service.nome.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredServices(filtered);
    };

    const handleFormInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleUpdateService = () => {
        fetch(`http://localhost:8800/service/${selectedService.id_servico}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then((response) => response.json())
            .then((data) => {
                fetch("http://localhost:8800/se")
                    .then((response) => response.json())
                    .then((data) => {
                        if (user.cargo === 'admin') {
                            setServices(data);
                            setFilteredServices(data);
                        } else if (user.cargo === 'gerente') {
                            const filteredData = data.filter(service => service.id_barbearia === user.id_barbearia);
                            setServices(filteredData);
                            setFilteredServices(filteredData);
                        }
                    });
                setEditMode(false);
                setSelectedService({ ...selectedService, ...formData });
                setEditMode(false);
            });
    };

    const handleAddService = () => {
        const serviceData = {
            ...formData,
            id_barbearia: user.cargo === 'gerente' ? user.id_barbearia : formData.id_barbearia
        };

        fetch("http://localhost:8800/service", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(serviceData),
        })
            .then((response) => response.json())
            .then((data) => {
                fetch("http://localhost:8800/se")
                    .then((response) => response.json())
                    .then((data) => {
                        if (user.cargo === 'admin') {
                            setServices(data);
                            setFilteredServices(data);
                        } else if (user.cargo === 'gerente') {
                            const filteredData = data.filter(service => service.id_barbearia === user.id_barbearia);
                            setServices(filteredData);
                            setFilteredServices(filteredData);
                        }
                    });
                setFormData({ nome: '', duracao: '', preco: '', id_barbearia: '' });
                setShowAddModal(false);
            });
    };

    return (
        <div>
            <Header />
            <Main>
                <div className="container">
                    <div className="bloco">
                        <div className="title">
                            <h1>Serviços</h1>
                          
                                <IoIosAddCircleOutline className="button1" onClick={() => setShowAddModal(true)} />
                                

                            
                        </div>
                     
                        <Modal
                            show={showAddModal}
                            onClose={() => setShowAddModal(false)}
                            onSubmit={handleAddService}
                            formData={formData}
                            onInputChange={handleFormInputChange}
                            barbearias={barbearias}
                            hideBarbeariaField={user && user.cargo === 'gerente'} // Passa hideBarbeariaField apenas se user e user.cargo existirem
                        />
                        <hr />
                        <div className="service-list">
                        {services.map((item, i) => (
    <div key={item.id_servico} className="service-item-container">
        <div className="service-item" >
            <div className="service-header">
                <div onClick={() => handleServiceClick(item.id_servico)}>
                <h1>{item.nome}</h1>
                </div>
                <div className="icon-container">
                    <CiTrash className="icon-delete" onClick={() => handleDelete(item.id_servico)} />
                    <GoPencil className="icon-edit" onClick={() => handleEditService(item.id_servico)} />
                </div>
            </div>
            <p>{item.barbearia_endereco}</p>
        </div>
    </div>
))}
                        </div>
                    </div>

                    <div className="bloco1">
                        <div className="container1">
                            {selectedService && (
                                editMode ? (
                                    <div className="editar">
                                        <div className="form-group">
                                            <label>Nome:</label>
                                            <input
                                                type="text"
                                                name="nome"
                                                value={formData.nome}
                                                onChange={handleFormInputChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Duração:</label>
                                            <input
                                                type="text"
                                                name="duracao"
                                                value={formData.duracao}
                                                onChange={handleFormInputChange}
                                            />
                                    </div>
                                    <div className="form-group">
                                        <label>Preço:</label>
                                        <input
                                            type="text"
                                            name="preco"
                                            value={formData.preco}
                                            onChange={handleFormInputChange}
                                        />
                                    </div>
                                   
                                        <input
                                            type="button"
                                            value="Atualizar"
                                            onClick={handleUpdateService}
                                        />
                                    
                                </div>
                                ) : (
                                    <>
                                        <div className="serviço">
                                            <div className="serviço-titulo">
                                                {selectedService.nome}
                                            </div>
                                            <div className="serviço-info">
                                                <p className="pserviço-info">Duração: {selectedService.duracao}</p>
                                                <p className="pserviço-info">Preço: {selectedService.preco}</p>
                                                <p className="pserviço-info">Barbearia: {selectedService.barbearia_nome}</p>
                                                <p className="pserviço-info">Endereço: {selectedService.barbearia_endereco}</p>
                                            </div>
                                        </div>
                                    </>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </Main>
           
        </div>
    );  
}

export default Receba;
