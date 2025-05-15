import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = ({ usuario, onLogout }) => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const location = useLocation();
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const toggleMenu = () => setMenuAbierto(prev => !prev);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setMenuAbierto(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const colores = ["#006747", "#ffcb05", "#ffffff"];

  const navLinks = [
    { to: "/menu", label: "Menú", icon: "/images/menu1.png" },
    { to: "/escaneo", label: "Escaneo", icon: "/images/escaneo1.png" },
    { to: "/clientes", label: "Clientes", icon: "/images/clientes.webp", roles: ["ADMIN"] },
    { to: "/productos", label: "Productos", icon: "/images/productos.png", roles: ["ADMIN"] },
    { to: "/corte-de-caja", label: "Corte", icon: "/images/corteDeCaja.png", roles: ["ADMIN"] },
    { to: "/cortes-guardados", label: "Cortes Generados", icon: "/images/corteDeCaja2.png", roles: ["ADMIN"] },
    { to: "/historial", label: "Historial de pedidos", icon: "/images/Pedidos.png", roles: ["ADMIN"] },
    { to: "/usuarios", label: "Usuarios", icon: "/images/clientesv3.png", roles: ["ADMIN"] },
    { to: "/archivos-corte", label: "Archivos de Cortes", icon: "/images/documetosArchivo.png", roles: ["ADMIN"] },
  ].map(link => ({
    ...link,
    bgColor: colores[Math.floor(Math.random() * colores.length)],
  }));

  if (!usuario) return null;

  return (
    <div className="relative z-10">
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        className="p-2 focus:outline-none"
        aria-label="Abrir menú"
      >
        <img
          src="/images/barraBurger.png"
          alt="Menú"
          className="w-8 h-8 hover:scale-105 transition"
        />
      </button>

      {menuAbierto && (
        <div
          ref={menuRef}
          className="absolute top-12 left-0 bg-white shadow-lg rounded-md w-52 py-2 z-20"
        >
          <div className="px-4 pb-2 border-b border-gray-200 mb-2 flex items-center space-x-3">
            <img
              src={usuario.avatar || "/images/usuarioLogin.png"}
              alt="Avatar del usuario"
              className="w-10 h-10 rounded-full object-cover border border-gray-300"
            />
            <div>
              <p className="text-sm font-semibold text-gray-700">{usuario.nombre}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wide">{usuario.rol}</p>
            </div>
          </div>

          {navLinks
            .filter(link => !link.roles || link.roles.includes(usuario.rol))
            .map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuAbierto(false)}
                className={`flex items-center px-4 py-2 space-x-3 rounded-md transition transform hover:translate-x-1 hover:shadow-lg ${
                  location.pathname === link.to ? "ring-2 ring-offset-1 ring-gray-400" : ""
                }`}
                style={{
                  backgroundColor: link.bgColor,
                  color: link.bgColor === "#ffffff" ? "#000000" : "#ffffff",
                }}
              >
                <img src={link.icon} alt={link.label} className="w-5 h-5" />
                <span>{link.label}</span>
              </Link>
            ))}

          <button
            onClick={onLogout}
            className="mt-2 w-full text-left px-4 py-2 font-semibold rounded-md bg-[#e60012] text-white transition transform hover:translate-x-1 hover:shadow-lg"
          >
            <img
              src="/images/cerrarSesion.png"
              alt="Cerrar sesión"
              className="inline-block w-5 h-5 mr-2"
            />
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
