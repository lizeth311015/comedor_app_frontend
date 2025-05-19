import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import Navbar from "./components/Navbar";
import Login from "./components/Login";
import EscaneoCliente from "./components/EscaneoCliente";
import Menu from "./components/Menu";
import Clientes from "./pages/Clientes";
import Productos from "./pages/Productos";
import CorteDeCaja from "./components/CorteDeCaja";
import CortesGuardados from "./components/CortesGuardados";
import HistorialGeneral from "./components/HistorialGeneral";
import Usuarios from "./pages/Usuarios";
import NotAuthorized from "./components/NotAuthorized";
import Footer from "./components/Footer";
import PrivateRoute from "./utils/PrivateRoute";
import UsuariosAdmin from './views/UsuariosAdmin';
import ArchivosCorte from './components/ArchivosCorte'; 

function App() {
  const [usuario, setUsuario] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("usuario");
    if (userData) {
      setUsuario(JSON.parse(userData));
    }
  }, []);

  const handleLogin = (userData) => {
    localStorage.setItem("usuario", JSON.stringify(userData));
    setUsuario(userData);
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        "https://comedor-app-backend.onrender.com/api/auth/logout",
        {},
        { withCredentials: true }
      );
      localStorage.removeItem("usuario");
      setUsuario(null);
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const ocultarNavbar = location.pathname === "/login";

  if (!usuario && location.pathname !== "/login") {
    return null;
  }

  return (
    <>
      {!ocultarNavbar && <Navbar usuario={usuario} onLogout={handleLogout} />}

      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/not-authorized" element={<NotAuthorized />} />

        <Route
          path="/menu"
          element={
            <PrivateRoute allowedRoles={["ADMIN", "USER"]}>
              <Menu />
            </PrivateRoute>
          }
        />
        <Route
          path="/escaneo"
          element={
            <PrivateRoute allowedRoles={["ADMIN", "USER"]}>
              <EscaneoCliente />
            </PrivateRoute>
          }
        />
        <Route
          path="/clientes"
          element={
            <PrivateRoute allowedRoles={["ADMIN"]}>
              <Clientes />
            </PrivateRoute>
          }
        />
        <Route
          path="/productos"
          element={
            <PrivateRoute allowedRoles={["ADMIN"]}>
              <Productos />
            </PrivateRoute>
          }
        />
        <Route
          path="/corte-de-caja"
          element={
            <PrivateRoute allowedRoles={["ADMIN"]}>
              <CorteDeCaja />
            </PrivateRoute>
          }
        />
        <Route
          path="/cortes-guardados"
          element={
            <PrivateRoute allowedRoles={["ADMIN"]}>
              <CortesGuardados />
            </PrivateRoute>
          }
        />
        <Route
          path="/historial"
          element={
            <PrivateRoute allowedRoles={["ADMIN"]}>
              <HistorialGeneral />
            </PrivateRoute>
          }
        />
        <Route
          path="/archivos-corte"
          element={
            <PrivateRoute allowedRoles={["ADMIN"]}>
              <ArchivosCorte />
            </PrivateRoute>
          }
        />
        <Route
          path="/usuarios"
          element={
            <PrivateRoute allowedRoles={["ADMIN"]}>
              <Usuarios />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/usuarios"
          element={
            <PrivateRoute allowedRoles={["ADMIN"]}>
              <UsuariosAdmin />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
