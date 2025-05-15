import React, { useEffect, useState } from "react";
import axios from "axios";

const CortesGuardados = () => {
  const [cortes, setCortes] = useState([]);
  const [resumenSeleccionado, setResumenSeleccionado] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8080/api/corte-de-caja/guardados")
      .then((response) => {
        setCortes(response.data); // debe ser un arreglo
      })
      .catch((error) => {
        console.error("Error al obtener cortes guardados", error);
      });
  }, []);

  const verResumen = (idCorte) => {
    axios.get(`http://localhost:8080/api/corte-de-caja/detalle/${idCorte}`)
      .then((response) => {
        setResumenSeleccionado(response.data); // ResumenEmpleadoDTO[]
      })
      .catch((error) => {
        console.error("Error al obtener detalle del corte", error);
      });
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Cortes Generados</h2>
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">ID</th>
            <th className="py-3 px-6 text-left">Fecha</th>
            <th className="py-3 px-6 text-left">Total</th>
            <th className="py-3 px-6 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(cortes) && cortes.map((corte) => (
            <tr key={corte.id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left">{corte.id}</td>
              <td className="py-3 px-6 text-left">{new Date(corte.fecha).toLocaleString()}</td>
              <td className="py-3 px-6 text-left">${corte.total.toFixed(2)}</td>
              <td className="py-3 px-6 text-center">
              <button onClick={() => verResumen(corte.id)} className="bg-blue-500 text-white px-3 py-1 rounded mr-2">Ver resumen</button>
                <a href={`http://localhost:8080/api/corte-de-caja/descargar/pdf/${corte.id}`} className="bg-green-500 text-white px-3 py-1 rounded mr-2">PDF</a>
                <a href={`http://localhost:8080/api/corte-de-caja/descargar/excel/${corte.id}`} className="bg-yellow-500 text-white px-3 py-1 rounded">Excel</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {resumenSeleccionado && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Resumen del Corte</h3>
          <table className="min-w-full bg-white border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border">Clave</th>
                <th className="py-2 px-4 border">Nombre</th>
                <th className="py-2 px-4 border">Total Gastado</th>
                <th className="py-2 px-4 border">Productos Consumidos</th>
              </tr>
            </thead>
            <tbody>
              {resumenSeleccionado.map((empleado, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border">{empleado.claveEmpleado}</td>
                  <td className="py-2 px-4 border">{empleado.nombreCliente}</td>
                  <td className="py-2 px-4 border">${empleado.totalGastado.toFixed(2)}</td>
                  <td className="py-2 px-4 border">{empleado.productosConsumidos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CortesGuardados;
