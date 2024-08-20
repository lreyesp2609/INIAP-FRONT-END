import React, { useState } from "react";
import { notification } from "antd";
import API_URL from "../../../Config";
import FormularioEncabezado from "./Formulario/formularioencabezado";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTimes } from '@fortawesome/free-solid-svg-icons';

const AgregarEncabezado = ({ onClose, onEncabezadoAdded }) => {
  const [formData, setFormData] = useState({
    encabezado_superior: null,
    encabezado_inferior: null,
  });

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({
      ...formData,
      [name]: files[0] || null,
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
      if (formData.encabezado_superior) {
        formDataToSend.append("encabezado_superior", formData.encabezado_superior);
      }
      if (formData.encabezado_inferior) {
        formDataToSend.append("encabezado_inferior", formData.encabezado_inferior);
      }

      const response = await fetch(`${API_URL}/Encabezados/crear_encabezado/`, {
        method: "POST",
        headers: {
          Authorization: `${token}`,
        },
        body: formDataToSend,
      });

      if (response.ok) {
        notification.success({
          message: "Éxito",
          description: "Encabezado agregado correctamente",
        });
        onEncabezadoAdded();
        onClose();
      } else {
        const errorText = await response.text();
        try {
          const errorJson = JSON.parse(errorText);
          console.error("Error:", errorJson);
          notification.error({
            message: "Error",
            description: `Error al agregar el encabezado: ${errorJson.error}`,
          });
        } catch (parseError) {
          console.error("Error al parsear JSON de error:", parseError);
          notification.error({
            message: "Error",
            description: `Error al agregar el encabezado: ${errorText}`,
          });
        }
      }
    } catch (error) {
      console.error("Error al agregar el encabezado:", error);
      notification.error({
        message: "Error",
        description: `Error al agregar el encabezado: ${error}`,
      });
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-5xl">
        <h2 className="text-2xl font-bold mb-4">Agregar Encabezado</h2>
        <FormularioEncabezado
          formData={formData}
          handleFileChange={handleFileChange}
        />
        <div className="mt-8 flex flex-col md:flex-row justify-end md:space-x-4 space-y-4 md:space-y-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 border-b-4 border-red-400 hover:border-red-900 rounded"
          >
            <FontAwesomeIcon icon={faTimes} /> Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 border-b-4 border-blue-300 hover:border-blue-700 rounded"
          >
            <FontAwesomeIcon icon={faSave} /> Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgregarEncabezado;
