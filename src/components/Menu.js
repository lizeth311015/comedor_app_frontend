import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Menu() {
  const location = useLocation();
  const navigate = useNavigate();
  const cliente = location.state?.cliente;
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState(null);

  const colores = ["#007F3D", "#C8102E", "#FFD700", "#FFFFFF"];

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/productos");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProductos(data);
        setError(null);
      } catch (e) {
        setError("Error al cargar los productos.");
        console.error("Error fetching productos:", e);
      }
    };
    fetchProductos();
  }, []);

  const handleCompra = async (productoId) => {
    if (!cliente) {
      alert("Cliente no autenticado.");
      return;
    }

    const producto = productos.find((p) => p.id === productoId);
    if (!producto) {
      alert("Producto no encontrado");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/pedidos/registrar", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          claveEmpleado: cliente.claveEmpleado,
          productoId: producto.id,
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Error al registrar el pedido: ${response.status} - ${errorMessage}`);
      }
      const data = await response.json();

const playBeep = () => {
  const audio = new Audio("/sounds/notificacion.wav");
  audio.play();
};

// Crear el contenido del ticket
const ticketContent = `
  <div style="text-align:center; font-family: Arial, sans-serif;">
    <img src="/images/logoComidadAppBN.PNG" alt="Logo" style="width: 100px; margin-bottom: 10px;" />
    <h2 style="margin:0;">TICKET DE COMPRA</h2>
    <hr style="margin: 10px 0;" />
    <p><strong>Cliente:</strong> ${cliente.nombre}</p>
    <p><strong>Producto:</strong> ${producto.nombre}</p>
    <p><strong>Precio:</strong> $${producto.precio.toFixed(2)}</p>
    <p><strong>Saldo acumulado:</strong> $${data.nuevoSaldo.toFixed(2)}</p>
    <p><strong>ID del Pedido:</strong> ${data.pedidoId}</p>
    <p><strong>Hora:</strong> ${new Date(data.fecha).toLocaleString()}</p>
    <hr style="margin: 10px 0;" />
    <h3 style="margin-top: 20px;">¡Gracias por tu compra!</h3>
    <p style="font-style: italic;">¡Buen provecho! 😋</p>
  </div>
`;

const printWindow = window.open("", "PRINT", "height=600,width=400");
if (printWindow) {
  printWindow.document.write(`<html><head><title>Ticket</title></head><body>${ticketContent}</body></html>`);
  printWindow.document.close();
  printWindow.focus();

  // 🔊 Reproduce el sonido ANTES de imprimir
  playBeep();

  // 🖨️ Imprime solo el ticket
  printWindow.print();

  // ⏱️ Cierra la ventana de impresión después de 2 segundos
  setTimeout(() => {
    printWindow.close();
  }, 2000); // 2000 milisegundos (2 segundos)
}


      // Limpiar y navegar
      localStorage.removeItem("clienteActual");
      navigate("/escaneo");
    } catch (e) {
      setError(`Error al registrar el pedido: ${e.message}`);
      console.error("Error al registrar el pedido:", e);
      alert(`Error al registrar el pedido: ${e.message}`);
    }
  };

  return (
    <div className="text-center px-4 py-6 min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold mb-6">
        Elige tu producto {cliente?.nombre} ({cliente?.claveEmpleado})
      </h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mx-auto max-w-4xl">
        {productos.map((producto, index) => (
          <button
            key={producto.id}
            onClick={() => handleCompra(producto.id)}
            className="rounded-xl p-4 w-full text-black shadow-lg hover:shadow-2xl hover:-translate-y-2 hover:scale-105 transition duration-300 ease-in-out"
            style={{ backgroundColor: colores[index % colores.length] }}
          >
            <img
              src={producto.imagen}
              alt={producto.nombre}
              className="w-full h-28 object-cover rounded-md mb-3"
            />
            <div className="text-lg font-semibold">{producto.nombre}</div>
            <div className="text-xl font-bold mt-1">${producto.precio.toFixed(2)}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default Menu;
