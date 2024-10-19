import React, { useState } from 'react';
import EditForm from '../EditForm/EditForm';
import EditField from '../EditField/EditField';
import EditButton from '../EditButton/EditButton';
import './EditClient.css';

const EditClient = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para salvar os dados
    console.log('Dados salvos:', formData);
  };

  const handleDelete = () => {
    // Lógica para deletar
    console.log('Cliente deletado');
  };

  return (
    <EditForm onSubmit={handleSubmit}>
      <EditField 
        label="Nome" 
        name="name" 
        value={formData.name} 
        onChange={handleChange} 
      />
      <EditField 
        label="Email" 
        name="email" 
        value={formData.email} 
        onChange={handleChange} 
      />
      <div className="button-group">
        <EditButton type="submit">Salvar</EditButton>
        <EditButton type="button" onClick={handleDelete}>Deletar</EditButton>
        <EditButton type="button" onClick={() => setFormData({ name: '', email: '' })}>Cancelar</EditButton>
      </div>
    </EditForm>
  );
};

export default EditClient;
