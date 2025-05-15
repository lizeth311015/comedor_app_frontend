import React, { useState } from 'react';
import axios from 'axios';

function FormularioProducto({ onProductoRegistrado }) {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [imagen, setImagen] = useState(null);

  const manejarEnvio = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('precio', precio);
    if (imagen) {
      formData.append('imagen', imagen);
    }

    try {
      await axios.post(`http://localhost:8080/api/productos`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      onProductoRegistrado();
    } catch (error) {
      console.error("Error al registrar el producto:", error);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 min-h-screen mb-24">
      <h2 className="text-2xl font-bold mb-6 text-center">Registrar Producto</h2>
      <form onSubmit={manejarEnvio} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre del Producto</label>
          <input
            type="text"
            placeholder="Nombre del producto"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Precio</label>
          <input
            type="number"
            placeholder="Precio"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Imagen del Producto</label>
          <input
            type="file"
            onChange={(e) => setImagen(e.target.files[0])}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Registrar Producto
          </button>
        </div>
      </form>
    </div>
  );
}

export default FormularioProducto;
