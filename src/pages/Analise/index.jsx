import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from '../../components/header/index';
import BarberCutsChart from "../../components/graficoos/teste"; // Importe o gráfico
import Pizza from "../../components/graficoos/pizza"; // Importe o gráfico
import Main from "../../components/main";
import Linha from "../../components/graficoos/linha";
import DonutChart from "../../components/graficoos/donut";
import AreaChart from "../../components/graficoos/area";


import './style.css';


function Analise() {
    const [dados, setDados] = useState([]);
    const [contagem, setContagem] = useState([]);
    const [qauntservicos, setQuantservicos] = useState([])
    const [receita, setReceita] = useState([])
    const [metodos, setMetodos] = useState([])
    const [bdata, setBdata] = useState([])
    const [quantprodutos, setQuantprodutos] = useState([])
    console.log("recbw")

    const fetchDataFromAPI = async (url, setState, errorMessage) => {
        try {
            const response = await axios.get(url);
            setState(response.data);
        } catch (error) {
            console.error(errorMessage, error);
        }
    };

    useEffect(() => {
        fetchDataFromAPI('http://localhost:8800/bdata', setBdata, "Erro ao buscar os dados de barbearias");
        fetchDataFromAPI('http://localhost:8800/metodos', setMetodos, "Erro ao buscar os métodos de pagamento");
        fetchDataFromAPI('http://localhost:8800/quantservicos', setQuantservicos, "Erro ao buscar a quantidade de serviços");
        fetchDataFromAPI('http://localhost:8800/receita', setReceita, "Erro ao buscar os dados de receita");
        fetchDataFromAPI('http://localhost:8800/teste123', setDados, "Erro ao buscar os dados de agendamentos");
        fetchDataFromAPI('http://localhost:8800/quantprodutos', setQuantprodutos, "Erro ao buscar os dados de Produtos");

    }, []);

    useEffect(() => {
        if (dados.length > 0) {
            const contadorAgendamentos = dados.reduce((acc, curr) => {
                const idFuncionario = curr.id_funcionario;
                const nomeBarbearia = curr.nome_barbearia;

                if (idFuncionario in acc) {
                    acc[idFuncionario].cuts++;
                } else {
                    acc[idFuncionario] = {
                        name: curr.nome_funcionario,
                        cuts: 1,
                        location: nomeBarbearia
                    };
                }
                return acc;
            }, {});

            setContagem(Object.values(contadorAgendamentos));
        }
    }, [dados]);
    return (

        <div className="containerr">

            <Header />
            <div className="card-container">

                <div className="card">
                    <h1 className="hcard">Agendamentos Este Mês</h1>
                </div>
                <div className="card">
                    <h1 className="hcard">Renda Este Mês</h1>
                    {receita.length > 0 && receita.map(barbearia => (
                        <p key={barbearia.id_barbearia} className="pcard">
                            {barbearia.nome_barbearia}: R$ {barbearia.receita_mensal.toFixed(2)}
                        </p>
                    ))}
                </div>
            </div>

            <div className="chart-container">
            <div className="chart">
                    <h2>Metodos Mais Usados</h2>

                    <DonutChart dados={metodos} formatarTotal={true} />
                    <hr />
                    <h2>Servicos Mais Vendidos</h2>

                    <DonutChart dados={qauntservicos} />
                    <hr />
                    <h2>Produtos Mais Vendidos</h2>
                    <DonutChart dados={quantprodutos} />

                </div>
                <div className="chart">
                    <Linha barbersData={bdata} />
                </div>
               
                <div className="chart">
                    <AreaChart data={receita} />
                </div>
            </div>

        </div>
    );
}

export default Analise;
