import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';

const BarberComparisonChart = ({ barbersData }) => {
  const [selectedBarbers, setSelectedBarbers] = useState([]);
  const [barberMap, setBarberMap] = useState({}); // Mapa para armazenar dados dos barbeiros

  useEffect(() => {
    const map = {};
    barbersData.forEach(barber => {
      const nameWithId = `${barber.Funcionario} (${barber.Id_Funcionario})`; // Cria um nome único
      map[nameWithId] = {
        data: [
          barber.Janeiro,
          barber.Fevereiro,
          barber.Marco,
          barber.Abril,
          barber.Maio,
          barber.Junho,
          barber.Julho,
          barber.Agosto,
          barber.Setembro,
          barber.Outubro,
          barber.Novembro,
          barber.Dezembro
        ],
        foto: 'https://randomuser.me/api/portraits/men/1.jpg', // Foto fixa para todos os barbeiros
      };
    });
    setBarberMap(map);
  }, [barbersData]);

  const handleSelectBarber = (event) => {
    const value = event.target.value;
    if (selectedBarbers.includes(value)) {
      setSelectedBarbers(selectedBarbers.filter(barber => barber !== value));
    } else {
      setSelectedBarbers([...selectedBarbers, value]);
    }
  };

  const selectTopBarbers = () => {
    const sortedBarbers = Object.keys(barberMap).sort((a, b) => {
      const sumA = barberMap[a].data.reduce((acc, curr) => acc + curr, 0);
      const sumB = barberMap[b].data.reduce((acc, curr) => acc + curr, 0);
      return sumB - sumA; // Ordena de forma decrescente
    });
    const top3 = sortedBarbers.slice(0, 3);
    setSelectedBarbers(top3);
  };

  const selectBottomBarbers = () => {
    const sortedBarbers = Object.keys(barberMap).sort((a, b) => {
      const sumA = barberMap[a].data.reduce((acc, curr) => acc + curr, 0);
      const sumB = barberMap[b].data.reduce((acc, curr) => acc + curr, 0);
      return sumA - sumB; // Ordena de forma crescente
    });
    const bottom3 = sortedBarbers.slice(0, 3);
    setSelectedBarbers(bottom3);
  };

  const selectAllBarbers = () => {
    setSelectedBarbers(Object.keys(barberMap));
  };

  // Preparar dados para o gráfico
  const series = selectedBarbers.map(barber => {
    return {
      name: barber,
      data: barberMap[barber].data,
      // Customizando os pontos do gráfico para mostrar a foto do barbeiro
      markers: {
        shape: 'circle',
        size: 40,
        customHTML: function (props) {
          return `
            <div style="width: 40px; height: 40px; border-radius: 50%; overflow: hidden; display: flex; justify-content: center; align-items: center;">
              <img src="${barberMap[props.seriesName].foto}" alt="${props.seriesName}" style="width: 100%; height: 100%; object-fit: cover;" />
            </div>
          `;
        }
      }
    };
  });

  const options = {
    chart: {
      type: 'line',
      height: '100%',
    },
    xaxis: {
      categories: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    },
    title: {
      text: 'Comparação de Agendamentos',
      align: 'left',
    },
  };

  return (
    <div>
      <select multiple onChange={handleSelectBarber}>
        {Object.keys(barberMap).map(barber => (
          <option key={barber} value={barber}>
            {barber}
          </option>
        ))}
      </select>
      <button onClick={selectTopBarbers}>Selecionar 3 com Mais Agendamentos</button>
      <button onClick={selectBottomBarbers}>Selecionar 3 com Menos Agendamentos</button>
      <button onClick={selectAllBarbers}>Comparar Todos os Barbeiros</button>
      <Chart options={options} series={series} type="line" height={500} />
    </div>
  );
};

export default BarberComparisonChart;
