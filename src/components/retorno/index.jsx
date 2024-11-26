import React, { useState } from "react";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";

const CategoriasClientes = ({ clientes }) => {
    const [expanded, setExpanded] = useState(null); // Estado para controlar qual categoria está expandida

    const categorias = [
        { titulo: "1 mês", filtro: (cliente) => cliente.categoria === "1 mes" },
        { titulo: "3 meses", filtro: (cliente) => cliente.categoria === "3 meses" },
        { titulo: "6 meses", filtro: (cliente) => cliente.categoria === "6 meses" },
        { titulo: "1 ano", filtro: (cliente) => cliente.categoria === "1 ano" },
    ];

    // Função para alternar a visibilidade da lista de clientes
    const handleToggle = (index) => {
        setExpanded(expanded === index ? null : index); // Se já estiver aberto, fecha, se não, abre
    };

    return (
        <Box sx={{ backgroundColor: 'white', padding: 3, borderRadius: 2, boxShadow: 2 }}>
            {/* Título Geral */}
            <Typography variant="h4" align="center" sx={{ marginBottom: 3, fontWeight: 'bold', color: 'black' }}>
                Clientes que não retornam à Barbearia
            </Typography>

            <Box display="flex" gap={2} flexWrap="wrap">
                {categorias.map((categoria, index) => (
                    <Box key={categoria.titulo} flex="1" minWidth="250px">
                        <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ marginBottom: 1 }}>
                            {/* Título da categoria com cor preta */}
                            <Typography variant="h6" sx={{ color: 'black', fontWeight: 'bold' }}>
                                {categoria.titulo}
                            </Typography>
                            <IconButton onClick={() => handleToggle(index)}>
                                {expanded === index ? <ExpandLess /> : <ExpandMore />}
                            </IconButton>
                        </Box>
                        
                        {/* Lista de clientes visível somente se a categoria estiver expandida */}
                        {expanded === index && (
                            <Box sx={{ backgroundColor: 'white', padding: 2 }}>
                                <TableContainer component={Paper}>
                                    <Table sx={{ minWidth: 300 }}>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="center" sx={{ fontWeight: "bold", backgroundColor: "#f4f4f4" }}>
                                                    Nome do Cliente
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {clientes
                                                .filter(categoria.filtro)
                                                .map((cliente) => (
                                                    <TableRow key={cliente.id}>
                                                        <TableCell>{cliente.nome}</TableCell>
                                                    </TableRow>
                                                ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        )}
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default CategoriasClientes;
