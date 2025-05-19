import axios from 'axios';

// Base URL de la API, toma de .env o fallback a localhost
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

/**
 * Obtiene el usuario actualmente autenticado.
 * @returns {Promise<Object|null>} Datos del usuario o null en caso de error.
 */
export const obtenerUsuarioActual = async () => {
  try {
    const response = await axios.get(
      `https://comedor-app-backend.onrender.com/auth/usuario-actual`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error('Error al obtener usuario actual:', error);
    return null;
  }
};
