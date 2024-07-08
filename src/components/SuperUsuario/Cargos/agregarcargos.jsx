import React, { useState } from "react";
import API_URL from "../../../Config";
import FormularioCargo from "./Formularios/formulariocargo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { notification } from "antd";

const AgregarCargo = ({ onClose, user, id_unidad }) => {
  const [cargo, setCargo] = useState("");
  const [error, setError] = useState("");

  const handleInputChange = (event) => {
    setCargo(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Token no encontrado");
      return;
    }

    // Crear un objeto FormData
    const formData = new FormData();
    formData.append("cargo", cargo);

    try {
      const response = await fetch(
        `${API_URL}/Cargos/crear-cargos/${user.id_usuario}/${id_unidad}/`,
        {
          method: "POST",
          headers: {
            Authorization: `${token}`, // Asegúrate de que el token esté precedido por "Bearer "
          },
          body: formData, // Enviar el objeto FormData
        }
      );

      if (response.ok) {
        const data = await response.json();
        notification.success({
          message: 'Éxito',
          description: data.message || 'Cargo agregado correctamente.',
          placement: 'topRight',
        });
        onClose();
      } else {
        const errorMessage = await response.text();
        throw new Error(`Error al agregar cargo: ${errorMessage}`);
      }
    } catch (error) {
      notification.error({
        message: 'Error',
        description: error.message || 'Ha ocurrido un error al agregar el cargo.',
        placement: 'topRight',
      });
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Volver
        </button>
        <h2 className="text-xl font-light">Agregar Cargo</h2>
        <div className="w-10"></div>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <FormularioCargo formData={{ cargo }} handleInputChange={handleInputChange} />
      <div className="flex justify-between mt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        >
          Cancelar
        </button>
        <button
          type="submit"
          onClick={handleSubmit}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Agregar
        </button>
      </div>
    </div>
  );
};

export default AgregarCargo;
