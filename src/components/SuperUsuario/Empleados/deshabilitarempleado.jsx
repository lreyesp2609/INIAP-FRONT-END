import React from "react";
import { MdPersonOff } from "react-icons/md";
import API_URL from "../../../Config";
import { notification, Modal } from "antd";

const DeshabilitarEmpleado = ({
  empleadoId,
  userId,
  onDeshabilitar,
  empleadoNombre,
  empleadoCedula,
}) => {
  const handleDeshabilitar = () => {
    Modal.confirm({
      title: `¿Estás seguro de deshabilitar al empleado ${empleadoNombre} - ${empleadoCedula}?`,
      content:
        "Esta acción deshabilitará al empleado y no podrá volver a acceder al sistema.",
      okText: "Sí",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
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
            `${API_URL}/Empleados/deshabilitar-empleado/${userId}/${empleadoId}/`,
            {
              method: "POST",
              headers: {
                Authorization: `${token}`,
              },
            }
          );

          if (response.ok) {
            notification.success({
              message: "Éxito",
              description: "Empleado deshabilitado exitosamente",
            });
            onDeshabilitar();
          } else {
            console.error(
              "Error al deshabilitar empleado:",
              response.statusText
            );
            notification.error({
              message: "Error",
              description: "Error al deshabilitar empleado",
            });
          }
        } catch (error) {
          console.error("Error al deshabilitar empleado:", error);
          notification.error({
            message: "Error",
            description: "Error al deshabilitar empleado",
          });
        }
      },
    });
  };

  return (
    <button
      className="p-2 bg-red-500 text-white rounded-full"
      title="Deshabilitar empleado"
      onClick={handleDeshabilitar}
    >
      <MdPersonOff />
    </button>
  );
};

export default DeshabilitarEmpleado;
