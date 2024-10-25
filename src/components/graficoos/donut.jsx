import React from "react";
import Chart from "react-apexcharts";

const DonutChart = ({ dados, formatarTotal = false }) => {
    // Verifique se os dados existem antes de tentar usá-los
    if (!dados || dados.length === 0) {
        return <div>Carregando dados...</div>; // Exibe uma mensagem de carregamento se os dados não existirem
    }

    // Extrai os nomes e valores dos dados recebidos
    const labels = dados.map(item => item.nome); // Substitua 'nome' pela chave correta
    const series = dados.map(item => item.valor); // Substitua 'valor' pela chave correta

    // Calcula o valor total somando todos os valores
    const total = series.reduce((acc, val) => acc + val, 0);

    const options = {
        chart: {
            type: 'donut',
        },
        labels: labels, // Usa os nomes como labels
        responsive: [
            {
                breakpoint: 480,
                options: {
                    chart: {
                        width: 300
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        ],
        colors: ['#008FFB', '#FFD369', '#6979F8', '#FF4560', '#00E396'], // Cores dinâmicas
        legend: {
            position: 'right',
            offsetY: 0,
            height: 230,
        },
        // Adiciona o valor total no centro do gráfico
        plotOptions: {
            pie: {
                donut: {
                    labels: {
                        show: true,
                        total: {
                            show: true,
                            label: 'Total',
                            formatter: function () {
                                // Retorna o total formatado apenas se formatarTotal for true
                                return formatarTotal ? `R$ ${total.toFixed(2)}` : total;
                            }
                        }
                    }
                }
            }
        }
    };

    return (
        <div>
            <Chart
                options={options}
                series={series}
                type="donut"
                width="400"
            />
        </div>
    );
};

export default DonutChart;