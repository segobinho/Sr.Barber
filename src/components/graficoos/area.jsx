import React from 'react';
import Chart from 'react-apexcharts';

const ReceitasBarbearia = ({ data }) => {
  const series = [
    {
      name: 'Receita Diária',
      data: data.map(barbearia => barbearia.receita_diaria),
    },
    {
      name: 'Receita Semanal',
      data: data.map(barbearia => barbearia.receita_semanal),
    },
    {
      name: 'Receita Mensal',
      data: data.map(barbearia => barbearia.receita_mensal),
    },
    {
      name: 'Receita Trimestral',
      data: data.map(barbearia => barbearia.receita_trimestral),
    },
    {
      name: 'Receita Semestral',
      data: data.map(barbearia => barbearia.receita_semestral),
    },
    {
      name: 'Receita Anual',
      data: data.map(barbearia => barbearia.receita_anual),
    },
  ];

  const options = {
    chart: {
      type: 'bar',
      toolbar: {
        show: true,
      },
    },
    colors: ['#00A7E1', '#FF6361', '#FFA600', '#58508D', '#BC5090', '#003F5C'],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '60%',
        endingShape: 'rounded',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: data.map(barbearia => barbearia.nome_barbearia),
      title: {
        text: 'Barbearias',
        style: {
          fontSize: '14px',
          fontWeight: 600,
        },
      },
    },
    yaxis: {
      title: {
        text: 'Receita (R$)',
        style: {
          fontSize: '14px',
          fontWeight: 600,
        },
      },
    },
    legend: {
      position: 'top',
      horizontalAlign: 'center',
      floating: true,
      fontSize: '14px',
      fontWeight: 600,
      markers: {
        radius: 4,
      },
    },
    tooltip: {
      y: {
        formatter: (val) => `R$ ${val.toLocaleString()}`,
      },
    },
    fill: {
      opacity: 1,
    },
    
  };

  return (
    <div>
      <Chart options={options} series={series} type="bar" height={500} />
    </div>
  );
};

export default ReceitasBarbearia;
