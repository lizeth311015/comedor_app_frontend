import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login({ onLogin }) {
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // URL base del backend
  const backendUrl = "https://comedor-app-backend.onrender.com";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        `${backendUrl}/api/auth/login`,
        { nombre, password },
        { withCredentials: true } // cookies para sesión
      );

      const userData = response.data;

      if (!userData || !userData.rol) {
        throw new Error("Datos del usuario no válidos");
      }

      localStorage.setItem("usuario", JSON.stringify(userData));
      onLogin(userData);
      navigate("/escaneo");
    } catch (err) {
      setError("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-green-100">
      <div className="bg-white p-8 rounded shadow-md w-96 flex flex-col items-center">
        <img
          src="/images/inicioDeSecion.png"
          alt="Inicio de sesión"
          className="w-16 h-16 mb-6"
        />

        <form onSubmit={handleSubmit} className="w-full">
          <h2 className="text-2xl font-bold mb-6 text-center">Iniciar sesión</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}

          <div className="mb-4">
            <label className="block mb-1">Nombre de usuario</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
          >
            Ingresar
          </button>
        </form>

        <img
          src="/images/LogoArchiDelMonte.png"
          alt="Bienvenido"
          className="w-32 h-32 mt-6"
        />
      </div>
    </div>
  );
}

export default Login;
