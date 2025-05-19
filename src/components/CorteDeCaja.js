import React, { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import ArchivosCorte from './ArchivosCorte';

const CorteDeCaja = () => {
  const [reporte, setReporte] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [totalGeneral, setTotalGeneral] = useState(0);
  const [reporteValido, setReporteValido] = useState(false);
  const [pdfExportado, setPdfExportado] = useState(false);
  const [excelExportado, setExcelExportado] = useState(false);

  const validarReporte = (data) => {
    if (!Array.isArray(data) || data.length === 0) return false;
    return data.every(item =>
      item.claveEmpleado && item.nombreCliente && typeof item.totalGastado === 'number'
    );
  };

  const generarReporte = () => {
    fetch('https://comedor-app-backend.onrender.com/api/corte-de-caja/reporte-agrupado')
      .then(res => res.json())
      .then(data => {
        const esValido = validarReporte(data);
        setReporte(data);
        setReporteValido(esValido);
        setPdfExportado(false);
        setExcelExportado(false);
        const total = data.reduce((sum, item) => sum + item.totalGastado, 0);
        setTotalGeneral(total);
        setMensaje(esValido ? 'Reporte generado correctamente.' : 'El reporte contiene datos incompletos.');
      })
      .catch(err => {
        console.error(err);
        setMensaje('Error al generar el reporte.');
      });
  };

  const guardarCorte = () => {
    if (!pdfExportado || !excelExportado) {
      setMensaje('Debes exportar el PDF y el Excel antes de guardar el corte.');
      return;
    }

    fetch('https://comedor-app-backend.onrender.com/api/corte-de-caja/guardar', { method: 'POST' })
      .then(res => res.text())
      .then(msg => {
        setMensaje(msg);
        setReporte([]);
        setTotalGeneral(0);
        setReporteValido(false);
        setPdfExportado(false);
        setExcelExportado(false);
      })
      .catch(err => {
        console.error(err);
        setMensaje('Error al guardar el corte.');
      });
  };

  const exportarPDF = () => {
    if (!reporteValido) return;

    const doc = new jsPDF();
    const now = new Date();
    const fechaTexto = now.toLocaleString();
    const nombreArchivo = `corte_de_caja_${now.toISOString().slice(0, 19).replace(/[:T]/g, '-')}.pdf`;

    doc.setFontSize(14);
    doc.text('Corte de Caja', 14, 15);
    doc.setFontSize(10);
    doc.text(`Fecha de generación: ${fechaTexto}`, 14, 22);

    autoTable(doc, {
      startY: 28,
      head: [['Clave Empleado', 'Nombre Cliente', 'Total Gastado', 'Productos']],
      body: reporte.map(r => [
        r.claveEmpleado,
        r.nombreCliente,
        `$${r.totalGastado.toFixed(2)}`,
        r.productosConsumidos.join(', ')
      ])
    });

    doc.setFontSize(12);
    doc.text(`Total General: $${totalGeneral.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 10);

    doc.save(nombreArchivo);
    setPdfExportado(true);
  };

  const exportarExcel = () => {
    if (!reporteValido) return;

    const now = new Date();
    const fechaTexto = now.toLocaleString();
    const nombreArchivo = `corte_de_caja_${now.toISOString().slice(0, 19).replace(/[:T]/g, '-')}.xlsx`;

    const wsData = [
      [`Corte de Caja generado el ${fechaTexto}`],
      [],
      ['Clave Empleado', 'Nombre Cliente', 'Total Gastado', 'Productos']
    ];

    reporte.forEach(r => {
      wsData.push([
        r.claveEmpleado,
        r.nombreCliente,
        r.totalGastado,
        r.productosConsumidos.join(', ')
      ]);
    });

    wsData.push([]);
    wsData.push(['', '', 'Total General:', totalGeneral]);

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, 'Corte');
    XLSX.writeFile(wb, nombreArchivo);
    setExcelExportado(true);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Corte de Caja</h1>

      {mensaje && (
        <div className={`mb-4 ${reporteValido ? 'text-green-600' : 'text-red-600'}`}>
          {mensaje}
        </div>
      )}

      <div className="flex flex-wrap gap-4 mb-6">
        <button onClick={generarReporte} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Generar Reporte
        </button>
        <button
          onClick={guardarCorte}
          disabled={!pdfExportado || !excelExportado}
          className={`px-4 py-2 rounded text-white ${
            pdfExportado && excelExportado ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Guardar Corte
        </button>
        <button
          onClick={exportarPDF}
          disabled={!reporteValido}
          className={`px-4 py-2 rounded text-white ${
            reporteValido ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Exportar PDF
        </button>
        <button
          onClick={exportarExcel}
          disabled={!reporteValido}
          className={`px-4 py-2 rounded text-white ${
            reporteValido ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Exportar Excel
        </button>
      </div>

      {reporteValido && reporte.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">Clave</th>
                <th className="border px-4 py-2">Nombre</th>
                <th className="border px-4 py-2">Total</th>
                <th className="border px-4 py-2">Productos</th>
              </tr>
            </thead>
            <tbody>
              {reporte.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{item.claveEmpleado}</td>
                  <td className="border px-4 py-2">{item.nombreCliente}</td>
                  <td className="border px-4 py-2">${item.totalGastado.toFixed(2)}</td>
                  <td className="border px-4 py-2">{item.productosConsumidos.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-right font-bold mt-4">
            Total General: ${totalGeneral.toFixed(2)}
          </div>
        </div>
      )}

      <ArchivosCorte />
    </div>
  );
};

export default CorteDeCaja;
