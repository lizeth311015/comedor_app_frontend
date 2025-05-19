import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Productos() { 
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [imagen, setImagen] = useState(null);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const response = await axios.get('https://comedor-app-backend.onrender.com/api/productos');
      setProductos(response.data);
    } catch (error) {
      console.error('Error al obtener los productos:', error);
    }
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
  
    if (!nombre || !precio) {
      setMensaje('Todos los campos son obligatorios');
      return;
    }
  
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('precio', precio);
    if (imagen) {
      formData.append('imagen', imagen);
    }
  
    try {
      if (productoSeleccionado) {
        await axios.put(`https://comedor-app-backend.onrender.com/api/productos/${productoSeleccionado.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setMensaje('Producto actualizado correctamente');
      } else {
        await axios.post('https://comedor-app-backend.onrender.com/api/productos', formData);
        setMensaje('Producto registrado correctamente');
      }
  
      fetchProductos();
      setNombre('');
      setPrecio('');
      setImagen(null);
      setProductoSeleccionado(null);
    } catch (error) {
      setMensaje('Error al registrar o actualizar el producto');
      console.error(error);
    }
  };
  
  const editarProducto = (producto) => {
    setProductoSeleccionado(producto);
    setNombre(producto.nombre);
    setPrecio(producto.precio);
    setImagen(producto.imagen);
  };

  const eliminarProducto = async (id) => {
    try {
      await axios.delete(`https://comedor-app-backend.onrender.com/api/productos/${id}`);
      fetchProductos();
    } catch (error) {
      setMensaje('Error al eliminar el producto');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">{productoSeleccionado ? 'Editar Producto' : 'Registrar Producto'}</h2>
      <form onSubmit={manejarEnvio} encType="multipart/form-data">
        <div className="mb-4">
          <label className="block text-sm font-bold mb-1">Nombre del Producto:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-1">Precio:</label>
          <input
            type="number"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-1">Imagen:</label>
          <input
            type="file"
            onChange={(e) => setImagen(e.target.files[0])}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          {productoSeleccionado ? 'Actualizar Producto' : 'Registrar Producto'}
        </button>
      </form>
      {mensaje && <p className="mt-4 text-center">{mensaje}</p>}

      <h2 className="text-2xl font-bold mt-10 mb-4">Lista de Productos</h2>
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            <th className="py-2 px-4">ID</th>
            <th className="py-2 px-4">Nombre</th>
            <th className="py-2 px-4">Precio</th>
            <th className="py-2 px-4">Imagen</th>
            <th className="py-2 px-4">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.id} className="border-b">
              <td className="py-2 px-4">{producto.id}</td>
              <td className="py-2 px-4">{producto.nombre}</td>
              <td className="py-2 px-4">${producto.precio}</td>
              <td className="py-2 px-4">
                {producto.imagen && (
                  <img
                    src={`https://comedor-app-backend.onrender.com${producto.imagen}`}
                    alt={producto.nombre}
                    className="w-20 h-20 object-cover"
                  />
                )}
              </td>
              <td className="py-2 px-4 space-x-2">
                <button
                  onClick={() => editarProducto(producto)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                >
                  Editar
                </button>
                <button
                  onClick={() => eliminarProducto(producto.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Productos;
