import { useState } from "react";
import { useNavigate } from "react-router-dom";

function EscaneoCliente() {
  const [clave, setClave] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!clave) {
      setError("Por favor ingresa una clave.");
      return;
 
    }

    try {
      const response = await fetch(`http://localhost:8080/api/clientes/buscar/${clave}`);
      if (response.ok) {
        const cliente = await response.json();
        navigate("/menu", { state: { cliente } });
      } else {
        setError("Cliente no encontrado.");
      }
    } catch (e) {
      setError("Error al verificar la clave.");
      console.error("Error al verificar la clave:", e);
    }
  };

  return (
    
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 space-y-12">
      {/* Formulario escalado al 120% */}
      <div
        className="bg-white p-8 rounded-lg shadow-lg"
        style={{ transform: "scale(1.2)", transformOrigin: "top center" }}
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">Escanea tu clave</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={clave}
            onChange={e => setClave(e.target.value)}
            placeholder="Ingresa la clave del cliente"
            className="w-full px-4 py-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
          >
            Verificar
          </button>
        </form>
      </div>

      {/* Logo debajo del formulario */}
      <div className="mt-8">
        <img
         src="\images\Del_Monte_Foods-Logo.wine.png" // Asegúrate de que esté en public/images/
        alt="Logo de la empresa"
          className="w-40 h-auto mx-auto"
        />
      </div>
    </div>
  );
}

export default EscaneoCliente;
