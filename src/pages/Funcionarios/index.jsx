import React, { useState, useEffect } from "react";
import Header from '../../components/header/index';
import Main from '../../components/main/index';
import './style.css';
import axios from "axios";

function Funcionarios() {
    const [funcionarios, setFuncionarios] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8800/funcionarios')
            .then(response => {
                setFuncionarios(response.data); // Assumindo que a resposta contém os dados dos funcionários
            })
            .catch(error => {
                console.error('Erro ao buscar funcionários:', error);
            });
    }, []); // O array vazio assegura que o useEffect será executado apenas uma vez, equivalente ao componentDidMount
    
    return (
        <div>
            <Header />
            <Main>
                <div className="container">
                    <div className="bloco2">
                        <div className="title">
                            <h1>Funcionários</h1>
                        </div>
                        <hr />
                        <div className="funcionarios-list">
                            {funcionarios.map(funcionario => (
                                <div key={funcionario.id}>
                                    <p className="pfunc"><strong>Nome:</strong> {funcionario.nome}</p>
                                    <p className="ppfunc"><strong>Cargo:</strong> {funcionario.cargo}</p>
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
