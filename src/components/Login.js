import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login({ onLogin }) {
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reseteamos el error antes de intentar el login

    try {
      // Realizamos la solicitud al backend para autenticar al usuario
      const response = await axios.post("/api/auth/login", {
        nombre,
        password,
      }, {
        withCredentials: true // Asegura que las cookies de sesión viajen si el backend las usa
      });

      const userData = response.data;

      // Verificar si la respuesta contiene los datos esperados (nombre, rol)
      if (!userData || !userData.rol) {
        throw new Error("Datos del usuario no válidos");
      }

      // Guardamos los datos del usuario en el localStorage
      localStorage.setItem("usuario", JSON.stringify(userData));
      onLogin(userData); // Llamamos a la función onLogin para actualizar el estado en App.js
      navigate("/escaneo"); // Redirigimos al usuario a la página de menú
    } catch (err) {
      setError("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-green-100">
      <div className="bg-white p-8 rounded shadow-md w-96 flex flex-col items-center">
        {/* Imagen alusiva al inicio de sesión */}
        <img
          src="/images/inicioDeSecion.png" // Cambia el nombre por el nombre de tu imagen
          alt="Inicio de sesión"
          className="w-16 h-16 mb-6" // Ajusta el tamaño de la imagen según necesites
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

        {/* Imagen debajo del formulario */}
        <img
          src="/images/LogoArchiDelMonte.png" // Cambia el nombre por el nombre de tu imagen
          alt="Bienvenido"
          className="w-32 h-32 mt-6" // Ajusta el tamaño de la imagen según necesites
        />
      </div>
    </div>
  );
}

export default Login;
