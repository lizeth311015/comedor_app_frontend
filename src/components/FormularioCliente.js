import React from 'react';

function FormularioCliente({ nombre, setNombre, claveEmpleado, setClaveEmpleado, saldo, setSaldo, onSubmit, mensaje, isEditando }) {
  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">{isEditando ? 'Editar Cliente' : 'Registrar Cliente'}</h2>
      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-1">Nombre completo:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-1">Clave de empleado:</label>
          <input
            type="text"
            value={claveEmpleado}
            onChange={(e) => setClaveEmpleado(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-1">Saldo inicial (opcional):</label>
          <input
            type="number"
            value={saldo}
            onChange={(e) => setSaldo(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* Mostrar saldo actual si existe */}
        {saldo !== '' && !isNaN(saldo) && (
          <div className="mb-4">
            <label className="block text-sm font-bold mb-1 text-blue-600">Saldo actual:</label>
            <div className="w-full border border-gray-200 rounded px-3 py-2 bg-gray-100">
              ${parseFloat(saldo).toFixed(2)}
            </div>
          </div>
        )}

        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          {isEditando ? 'Actualizar' : 'Registrar'} Cliente
        </button>
        {mensaje && <p className="mt-4 text-center">{mensaje}</p>}
      </form>
    </div>
  );
}

export default FormularioCliente;
