import React, { useState, useEffect } from 'react';
import { obtenerUsuarioActual } from '../services/authService';  // Cambié esto

const UsuarioActual = () => {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const usuarioData = await obtenerUsuarioActual();
        setUsuario(usuarioData);
      } catch (error) {
        console.error('Error obteniendo el usuario', error);
      }
    };
    fetchUsuario();
  }, []);

  return (
    <div>
      <h1>Usuario Actual</h1>
      {usuario ? (
        <div>
          <p>Nombre: {usuario.nombre}</p>
          <p>Rol: {usuario.rol}</p>
        </div>
      ) : (
        <p>Cargando usuario...</p>
      )}
    </div>
  );
};

export default UsuarioActual;
