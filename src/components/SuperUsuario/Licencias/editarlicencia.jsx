import React, { useState } from "react";
import { notification } from "antd";
import API_URL from "../../../Config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import FormularioEditarLicencia from "./Formularios/formularioeditarlicencia";

const EditarLicencia = ({ licencia, onClose, onLicenciaUpdated, userId }) => {
  const [formData, setFormData] = useState({
    tipo_licencia: licencia.tipo_licencia || '',
    observacion: licencia.observacion || '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token no encontrado");
        return;
      }

      const data = new FormData();
      data.append('tipo_licencia', formData.tipo_licencia);
      data.append('observacion', formData.observacion);

      const response = await fetch(
        `${API_URL}/Licencias/editar-tipo-licencia/${userId}/${licencia.id_tipo_licencia}/`,
        {
          method: "POST",
          headers: {
            Authorization: `${token}`,
          },
          body: data,
        }
      );

      if (response.ok) {
        notification.success({
          message: "Éxito",
          description: "Licencia actualizada correctamente",
        });
        onLicenciaUpdated();
        onClose();
      } else {
        const errorText = await response.json();
        console.error("Error al actualizar la licencia:", errorText);
        notification.error({
          message: "Error",
          description: `Error al actualizar la licencia: ${errorText.error}`,
        });
      }
    } catch (error) {
      console.error("Error al actualizar la licencia:", error);
      notification.error({
        message: "Error",
        description: `Error al actualizar la licencia: ${error.message}`,
      });
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-3xl">
        <h2 className="text-2xl font-bold mb-4">Editar Licencia</h2>
        <FormularioEditarLicencia
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

export default EditarLicencia;
