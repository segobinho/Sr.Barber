import React, { useState, useEffect } from 'react';
import './style.css'; // Importando o arquivo CSS


const FiltroBusca = ({ itens, onFiltrar, placeholder }) => {
    const [busca, setBusca] = useState('');


    const lowerbusca = busca.toLowerCase()
    useEffect(() => {
        // Filtra os itens sempre que a busca for atualizada
        const itensFiltrados = itens.filter((iten) => {
            const nome = iten.nome || iten.name; // Usa nome se existir, caso contrário usa name
            return nome && nome.toLowerCase().includes(lowerbusca); // ignora maiúsculas/minúsculas
        });
        // Passa os itens filtrados para o componente pai
        onFiltrar(itensFiltrados);
    }, [busca, itens]); // Atualiza sempre que a busca ou os itens mudarem

    return (
        <div>
            <input
                className="filtro-busca-input"
                type="text"
                placeholder={placeholder}
                value={busca}
                onChange={(ev) => setBusca(ev.target.value)}
            />
        </div>
    );
};

export default FiltroBusca;
