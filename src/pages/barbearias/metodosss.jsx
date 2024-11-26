import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
} from "@mui/material";
import { Edit, Add, Delete } from "@mui/icons-material";

const MetodoPagamento = ({ metodosPagamento, onAdd, onEdit, onDelete }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMetodo, setSelectedMetodo] = useState(null);
  const [nomeMetodo, setNomeMetodo] = useState("");
  const [desconto, setDesconto] = useState("");

  const handleAddClick = () => {
    setShowAddModal(true);
    setNomeMetodo("");
    setDesconto("");
  };

  const handleEditClick = (metodo) => {
    setSelectedMetodo(metodo);
    setNomeMetodo(metodo.nome_metodo);
    setDesconto(metodo.desconto);
    setShowEditModal(true);
  };

  const handleAdd = () => {
    onAdd({ nome_metodo: nomeMetodo, desconto });
    setShowAddModal(false);
  };

  const handleEdit = () => {
    onEdit({ ...selectedMetodo, nome_metodo: nomeMetodo, desconto });
    setShowEditModal(false);
  };

  const handleDelete = (metodo) => {
    onDelete(metodo);
  };

  return (
    <div  style={{
        backgroundColor: '#222831',
        borderColor: 'white',
        borderStyle: 'solid', // Definir o estilo da borda
        borderWidth: '1px', // Definir a espessura da borda
        borderRadius: '12px', // Adiciona arredondamento suave aos cantos
        padding: '16px', // Espaçamento interno para tornar o conteúdo mais agradável
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Adiciona uma sombra sutil
      }}>
      <h4 style={{ color: "#FFD369" }}>Métodos de Pagamento</h4>
     

      {metodosPagamento && metodosPagamento.length > 0 ? (
        <ul>
          {metodosPagamento.map((metodo, index) => (
            <li key={index}>
              <strong style={{ color: "#FFD369" }}>
                Nome: {metodo.nome_metodo}, Desconto: {metodo.desconto}%
              </strong>
              <IconButton
                onClick={() => handleEditClick(metodo)}
                style={{ color: "#2196F3", marginLeft: "10px" }}
              >
                <Edit />
              </IconButton>
              <IconButton
                onClick={() => handleDelete(metodo)}
                style={{ color: "#F44336", marginLeft: "10px" }}
              >
                <Delete />
              </IconButton>
            </li>
          ))}
        </ul>
      ) : (
        <p>Nenhum método disponível.</p>
      )}
         <Button
        variant="contained"
        startIcon={<Add />}
        onClick={handleAddClick}
        style={{ backgroundColor: "#4CAF50", color: "#fff", marginBottom: "16px" }}
      >
        Adicionar Método
      </Button>
      {/* Modal para Adicionar */}
      <Dialog open={showAddModal} onClose={() => setShowAddModal(false)}>
        <DialogTitle>Adicionar Método</DialogTitle>
        <DialogContent>
          <TextField
            label="Nome do Método"
            fullWidth
            margin="dense"
            value={nomeMetodo}
            onChange={(e) => setNomeMetodo(e.target.value)}
          />
          <TextField
            label="Desconto (%)"
            fullWidth
            margin="dense"
            type="number"
            value={desconto}
            onChange={(e) => setDesconto(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddModal(false)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleAdd}
            style={{ backgroundColor: "#4CAF50", color: "#fff" }}
          >
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal para Editar */}
      <Dialog open={showEditModal} onClose={() => setShowEditModal(false)}>
        <DialogTitle>Editar Método</DialogTitle>
        <DialogContent>
          <TextField
            label="Nome do Método"
            fullWidth
            margin="dense"
            value={nomeMetodo}
            onChange={(e) => setNomeMetodo(e.target.value)}
          />
          <TextField
            label="Desconto (%)"
            fullWidth
            margin="dense"
            type="number"
            value={desconto}
            onChange={(e) => setDesconto(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowEditModal(false)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleEdit}
            style={{ backgroundColor: "#FFD369", color: "#000" }}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MetodoPagamento;
