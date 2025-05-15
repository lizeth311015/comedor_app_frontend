import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, allowedRoles }) => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(usuario.rol)) {
    return <Navigate to="/menu" replace />;
  }
  if (!usuario.rol || (allowedRoles && !allowedRoles.includes(usuario.rol))) {
    return <Navigate to="/menu" replace />;
  }  
  

  return children;
};

export default PrivateRoute;
