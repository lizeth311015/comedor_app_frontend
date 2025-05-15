// utils/auth.js
export function getRolUsuario() {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    return usuario?.rol || null;
  }
  