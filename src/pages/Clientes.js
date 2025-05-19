import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FormularioCliente from '../components/FormularioCliente';

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [nombre, setNombre] = useState('');
  const [claveEmpleado, setClaveEmpleado] = useState('');
  const [saldo, setSaldo] = useState('');
  const [isEditando, setIsEditando] = useState(false);
  const [clienteId, setClienteId] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [search, setSearch] = useState('');

  // Cargar clientes al iniciar
  useEffect(() => {
    fetchClientes();
  }, []);

  // Función para cargar los clientes
  const fetchClientes = async () => {
    const response = await axios.get('https://comedor-app-backend.onrender.com/api/clientes');
    setClientes(response.data);
  };

  // Función para eliminar cliente
  const eliminarCliente = async (id) => {
    await axios.delete(`https://comedor-app-backend.onrender.com/api/clientes/${id}`);
    fetchClientes(); // Actualizar la lista después de eliminar
  };

  // Función para mostrar detalles del cliente
  const mostrarCliente = (cliente) => {
    alert(`Nombre: ${cliente.nombre}\nClave: ${cliente.claveEmpleado}\nSaldo: $${cliente.saldo}`);
  };

  // Función de edición
  const editarCliente = (cliente) => {
    setNombre(cliente.nombre);
    setClaveEmpleado(cliente.claveEmpleado);
    setSaldo(cliente.saldo);
    setClienteId(cliente.id);
    setIsEditando(true);  // Activar el modo de edición
  };

  // Función para manejar la búsqueda
  const buscarClientes = (event) => {
    setSearch(event.target.value);
  };

  // Filtrar clientes por nombre o claveEmpleado
  const clientesFiltrados = clientes.filter(cliente => 
    cliente.nombre.toLowerCase().includes(search.toLowerCase()) ||
    cliente.claveEmpleado.toLowerCase().includes(search.toLowerCase())
  );

  // Función para manejar el envío del formulario (registrar o actualizar cliente)
  const manejarEnvio = async (e) => {
    e.preventDefault();

    if (!nombre || !claveEmpleado) {
      setMensaje('Todos los campos son obligatorios');
      return;
    }

    try {
      if (isEditando) {
        // Actualizar cliente existente
        await axios.put(`https://comedor-app-backend.onrender.com/api/clientes/${clienteId}`, {
          nombre,
          claveEmpleado,
          saldo: parseFloat(saldo) || 0
        });
        setMensaje('Cliente actualizado correctamente');
      } else {
        // Registrar cliente nuevo
        await axios.post('https://comedor-app-backend.onrender.com/api/clientes', {
          nombre,
          claveEmpleado,
          saldo: parseFloat(saldo) || 0
        });
        setMensaje('Cliente registrado correctamente');
      }
      fetchClientes(); // Actualizar la lista
      setIsEditando(false); // Desactivar el modo de edición
      setNombre('');
      setClaveEmpleado('');
      setSaldo('');
    } catch (error) {
      console.error(error);
      setMensaje('Error al procesar el cliente');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">{isEditando ? 'Editar Cliente' : 'Registrar Cliente'}</h2>

      {/* Formulario de Cliente */}
      <FormularioCliente 
        nombre={nombre} 
        setNombre={setNombre} 
        claveEmpleado={claveEmpleado} 
        setClaveEmpleado={setClaveEmpleado} 
        saldo={saldo} 
        setSaldo={setSaldo} 
        onSubmit={manejarEnvio} 
        mensaje={mensaje}
      />

      {/* Campo de búsqueda */}
      <div className="mt-6 mb-4">
        <input 
          type="text" 
          placeholder="Buscar cliente por nombre o clave"
          value={search}
          onChange={buscarClientes}
          className="border border-gray-300 p-2 rounded w-full"
        />
      </div>

      {/* Lista de Clientes */}
      <h2 className="text-2xl font-bold mt-10 mb-4">Lista de Clientes</h2>
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            <th className="py-2 px-4">ID</th>
            <th className="py-2 px-4">Nombre</th>
            <th className="py-2 px-4">Clave Empleado</th>
            <th className="py-2 px-4">Saldo</th>
            <th className="py-2 px-4">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientesFiltrados.map(cliente => (
            <tr key={cliente.id} className="border-b">
              <td className="py-2 px-4">{cliente.id}</td>
              <td className="py-2 px-4">{cliente.nombre}</td>
              <td className="py-2 px-4">{cliente.claveEmpleado}</td>
              <td className="py-2 px-4">${cliente.saldo}</td>
              <td className="py-2 px-4 space-x-2">
                <button
                  onClick={() => mostrarCliente(cliente)}
                  className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                >
                  Mostrar
                </button>
                <button
                  onClick={() => editarCliente(cliente)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                >
                  Editar
                </button>
                <button
                  onClick={() => eliminarCliente(cliente.id)}
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

export default Clientes;
