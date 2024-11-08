import React, { useState, useEffect } from 'react';
import { TextField } from '@mui/material';

const FiltroBusca = ({ itens, onFiltrar, placeholder }) => {
    const [busca, setBusca] = useState('');

    const lowerbusca = busca.toLowerCase();
    useEffect(() => {
        const itensFiltrados = itens.filter((iten) => {
            const nome = iten.nome || iten.name;
            return nome && nome.toLowerCase().includes(lowerbusca);
        });
        onFiltrar(itensFiltrados);
    }, [busca, itens]);

    return (
        <div>
       <TextField
    label={placeholder}
    variant="outlined"
    fullWidth
    value={busca}
    onChange={(ev) => setBusca(ev.target.value)}
    sx={{
        margin: '10px 0', // Margem superior e inferior
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: 'white', // Cor da borda
            },
            '&:hover fieldset': {
                borderColor: 'white', // Cor da borda ao passar o mouse
            },
            '&.Mui-focused fieldset': {
                borderColor: 'white', // Cor da borda quando focado
            },
        },
        '& .MuiInputLabel-root': {
            color: 'white', // Cor do label
            '&.Mui-focused': {
                color: 'yellow', // Cor do label quando focado
            },
        },
        '& .MuiInputBase-input': {
            color: 'yellow', // Cor do texto digitado
        },
    }}
/>
        </div>
    );
};

export default FiltroBusca;
    