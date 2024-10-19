import React, { useState, useMemo } from 'react';
import Chart from 'react-apexcharts';

const BarberCutsChart = ({ barbersData }) => {
    const [filter, setFilter] = useState('all'); // Estado para o filtro: 'all', 'max', 'min'

    // Função para encontrar o barbeiro com mais e menos cortes
    const filteredBarbers = useMemo(() => {
        if (!Array.isArray(barbersData)) return []; // Garante que barbersData é um array
        if (filter === 'max') {
            const maxCuts = Math.max(...barbersData.map(barber => barber.cuts));
            return barbersData.filter(barber => barber.cuts === maxCuts);
        }
        if (filter === 'min') {
            const minCuts = Math.min(...barbersData.map(barber => barber.cuts));
            return barbersData.filter(barber => barber.cuts === minCuts);
        }
        return barbersData;  // Mostra todos os barbeiros por padrão
    }, [filter, barbersData]);

    // Configuração do gráfico
    const chartOptions = {
        chart: {
            type: 'bar',
            height: 450, // Aumentando a altura
            toolbar: {
                show: false
            },
        },
        plotOptions: {
            bar: {
                horizontal: false, // Alterando para gráfico de barras verticais
                barHeight: '70%',
                borderRadius: 8,
            }
        },
        dataLabels: {
            enabled: true,
            formatter: function (val) {
                return `${val} cortes`;
            },
            offsetX: 10,
            style: {
                fontSize: '16px', // Aumentando o tamanho da fonte
                fontWeight: 'bold',
                colors: ['#fff'],
            },
        },
        xaxis: {
            categories: filteredBarbers.map(barber => `${barber.name} (${barber.location})`),
            labels: {
                style: {
                    fontSize: '16px', // Aumentando o tamanho da fonte
                    fontWeight: 'bold',
                }
            }
        },
        yaxis: {
            title: {
                text: 'Quantidade de Cortes',
                style: {
                    fontSize: '16px', // Aumentando o tamanho da fonte do título
                    fontWeight: 'bold',
                }
            },
            labels: {
                style: {
                    fontSize: '16px', // Aumentando o tamanho da fonte
                    fontWeight: 'bold',
                    colors: ['#333'],
                }
            }
        },
        fill: {
            colors: ['#1E90FF', '#32CD32', '#FF6347'], // Cores mais atraentes
        },
        grid: {
            borderColor: '#f1f1f1',
        },
        tooltip: {
            theme: 'dark',
            y: {
                formatter: function (val) {
                    return `${val} cortes`;
                }
            }
        }
    };

    const seriesData = [
        {
            name: 'Cortes',
            data: filteredBarbers.map(barber => barber.cuts),
        }
    ];

    return (
        <div>
            <h2 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '24px', fontWeight: 'bold' }}>
                Quantidade de Cortes por Barbeiro
            </h2>

            {/* Filtro de barbeiros */}
            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                <label style={{ fontSize: '16px', fontWeight: 'bold' }}>Filtrar por: </label>
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    style={{ fontSize: '16px', padding: '5px' }}
                >
                    <option value="all">Todos</option>
                    <option value="max">Mais cortes</option>
                    <option value="min">Menos cortes</option>
                </select>
            </div>

            {filteredBarbers.length > 0 ? ( // Verifica se existem barbeiros filtrados
                <Chart
                    options={chartOptions}
                    series={seriesData}
                    type="bar"
                    height={450} // Aumentando a altura do gráfico
                />
            ) : (
                <p style={{ textAlign: 'center', fontSize: '18px', color: '#666' }}>Nenhum dado disponível para exibir.</p>
            )}
        </div>
    );
};

export default BarberCutsChart;
