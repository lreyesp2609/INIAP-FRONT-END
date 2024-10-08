import React, { useState, useEffect } from "react";
import { notification } from "antd";
import API_URL from "../../../Config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import FormularioBancoEditar from "./Formularios/formulariobancoeditar";

const EditarBanco = ({ banco, onClose, onBancoUpdated }) => {
  const [formData, setFormData] = useState({ ...banco });
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Cargar datos del usuario
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.usuario) {
      setUserId(storedUser.usuario.id_usuario);
    } else {
      console.error("Usuario no encontrado en localStorage");
    }

    setFormData({ ...banco });
    setLoading(false);
  }, [banco]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = async () => {
    if (!userId) {
      console.error("ID de usuario no encontrado");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token no encontrado");
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("nombre_banco", formData.nombre_banco.toUpperCase());

      const response = await fetch(
        `${API_URL}/Bancos/editar-banco/${userId}/${formData.id_banco}/`,
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
          description: "Banco actualizado correctamente",
        });
        onBancoUpdated();
        onClose();
      } else {
        const errorText = await response.text();
        try {
          const errorJson = JSON.parse(errorText);
          notification.error({
            message: "Error",
            description: `Error al actualizar el banco: ${errorJson.error}`,
          });
        } catch (parseError) {
          notification.error({
            message: "Error",
            description: `Error al actualizar el banco: ${errorText}`,
          });
        }
      }
    } catch (error) {
      console.error("Error al actualizar el banco:", error);
      notification.error({
        message: "Error",
        description: `Error al actualizar el banco: ${error}`,
      });
    }
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="w-full flex justify-center">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-5xl">
        <h2 className="text-2xl font-bold mb-4">Editar Banco</h2>
        <FormularioBancoEditar
          nombre_banco={formData.nombre_banco}
          onInputChange={handleInputChange}
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

export default EditarBanco;
