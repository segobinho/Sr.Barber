import axios from 'axios';

const API_URL = 'http://localhost:8800'; // URL do seu backend

// Obter todos os métodos
export const getMetodos = async () => {
  try {
    const response = await axios.get(`${API_URL}/metodos`);
    return response.data;
  } catch (err) {
    console.error('Erro ao obter métodos:', err);
    throw err;
  }
};

export const addMetodo = async (nome_metodo, desconto) => {
  try {
    const response = await axios.post(`${API_URL}/metodos`, { nome_metodo, desconto });
    return response.data;
  } catch (err) {
    console.error('Erro ao adicionar método:', err);
    throw err;
  }
};

export const editMetodo = async (id_metodo, nome_metodo, desconto) => {
  try {
    const response = await axios.put(`${API_URL}/metodos/${id_metodo}`, { nome_metodo, desconto });
    return response.data;
  } catch (err) {
    console.error('Erro ao editar método:', err);
    throw err;
  }
};

export const removeMetodo = async (id_metodo) => {
  try {
    const response = await axios.delete(`${API_URL}/metodos/${id_metodo}`);
    return response.data;
  } catch (err) {
    console.error('Erro ao remover método:', err);
    throw err;
  }
};
