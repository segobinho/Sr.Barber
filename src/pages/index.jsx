import React, { useEffect, useState } from "react";
import Header from '../components/header/index';
import Main from '../components/main/index';
import { CiTrash } from "react-icons/ci"; // Importando o ícone de lixeira
import { GoPencil } from "react-icons/go";

import './style.css';

function Receba() {
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({ nome: '', duracao: '', preco: '' });
    const [filteredServices, setFilteredServices] = useState([]); // Adicionando estado para serviços filtrados

    useEffect(() => {
        fetch("http://localhost:8800/se")
            .then((response) => response.json())
            .then((data) => {
                setServices(data);
                setFilteredServices(data); // Inicializando os serviços filtrados com todos os serviços
            });
    }, []);

    const handleServiceClick = (id) => {
        fetch(`http://localhost:8800/service/${id}`)
            .then((response) => response.json())
            .then((data) => {
                setSelectedService(data);
                setFormData({ nome: data.nome, duracao: data.duracao, preco: data.preco });
                setEditMode(false);
            });
    };

    const handleEditService = () => {
        setEditMode(true);
    };

    const handleDeleteService = () => {
        if (!selectedService) {
            // Se nenhum serviço estiver selecionado, apenas retorne sem fazer nada
            return;
        }

        fetch(`http://localhost:8800/service/${selectedService.id_servico}`, {
            method: 'DELETE',
        })
            .then((response) => {
                if (response.ok) {
                    // Atualizar a lista de serviços após a exclusão
                    fetch("http://localhost:8800/se")
                        .then((response) => response.json())
                        .then((data) => {
                            setServices(data);
                            setFilteredServices(data); // Atualizar também os serviços filtrados
                        });
                    setSelectedService(null);
                }
            });
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
        if (!selectedService) {
            // Se nenhum serviço estiver selecionado, apenas retorne sem fazer nada
            return;
        }

        fetch(`http://localhost:8800/service/${selectedService.id_servico}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                // Atualizar a lista de serviços após a edição
                fetch("http://localhost:8800/se")
                    .then((response) => response.json())
                    .then((data) => {
                        setServices(data);
                        setFilteredServices(data); // Atualizar também os serviços filtrados
                    });
                setEditMode(false);
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
                            <input className="button1" type="button" value="+" />
                        </div>
                        <div className="input-and-buttons">
                            <div className="pesquisa">
                                <input className="pesquisa-input" type="text" onChange={handleInputChange} placeholder="Pesquisar serviços" />
                            </div>
                            <div className="button-container">
                                <button className="button-edit" onClick={handleEditService}>
                                    <GoPencil />
                                </button>
                                <button className="button-delete" onClick={handleDeleteService}>
                                    <CiTrash />
                                </button>
                            </div>
                        </div>
                        <hr />
                        <div className="service-list">
                            {filteredServices.map((service) => (
                                <div key={service.id_servico} className="service-item-container">
                                    <div
                                        className="service-item"
                                        onClick={() => handleServiceClick(service.id_servico)}
                                    >
                                        <h1 className="service-title">{service.nome}</h1>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bloco1">
                        <div className="container1">
                            {selectedService ? (
                                editMode ? (
                                    <div>
                                        <div className="">
                                            <label>Nome:</label>
                                            <input
                                                type="text"
                                                name="nome"
                                                value={formData.nome}
                                                onChange={handleFormInputChange}
                                            />
                                        </div>
                                        <div className="">
                                            <label>Duração:</label>
                                            <input
                                                type="text"
                                                name="duracao"
                                                value={formData.duracao}
                                                onChange={handleFormInputChange}
                                            />
                                        </div>
                                        <div className="">
                                            <label>Preço:</label>
                                            <input
                                                type="text"
                                                name="preco"
                                                value={formData.preco}
                                                onChange={handleFormInputChange}
                                            />
                                        </div>
                                        <input
                                            className="button-update"
                                            type="button"
                                            value="Atualizar"
                                            onClick={handleUpdateService}
                                        />
                                    </div>
                                ) : (
                                    <>
                                        <div className="serviço">
                                            <div className="serviço-titulo" >
                                                titulo
                                            </div>
                                            <div className="serviço-info">
                                                <p> duração : {selectedService.duracao}</p>
                                                <p> preço :{selectedService.preco}</p>
                                                <p>nome :{selectedService.nome}</p>
                                            </div>
                                        </div>

                                    </>
                                )
                            ) : (
                                <p>Selecione um serviço para ver os detalhes</p>
                            )}
                        </div>
                    </div>
                </div>
            </Main>
        </div>
    );
}

export default Receba;
