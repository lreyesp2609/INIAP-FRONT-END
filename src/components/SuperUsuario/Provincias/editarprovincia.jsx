import React, { useState, useEffect } from "react";
import { notification } from "antd";
import API_URL from "../../../Config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import FormularioEditarProvincia from "./Formularios/formularioeditarprovincia";

const EditarProvincia = ({ provincia, onClose, onProvinciaUpdated, userId }) => {
  const [formData, setFormData] = useState({ ...provincia });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setFormData({ ...provincia });
    setLoading(false);
  }, [provincia]);

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
      formDataToSend.append("provincia", formData.provincia.toUpperCase());

      const response = await fetch(
        `${API_URL}/Provincias/editar_provincia/${userId}/${formData.id_provincia}/`,
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
          description: "Provincia actualizada correctamente",
        });
        onProvinciaUpdated();
        onClose();
      } else {
        const errorText = await response.text();
        console.error("Error al actualizar la provincia:", errorText);
        notification.error({
          message: "Error",
          description: `Error al actualizar la provincia: ${errorText}`,
        });
      }
    } catch (error) {
      console.error("Error al actualizar la provincia:", error);
      notification.error({
        message: "Error",
        description: `Error al actualizar la provincia: ${error}`,
      });
    }
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="w-full flex justify-center">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-5xl">
        <h2 className="text-2xl font-bold mb-4">Editar Provincia</h2>
        <FormularioEditarProvincia
          formData={formData}
          handleInputChange={handleInputChange}
        />
        <div className="mt-8 flex flex-col md:flex-row justify-end md:space-x-4 space-y-4 md:space-y-0">
          <button
            type="button"
            onClick={onClose}
            className="
            w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 
            px-4 border-b-4 border-red-400 hover:border-red-900 rounded
            "
          >
            <FontAwesomeIcon icon={faTimes} /> Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 
            border-b-4 border-blue-300 hover:border-blue-700 rounded"
          >
            <FontAwesomeIcon icon={faSave} /> Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditarProvincia;
