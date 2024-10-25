import React from 'react';
import Chart from 'react-apexcharts';

const Pizza = ({ quantservicos }) => {
  // Organiza os dados para o gráfico
  const nome_servico = quantservicos.map(servico => servico.nome_servico); // Ajuste este nome de propriedade conforme necessário
  const total_vendido = quantservicos.map(servico => servico.total_vendido); // Ajuste este nome de propriedade conforme necessário

  // Configurações do gráfico
  const options = {
    chart: {
      type: 'pie',
      background: 'transparent', // Fundo transparente
    },
    labels: nome_servico,
    legend: {
      position: 'bottom',
      fontSize: '16px',
      labels: {
        colors: ['#333'], // Cor da legenda
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 300,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
    colors: ['#1E90FF', '#FF6347', '#32CD32', '#FFD700', '#8A2BE2'], // Cores personalizadas
    stroke: {
      show: true,
      width: 2,
      colors: ['#fff'], // Cor da borda do gráfico
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '14px',
        fontFamily: 'Helvetica, Arial, sans-serif',
        fontWeight: 'bold',
        colors: ['#333'], // Cor do texto
      },
      dropShadow: {
        enabled: true,
        top: 1,
        left: 1,
        blur: 1,
        color: '#000',
        opacity: 0.45,
      },
    },
    tooltip: {
      enabled: true,
      fillSeriesColor: false,
      style: {
        fontSize: '14px',
        background: '#fff',
        color: '#333',
      },
    },
  };

  // Dados do gráfico
  const series = total_vendido;

  return (
    <div>
      <Chart
        options={options}
        series={series}
        type="pie"
        width="450"
      />
    </div>
  );
};

export default Pizza;
