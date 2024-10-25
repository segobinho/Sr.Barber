import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';

const BarberComparisonChart = ({ barbersData }) => {
  const [selectedBarbers, setSelectedBarbers] = useState([]);
  const [barberMap, setBarberMap] = useState({}); // Mapa para armazenar dados dos barbeiros

  useEffect(() => {
    const map = {};
    barbersData.forEach(barber => {
      const nameWithId = `${barber.Funcionario} (${barber.Id_Funcionario})`; // Cria um nome único
      map[nameWithId] = [
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
      ];
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
      const sumA = barberMap[a].reduce((acc, curr) => acc + curr, 0);
      const sumB = barberMap[b].reduce((acc, curr) => acc + curr, 0);
      return sumB - sumA; // Ordena de forma decrescente
    });
    const top3 = sortedBarbers.slice(0, 3);
    setSelectedBarbers(top3);
  };

  const selectBottomBarbers = () => {
    const sortedBarbers = Object.keys(barberMap).sort((a, b) => {
      const sumA = barberMap[a].reduce((acc, curr) => acc + curr, 0);
      const sumB = barberMap[b].reduce((acc, curr) => acc + curr, 0);
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
      data: barberMap[barber],
    };
  });

  const options = {
    chart: {
      type: 'line',
      height: '100%' ,
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
      <Chart options={options} series={series} type="line" height={500}  />
    </div>
  );
};

export default BarberComparisonChart;
