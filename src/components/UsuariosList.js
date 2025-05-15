import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UsuariosList = () => {
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('USER');
  const [mensaje, setMensaje] = useState('');
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioEditando, setUsuarioEditando] = useState(null);

  useEffect(() => {
    axios.get('/api/auth/usuario-actual', { withCredentials: true })
      .then(res => setUsuarioActual(res.data))
      .catch(() => setUsuarioActual(null));
    
    // Obtener la lista de usuarios al cargar el componente
    axios.get('/api/auth/listar-usuarios', { withCredentials: true })
      .then(res => setUsuarios(res.data))
      .catch(err => console.error("Error al obtener la lista de usuarios", err));
  }, []);

  const handleCrear = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/crear-usuario', { nombre, password, rol }, { withCredentials: true });
      setMensaje(`Usuario ${nombre} creado exitosamente.`);
      setUsuarios(prev => [...prev, res.data]);
      setNombre('');
      setPassword('');
    } catch (err) {
      setMensaje(err.response?.data || 'Error al crear usuario');
    }
  };

  const handleEditar = (usuario) => {
    setUsuarioEditando(usuario);
    setNombre(usuario.nombre);
    setPassword('');
    setRol(usuario.rol);
  };

  const handleActualizar = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`/api/auth/actualizar-usuario/${usuarioEditando.id}`, { nombre, password, rol }, { withCredentials: true });
      setMensaje(`Usuario ${nombre} actualizado exitosamente.`);
      setUsuarios(prev => prev.map(u => u.id === res.data.id ? res.data : u));
      setUsuarioEditando(null);
      setNombre('');
      setPassword('');
    } catch (err) {
      setMensaje(err.response?.data || 'Error al actualizar usuario');
    }
  };

  const handleEliminar = async (id) => {
    try {
      await axios.delete(`/api/auth/eliminar-usuario/${id}`, { withCredentials: true });
      setMensaje('Usuario eliminado exitosamente.');
      setUsuarios(prev => prev.filter(usuario => usuario.id !== id));
    } catch (err) {
      setMensaje(err.response?.data || 'Error al eliminar usuario');
    }
  };

  // Verificar si el usuario tiene permisos
  if (!usuarioActual || usuarioActual.rol !== 'ADMIN') {
    return <p className="text-red-600 text-center mt-10">No tienes permisos para gestionar usuarios.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Gestionar usuarios</h2>

      {/* Crear o Editar usuario */}
      <form onSubmit={usuarioEditando ? handleActualizar : handleCrear} className="space-y-4">
        <div>
          <input 
            type="text" 
            placeholder="Nombre de usuario" 
            value={nombre} 
            onChange={e => setNombre(e.target.value)} 
            required 
            className="w-full p-2 border rounded" 
          />
        </div>
        <div>
          <input 
            type="password" 
            placeholder="Contraseña" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
            className="w-full p-2 border rounded" 
          />
        </div>
        <div>
          <select 
            value={rol} 
            onChange={e => setRol(e.target.value)} 
            className="w-full p-2 border rounded"
          >
            <option value="USER">Usuario</option>
            <option value="ADMIN">Administrador</option>
          </select>
        </div>
        <button 
          type="submit" 
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          {usuarioEditando ? 'Actualizar' : 'Crear'} Usuario
        </button>
      </form>

      {/* Mensaje */}
      {mensaje && <p className="mt-4 text-center text-sm text-green-600">{mensaje}</p>}

      {/* Lista de usuarios */}
      <h3 className="text-lg font-semibold mt-10">Lista de usuarios</h3>
      {usuarios.length > 0 ? (
        <ul className="space-y-4 mt-4">
          {usuarios.map((usuario) => (
            <li key={usuario.id} className="flex justify-between items-center">
              <span>{usuario.nombre} ({usuario.rol})</span>
              <div className="flex space-x-4">
                <button 
                  onClick={() => handleEditar(usuario)} 
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Editar
                </button>
                <button 
                  onClick={() => handleEliminar(usuario.id)} 
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-center">No se encontraron usuarios.</p>
      )}
    </div>
  );
};

export default UsuariosList;
