import React, { useState, useEffect } from "react";
import { notification } from "antd";
import API_URL from "../../Config";
import FormularioEstacion from "./formularioestacio";

const AgregarEstacion = ({ onClose, onEstacionAdded, userId }) => {
  const [formData, setFormData] = useState({
    nombre_estacion: "",
    ruc: "",
    direccion: "",
    telefono: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token no encontrado");
        return;
      }

      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      const response = await fetch(
        `${API_URL}/Estaciones/crear-estacion/${userId}/`,
        {
          method: "POST",
          headers: {
            Authorization: `${token}`,
          },
          body: formDataToSend,
        }
      );

      if (response.ok) {
        notification.success({
          message: "Éxito",
          description: "Estación agregada correctamente",
        });
        onEstacionAdded();
        onClose();
      } else {
        const errorText = await response.text();
        try {
          const errorJson = JSON.parse(errorText);
          console.error("Error:", errorJson);
          notification.error({
            message: "Error",
            description: `Error al agregar la estación: ${errorJson.error}`,
          });
        } catch (parseError) {
          console.error("Error al parsear JSON de error:", parseError);
          notification.error({
            message: "Error",
            description: `Error al agregar la estación: ${errorText}`,
          });
        }
      }
    } catch (error) {
      console.error("Error al agregar la estación:", error);
      notification.error({
        message: "Error",
        description: `Error al agregar la estación: ${error}`,
      });
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-5xl">
        <button
          onClick={onClose}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Volver a la Lista
        </button>
        <h2 className="text-2xl font-bold mb-4">Agregar Estación</h2>
        <FormularioEstacion
          formData={formData}
          handleInputChange={handleInputChange}
        />
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgregarEstacion;
