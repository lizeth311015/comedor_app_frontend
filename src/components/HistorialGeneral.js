import React, { useEffect, useState } from 'react';

const HistorialGeneral = () => {
  const [pedidos, setPedidos] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 20;

  useEffect(() => {
    fetchPedidos();
  }, []);

  const fetchPedidos = () => {
    fetch('/api/pedidos/todos')
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          setPedidos(data);
        } else {
          console.error('La respuesta del backend no es un arreglo:', data);
          setPedidos([]);
        }
      })
      .catch(error => {
        console.error('Error al obtener pedidos:', error);
        setError('No se pudieron cargar los pedidos.');
      });
  };

  const eliminarPedido = (pedidoId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este pedido?')) return;

    fetch(`/api/pedidos/eliminar/${pedidoId}`, {
      method: 'DELETE'
    })
      .then(response => response.json())
      .then(data => {
        setMensaje(data.mensaje || 'Pedido eliminado');
        fetchPedidos();
      })
      .catch(error => {
        console.error('Error al eliminar pedido:', error);
        setError('No se pudo eliminar el pedido.');
      });
  };

  const totalPaginas = Math.ceil(pedidos.length / elementosPorPagina);
  const pedidosPagina = pedidos.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Historial General de Pedidos</h1>

      {mensaje && <div className="mb-2 text-green-600">{mensaje}</div>}
      {error && <div className="mb-2 text-red-600">{error}</div>}

      {pedidos.length === 0 ? (
        <p>No hay pedidos registrados.</p>
      ) : (
        <>
          <table className="w-full table-auto border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">ID</th>
                <th className="border px-4 py-2">Empleado</th>
                <th className="border px-4 py-2">Cliente</th>
                <th className="border px-4 py-2">Producto</th>
                <th className="border px-4 py-2">Total</th>
                <th className="border px-4 py-2">Fecha</th>
                <th className="border px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pedidosPagina.map(pedido => (
                <tr key={pedido.id}>
                  <td className="border px-4 py-2">{pedido.id}</td>
                  <td className="border px-4 py-2">{pedido.claveEmpleado}</td>
                  <td className="border px-4 py-2">{pedido.nombreCliente}</td>
                  <td className="border px-4 py-2">{pedido.producto?.nombre}</td>
                  <td className="border px-4 py-2">${pedido.total.toFixed(2)}</td>
                  <td className="border px-4 py-2">{new Date(pedido.fecha).toLocaleString()}</td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => eliminarPedido(pedido.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Paginación estilo libro */}
          <div className="flex justify-center items-center mt-6 gap-4">
            <button
              onClick={() => cambiarPagina(paginaActual - 1)}
              disabled={paginaActual === 1}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              ⬅ Anterior
            </button>

            <span className="text-lg font-medium">
              Página {paginaActual} de {totalPaginas}
            </span>

            <button
              onClick={() => cambiarPagina(paginaActual + 1)}
              disabled={paginaActual === totalPaginas}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Siguiente ➡
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default HistorialGeneral;
