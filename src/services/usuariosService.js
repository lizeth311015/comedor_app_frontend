import axios from 'axios';

// Base URL de la API, desde .env o fallback a localhost
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

/**
 * Lista todos los usuarios (requiere sesión).
 * @returns {Promise<AxiosResponse>} Respuesta Axios con arreglo de usuarios.
 */
export const listarUsuarios = () => {
  return axios.get(`${API_BASE_URL}/auth/usuarios`, { withCredentials: true });
};

/**
 * Crea un nuevo usuario.
 * @param {{ nombre: string, password: string, rol: string }} usuario
 * @returns {Promise<string>} Mensaje de confirmación.
 */
export const crearUsuario = async (usuario) => {
  const response = await fetch(
    `${API_BASE_URL}/auth/crear-usuario`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(usuario),
    }
  );
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }
  return response.text();
};

/**
 * Elimina un usuario por ID (requiere confirmación y sesión).
 * @param {string|number} id
 * @returns {Promise<void>}
 */
export const eliminarUsuario = async (id) => {
  if (!window.confirm("¿Estás seguro de eliminar este usuario?")) return;
  const response = await fetch(
    `https://comedor-app-backend.onrender.com/auth/usuarios/${id}`,
    { method: "DELETE", credentials: "include" }
  );
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }
};
