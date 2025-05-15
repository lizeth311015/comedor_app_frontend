import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UsuariosAdmin = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [nuevoUsuario, setNuevoUsuario] = useState({ nombre: '', password: '', rol: 'USER' });

  // Cargar usuarios al montar
  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/auth/usuarios', { withCredentials: true });
      setUsuarios(res.data);
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
    }
  };

  const crearUsuario = async () => {
    try {
      await axios.post('http://localhost:8080/api/auth/crear-usuario', nuevoUsuario, { withCredentials: true });
      setNuevoUsuario({ nombre: '', password: '', rol: 'USER' });
      cargarUsuarios();
    } catch (err) {
      console.error('Error al crear usuario:', err);
      alert(err.response?.data || 'Error al crear usuario');
    }
  };

  const eliminarUsuario = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return;

    try {
      await axios.delete(`http://localhost:8080/api/auth/usuarios/${id}`, { withCredentials: true });
      cargarUsuarios();
    } catch (err) {
      console.error('Error al eliminar usuario:', err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Gestión de Usuarios</h2>

      <div className="mb-6">
        <h3 className="font-semibold mb-2">Crear nuevo usuario</h3>
        <input
          type="text"
          placeholder="Nombre"
          value={nuevoUsuario.nombre}
          onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={nuevoUsuario.password}
          onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, password: e.target.value })}
          className="border p-2 mr-2"
        />
        <select
          value={nuevoUsuario.rol}
          onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, rol: e.target.value })}
          className="border p-2 mr-2"
        >
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
        <button onClick={crearUsuario} className="bg-blue-500 text-white px-4 py-2 rounded">
          Crear
        </button>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Usuarios existentes</h3>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Nombre</th>
              <th className="p-2 border">Rol</th>
              <th className="p-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td className="p-2 border">{usuario.id}</td>
                <td className="p-2 border">{usuario.nombre}</td>
                <td className="p-2 border">{usuario.rol}</td>
                <td className="p-2 border">
                  <button
                    onClick={() => eliminarUsuario(usuario.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {usuarios.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center p-4">
                  No hay usuarios.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsuariosAdmin;
