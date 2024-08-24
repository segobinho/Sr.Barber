import React, { useState, useEffect } from "react";
import Header from '../../components/header/index';
import Main from '../../components/main/index';
import './style.css';
import axios from "axios";

function Funcionarios() {
    const [funcionarios, setFuncionarios] = useState([]);
    const [user, setUser] = useState([]);



    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        setUser(userData); // Define user com o valor do localStorage
    }, []);

    useEffect(() => {
        if (user && user.cargo) {
            axios.get('http://localhost:8800/funcionarios')
                .then(response => {
                    if (user.cargo === 'admin') {
                        setFuncionarios(response.data);
                    } else if (user.cargo === 'gerente' || user.cargo === 'funcionario') {
                        const filteredData = response.data.filter(service => service.id_barbearia === user.id_barbearia);
                        setFuncionarios(filteredData);
                    }
                }
                )
        }
    }
    )



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
