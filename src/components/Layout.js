import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Layout = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  return (
    <div className="flex">
      <Navbar logout={logout} />
      <div className="flex-1 p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
