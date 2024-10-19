import React, { useState, useEffect } from "react";
import Header from '../../components/header/index';
import Main from '../../components/main/index';
import './style.css';
import axios from "axios";

function Funcionarios() {
    const [barbearias, setBarbearias] = useState([]);
    const [barbeariaselecioada, SetBarbeariaSelecionada] = useState(null)
    const [isEditing, setIsEditing] = useState(false);
    console.log('receba')





    useEffect(() => {
        axios.get('http://localhost:8800/barbearias')
            .then(response => {
                setBarbearias(response.data); // Assumindo que a resposta contém os dados das barbearias
            })
            .catch(error => {
                console.error('Erro ao buscar barbearias:', error);
            });
    }, []); // O array vazio assegura que o useEffect será executado apenas uma vez, equivalente ao componentDidMount

    const handleClienteClick = (barbearia) => {
        SetBarbeariaSelecionada(barbearia);
        console.log(barbeariaselecioada)
    };
    const handleTitleClick = () => {
        SetBarbeariaSelecionada(null); // Redefine para null
    };


    return (
        <div>
            <Header />
            <Main>
                <div className="container">
                    <div className="bloco">
                        <div className="title" onClick={handleTitleClick}>
                            <h1>Barbearias</h1>
                        </div>
                        <hr />
                        <div >
                            {barbearias.map(barbearia => (
                                <div className="barbearias-list" key={barbearia.id}>
                                    <div onClick={() => handleClienteClick(barbearia)}>
                                        <p className="barbeariap"><strong>Nome:</strong> {barbearia.nome}</p>
                                    </div>
                                    <p className="barbeariap"><strong>Endereço:</strong> {barbearia.endereco}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bloco1">
                        <div className="container1">
                            {barbeariaselecioada && (
                                <div className="container2">
                                    <h2 className="cliente-title3">Detalhes da Barbearia</h2>
                                    <div className="cliente-info3">
                                        <p><strong>Nome:</strong> {barbeariaselecioada.nome}</p>
                                        <p><strong>Endereço:</strong> {barbeariaselecioada.endereco}</p>
                                        <p><strong>Telefone:</strong> {barbeariaselecioada.telefone}</p>
                                        <p><strong>Email:</strong> {barbeariaselecioada.email}</p>

                                    </div>

                                </div>
                            )}
                            {!barbeariaselecioada && (
                                <p className="clique">Clique em um cliente para ver os detalhes</p>

                            )

                            }


                        </div>
                    </div>
                </div>
            </Main>
        </div>
    );
}

export default Funcionarios;
