import axios from 'axios';

const API_URL = '/api/auth';



export const obtenerUsuarioActual = async () => {
  try {
    const response = await axios.get(`${API_URL}/usuario-actual`, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Error al obtener usuario actual:', error);
    return null;
  }
};
