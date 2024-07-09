import React, { useState, useEffect } from "react";
import API_URL from "../../../Config";
import { notification } from "antd";
import TablaEmpleadosDeshabilitados from "./Tablas/tablaempleadosdeshabilitado";

const HabilitarEmpleado = ({ user, fetchEmpleados, onVolver }) => {
  const [empleadosDeshabilitados, setEmpleadosDeshabilitados] = useState([]);

  useEffect(() => {
    if (user && user.usuario && user.usuario.id_usuario) {
      fetchEmpleadosDeshabilitados(user.usuario.id_usuario);
    }
  }, [user]);

  const fetchEmpleadosDeshabilitados = async (id_usuario) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/Empleados/lista-empleados-deshabilitados/${id_usuario}/`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setEmpleadosDeshabilitados(data);
      } else {
        console.error(
          "Error al obtener empleados deshabilitados:",
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error al obtener empleados deshabilitados:", error);
    }
  };

  const handleHabilitarEmpleado = async (empleadoId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      notification.error({
        message: "Error",
        description: "No estás autenticado",
      });
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/Empleados/habilitar-empleado/${user.usuario.id_usuario}/${empleadoId}/`,
        {
          method: "POST",
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ habilitado: 1 }),
        }
      );

      if (response.ok) {
        notification.success({
          message: "Empleado Habilitado",
          description: "El empleado ha sido habilitado exitosamente.",
        });
        if (user && user.usuario && user.usuario.id_usuario) {
          fetchEmpleados(user.usuario.id_usuario);
          fetchEmpleadosDeshabilitados(user.usuario.id_usuario);
        }
      } else {
        const errorData = await response.json();
        notification.error({
          message: "Error al habilitar empleado",
          description: errorData.error || response.statusText,
        });
      }
    } catch (error) {
      console.error("Error al habilitar empleado:", error);
    }
  };

  return (
    <div className="w-full p-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-4 md:space-y-0 md:space-x-4">
        <h1 className="text-2xl font-light">Empleados Deshabilitados</h1>
        <button
          onClick={onVolver}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 border-b-4 border-blue-300 hover:border-blue-700 rounded"
        >
          Volver a la Lista
        </button>
      </div>
      <TablaEmpleadosDeshabilitados
        empleados={empleadosDeshabilitados}
        onHabilitarEmpleado={handleHabilitarEmpleado}
      />
    </div>
  );
};

export default HabilitarEmpleado;
