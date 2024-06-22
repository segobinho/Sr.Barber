import React, { useState, useEffect } from "react";
import Header from '../../components/header/index';
import Main from '../../components/main/index';
import './style.css';
import axios from "axios";

function Funcionarios() {
    const [barbearias, setBarbearias] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8800/barbearias')
            .then(response => {
                setBarbearias(response.data); // Assumindo que a resposta contém os dados das barbearias
            })
            .catch(error => {
                console.error('Erro ao buscar barbearias:', error);
            });
    }, []); // O array vazio assegura que o useEffect será executado apenas uma vez, equivalente ao componentDidMount
    
    return (
        <div>
            <Header />
            <Main>
                <div className="container">
                    <div className="bloco">
                        <div className="title">
                            <h1>Barbearias</h1>
                        </div>
                        <hr />
                        <div >
                            {barbearias.map(barbearia => (
                                <div className="barbearias-list"   key={barbearia.id}>
                                    <p className="barbeariap"><strong>Nome:</strong> {barbearia.nome}</p>
                                    <p className="barbeariap"><strong>Endereço:</strong> {barbearia.endereco}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bloco1">
                        <div className="container1">
                            {/* Outros elementos do bloco1 */}
                        </div>
                    </div>
                </div>
            </Main>
        </div>
    );
}

export default Funcionarios;
