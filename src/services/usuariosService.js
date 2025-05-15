import axios from 'axios';

// Función para listar usuarios
export const listarUsuarios = () => {
  return axios.get('/api/auth/usuarios', { withCredentials: true });
};

// Función para crear un nuevo usuario
// services/usuarioService.js

export const crearUsuario = async (usuario) => {
  const response = await fetch("http://localhost:8080/api/auth/crear-usuario", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // para que se envíe la cookie de sesión
    body: JSON.stringify(usuario),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }

  return response.text(); // "Usuario creado"
};


// Puedes agregar otras funciones como eliminar, editar, etc.
const eliminarUsuario = async (id) => {
  if (!window.confirm("¿Estás seguro de eliminar este usuario?")) return;

  try {
    const response = await fetch(`http://localhost:8080/api/auth/usuarios/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (response.ok) {
      alert("Usuario eliminado con éxito");
      obtenerUsuarios(); // Recargar la lista
    } else {
      const errorText = await response.text();
      alert("Error al eliminar: " + errorText);
    }
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
  }
};

