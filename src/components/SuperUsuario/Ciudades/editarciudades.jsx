import React, { useState, useEffect } from "react";
import { notification, Modal } from "antd";
import API_URL from "../../../Config";
import FormularioCiudadEditar from "./Formularios/formularioeditarciudad";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTimes } from '@fortawesome/free-solid-svg-icons';

const EditarCiudad = ({ ciudad, onClose, onCiudadUpdated, userId, provinciaNombre }) => {
  const [formData, setFormData] = useState({ ...ciudad });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [confirmVisible, setConfirmVisible] = useState(false);

  useEffect(() => {
    setFormData({ ...ciudad });
    setLoading(false);
  }, [ciudad]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,  // Mantener el texto tal como está
    });
  };

  const validateForm = () => {
    const newErrors = {};
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

    if (!formData.ciudad.trim()) {
      newErrors.ciudad = "El campo no puede estar vacío.";
    } else if (!regex.test(formData.ciudad)) {
      newErrors.ciudad = "El campo solo puede contener letras, espacios y caracteres acentuados.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token no encontrado");
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("ciudad", formData.ciudad);

      const response = await fetch(
        `${API_URL}/Ciudades/editar_ciudades/${userId}/${formData.id_ciudad}/`,
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
          description: "Ciudad actualizada correctamente",
        });
        onCiudadUpdated();
        onClose();
      } else {
        const errorText = await response.text();
        try {
          const errorJson = JSON.parse(errorText);
          console.error("Error:", errorJson);
          notification.error({
            message: "Error",
            description: `Error al actualizar la ciudad: ${errorJson.error}`,
          });
        } catch (parseError) {
          console.error("Error al parsear JSON de error:", parseError);
          notification.error({
            message: "Error",
            description: `Error al actualizar la ciudad: ${errorText}`,
          });
        }
      }
    } catch (error) {
      console.error("Error al actualizar la ciudad:", error);
      notification.error({
        message: "Error",
        description: `Error al actualizar la ciudad: ${error}`,
      });
    }
  };

  const showConfirm = () => {
    if (validateForm()) {
      setConfirmVisible(true);
    }
  };

  const handleConfirmOk = () => {
    handleSave();
    setConfirmVisible(false);
  };

  const handleConfirmCancel = () => {
    setConfirmVisible(false);
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="w-full flex justify-center">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-5xl">
        <h2 className="text-2xl font-bold mb-4">Editar Ciudad</h2>
        <FormularioCiudadEditar
          formData={formData}
          handleInputChange={handleInputChange}
          errors={errors}
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
            onClick={showConfirm}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 border-b-4 border-blue-300 hover:border-blue-700 rounded"
          >
            <FontAwesomeIcon icon={faSave} /> Guardar
          </button>
        </div>
      </div>

      <Modal
        title="Confirmar"
        visible={confirmVisible}
        onOk={handleConfirmOk}
        onCancel={handleConfirmCancel}
        okText="Sí, editar"
        cancelText="Cancelar"
      >
        <p>¿Estás seguro de que quieres editar el nombre de la ciudad de la provincia "{provinciaNombre}"?</p>
      </Modal>
    </div>
  );
};

export default EditarCiudad;
