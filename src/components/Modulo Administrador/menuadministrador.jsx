import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Login/navbar";
import LeftMenu from "./lateralizquierdo";
import GestionEmpleados from "../Modulo Administrador/Empleados/gestionempleados";
import ChangePasswordModal from "../Login/changepasswordmodal";
import ListarMovilizaciones from "./Ordenes de Movilizacion/ListarMovilizaciones";
import Calendario from "./Calendario/calendario";
import Reportes from "./Reportes/Inicio"
import API_URL from "../../Config";
import { notification } from "antd";
import ListarSolicitudesPendientesAdmin from "./Solicitudes/ListarSolicitudesAdmin";
import ListarMovilizacion from "../Modulo Empleado/Ordenes de Movilizacion/ListarMovilizacion";
import ListarSolicitudes from "../Modulo Empleado/Solicitudes/ListaSolicitude";
import InformesPendientes from "../Modulo Empleado/Informes/ListarInformesPendientes";
import ListarJustificacione from "../Modulo Empleado/Jutificacion de Gastos/ListarJustificaciones";

const MenuAdministrador = () => {
  const [user, setUser] = useState({});
  const [view, setView] = useState("home");
  const [isPasswordChangeModalVisible, setIsPasswordChangeModalVisible] = useState(false);
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedToken = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");
    const needsPasswordChange = localStorage.getItem("needs_password_change") === "true";

    if (storedUser) {
      setUser(storedUser.usuario);
      setUserId(storedUserId);
    } else {
      navigate("/");
    }

    if (storedToken) {
      setToken(storedToken);
    } else {
      navigate("/");
    }

    if (needsPasswordChange) {
      setIsPasswordChangeModalVisible(true);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("needs_password_change");
    localStorage.removeItem("userId");
    navigate("/");
  };

  const handleNavigate = (view) => {
    setView(view);
  };

  const handlePasswordChange = async (newPassword) => {
    try {
      const formData = new FormData();
      formData.append("nueva_contrasenia", newPassword);

      const response = await fetch(
        `${API_URL}/Login/cambiar-contrasenia/${userId}/`,
        {
          method: "POST",
          headers: {
            Authorization: `${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();
      if (response.ok) {
        notification.success({
          message: "Contraseña cambiada exitosamente",
        });
        setIsPasswordChangeModalVisible(false);
        localStorage.removeItem("needs_password_change");
      } else {
        notification.error({
          message: "Error al cambiar la contraseña",
          description: data.error,
        });
      }
    } catch (error) {
      console.error("Error al cambiar la contraseña:", error);
      notification.error({
        message: "Error al cambiar la contraseña",
        description: error.message,
      });
    }
  };

  return (
    <div className="min-h-screen flex">
      <Navbar user={user} onLogout={handleLogout} />
      <LeftMenu user={user} onNavigate={handleNavigate} />
      <div className="w-3/4 p-4 ml-auto mt-16">
        {view === "home" && (
          <div className="flex justify-center items-center">
            <h1 className="text-3xl">Bienvenido Administrador</h1>
          </div>
        )}
        {view === "gestion-empleados" && <GestionEmpleados />}
        {view === 'gestion-ordenes-solicitud' && <ListarMovilizacion />}
        {view === 'gestion-movilizaciones' && <ListarMovilizaciones />}
        {view === 'gestion-solicitud' && <ListarSolicitudesPendientesAdmin/>}
        {view === 'gestion-solicitud-crear' && <ListarSolicitudes />}
        {view === 'gestion-informe-crear' && <InformesPendientes/>}
        {view === 'gestion-gastos' && <ListarJustificacione/>}
        {view === 'reportes' && <Reportes />}
        {view === 'calendario-ordenes-aprobadas' && <Calendario />}
      </div>
      <ChangePasswordModal
        visible={isPasswordChangeModalVisible}
        onChangePassword={handlePasswordChange}
        onCancel={() => setIsPasswordChangeModalVisible(false)}
      />
    </div>
  );
};

export default MenuAdministrador;
