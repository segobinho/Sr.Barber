import React, { useEffect, useState } from "react"; 
import axios from "axios";
import Header from '../../components/header/index';
import BarberCutsChart from "../../components/graficoos/teste"; // Importe o gráfico

function Analise() {
    const [dados, setDados] = useState([]);
    const [contagem, setContagem] = useState([]);

    useEffect(() => {
        // Função para consumir a API
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8800/teste123');
                setDados(response.data); // Atualiza o estado com os dados retornados da API
                
                // Agrupando e contando agendamentos por id_funcionario
                const contadorAgendamentos = response.data.reduce((acc, curr) => {
                    const idFuncionario = curr.id_funcionario; // Usando id_funcionario como chave
                    const nomeBarbearia = curr.nome_barbearia; // Supondo que o nome da barbearia está disponível nos dados

                    if (idFuncionario in acc) {
                        acc[idFuncionario].cuts++; // Incrementa a contagem
                    } else {
                        acc[idFuncionario] = {
                            name: curr.nome_funcionario, // Armazena o nome do funcionário
                            cuts: 1, // Inicializa a contagem
                            location: nomeBarbearia // Armazena o nome da barbearia
                        };
                    }
                    return acc;
                }, {});

                // Converte o objeto em um array
                const result = Object.values(contadorAgendamentos);
                setContagem(result); // Atualiza o estado com a contagem de agendamentos
            } catch (error) {
                console.error("Erro ao buscar os dados: ", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="container">
            <h1>Análise de Agendamentos</h1>
            {/* Passando os dados para o gráfico */}
            <BarberCutsChart barbersData={contagem} />
        </div>
    );
}

export default Analise;
