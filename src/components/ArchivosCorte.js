import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ArchivosCorte = () => {
  const [archivos, setArchivos] = useState([]);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const fetchArchivos = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/corte-de-caja/archivos');
        if (Array.isArray(response.data)) {
          setArchivos(response.data);
        } else {
          setArchivos([]);
          setMensaje('No se encontraron archivos.');
        }
      } catch (error) {
        console.error('Error al obtener los archivos:', error);
        setArchivos([]);
        setMensaje('Error al conectar con el servidor.');
      }
    };

    fetchArchivos();
  }, []);

  const verArchivo = (id) => {
    window.open(`http://localhost:8080/api/corte-de-caja/archivo/${id}`, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Archivos Guardados</h2>

      {mensaje && <p className="text-red-600 mb-4">{mensaje}</p>}

      {archivos.length > 0 ? (
        <ul className="space-y-3">
          {archivos.map((archivo) => (
            <li key={archivo.id} className="bg-white p-4 rounded shadow flex items-center justify-between">
              <div>
                <p className="font-semibold">{archivo.nombre}</p>
                <p className="text-sm text-gray-600">Fecha: {archivo.fecha}</p>
              </div>
              <button
                onClick={() => verArchivo(archivo.id)}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                Ver PDF
              </button>
            </li>
          ))}
        </ul>
      ) : (
        !mensaje && <p className="text-gray-600">Cargando archivos...</p>
      )}
    </div>
  );
};

export default ArchivosCorte;
