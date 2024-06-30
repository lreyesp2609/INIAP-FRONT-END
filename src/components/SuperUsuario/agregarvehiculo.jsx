import React, { useState } from "react";
import { notification } from "antd";
import API_URL from "../../Config";
import FormularioVehiculo from "./formulariovehiculos";

const AgregarVehiculo = ({ onClose, onVehiculoAdded, userId }) => {
  const [formData, setFormData] = useState({
    id_subcategoria_bien: "",
    placa: "",
    codigo_inventario: "",
    modelo: "",
    marca: "",
    color_primario: "",
    color_secundario: "",
    anio_fabricacion: "",
    numero_motor: "",
    numero_chasis: "",
    numero_matricula: "",
    habilitado: "",
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
        console.error("Token not found");
        return;
      }

      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      const response = await fetch(
        `${API_URL}/Vehiculos/crear-vehiculo/${userId}/`,
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
          description: "Vehículo agregado correctamente",
        });
        onVehiculoAdded();
        onClose();
      } else {
        const errorText = await response.text();
        try {
          const errorJson = JSON.parse(errorText);
          console.error("Error:", errorJson);
          notification.error({
            message: "Error",
            description: `Error al agregar el vehículo: ${errorJson.error}`,
          });
        } catch (parseError) {
          console.error("Error al parsear JSON de error:", parseError);
          notification.error({
            message: "Error",
            description: `Error al agregar el vehículo: ${errorText}`,
          });
        }
      }
    } catch (error) {
      console.error("Error al agregar el vehículo:", error);
      notification.error({
        message: "Error",
        description: `Error al agregar el vehículo: ${error}`,
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
        <h2 className="text-2xl font-bold mb-4">Agregar Vehículo</h2>
        <FormularioVehiculo
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

export default AgregarVehiculo;
