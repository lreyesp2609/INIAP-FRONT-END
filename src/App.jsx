import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import LoginForm from "./components/Login/login";
import MenuEmpleados from "./components/Modulo Empleado/menuempleado";
import MenuAdministrador from "./components/Modulo Administrador/menuadministrador";
import MenuSuperUsuario from "./components/SuperUsuario/menusuperusuario";
import PrivateRoute from "./components/Login/rutaprivada";
import Navbar from "./components/Login/navbar";
import GestionEmpleados from "./components/SuperUsuario/Empleados/gestionempleados";
import GestionVehiculos from "./components/SuperUsuario/Vehiculos/gestionvehiculos";
import GestionCategorias from "./components/SuperUsuario/CategoriasBienes/gestioncategoriasbienes";
import GestionEstaciones from "./components/SuperUsuario/Estaciones/gestionestaciones";
import SolicitarMovilizacion from "./components/Modulo Empleado/Ordenes de Movilizacion/SolicitarMovilizacion";
import ListarMovilizacion from "./components/Modulo Empleado/Ordenes de Movilizacion/ListarMovilizacion";
import GestionProvincias from "./components/SuperUsuario/Provincias/gestionprovincias";
import GestionCargos from "./components/SuperUsuario/Cargos/gestioncargos";
import GestionUnidadesPorEstacion from "./components/SuperUsuario/Unidades/gestionunidades";
import GestionBancos from "./components/SuperUsuario/Bancos/gestionbancos";
import ListarJustificacione from "./components/Modulo Empleado/Jutificacion de Gastos/ListarJustificaciones";
import GestionEmpleadosJefes from "./components/SuperUsuario/Jefes/gestionempleadosjefes";
const AppContent = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useLayoutEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser).usuario);
    } else {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      setUser(null);
    }
  }, [navigate]);

  const handleLogin = (userData) => {
    setUser(userData.usuario);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {user ? <Navbar user={user} onLogout={handleLogout} /> : null}
      <Routes>
        <Route path="/" element={<LoginForm onLogin={handleLogin} />} />
        <Route
          path="/menu-empleados"
          element={
            <PrivateRoute requiredRole="Empleado">
              <MenuEmpleados />
            </PrivateRoute>
          }
        />
        <Route path="/gestion-gastos" element={<ListarJustificacione />} />

        <Route
          path="/menu-administrador"
          element={
            <PrivateRoute requiredRole="Administrador">
              <MenuAdministrador />
            </PrivateRoute>
          }
        />
        <Route
          path="/menu-superusuario"
          element={
            <PrivateRoute requiredRole="SuperUsuario">
              <MenuSuperUsuario />
            </PrivateRoute>
          }
        />
        <Route path="/gestion-empleados" element={<GestionEmpleados />} />
        <Route path="/gestion-vehiculos" element={<GestionVehiculos />} />
        <Route
          path="/gestion-categorias-bienes"
          element={<GestionCategorias />}
        />
        <Route path="/gestion-estaciones" element={<GestionEstaciones />} />
        <Route
          path="/gestion-unidades"
          element={<GestionUnidadesPorEstacion />}
        />
        <Route path="/gestion-cargos" element={<GestionCargos />} />
        <Route path="/gestion-estaciones" element={<GestionEstaciones />} />
        <Route
          path="/solicitar-movilizacion"
          element={<SolicitarMovilizacion />}
        />
        <Route path="/listar-movilizacion" element={<ListarMovilizacion />} />
        <Route path="/gestion-provincias" element={<GestionProvincias />} />
        <Route path="/gestion-bancos" element={<GestionBancos />} />
        <Route path="/gestion-jefes" element={<GestionEmpleadosJefes />} />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
