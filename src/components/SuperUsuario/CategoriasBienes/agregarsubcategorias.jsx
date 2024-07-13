import React, { useState } from "react";
import { notification } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import API_URL from "../../../Config";
import FormularioSubcategorias from "./Formularios/formulariosubcategorias";

const AgregarSubCategoriasBienes = ({
  onClose,
  user,
  categoryId,
  updateSubcategorias,
}) => {
  const [formData, setFormData] = useState({
    descripcion: "",
    identificador: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSaveSubcategoria = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token not found");
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("descripcion", formData.descripcion);
      formDataToSend.append("identificador", formData.identificador);

      const response = await fetch(
        `${API_URL}/CategoriasBienes/crear_subcategoria/${user.id_usuario}/${categoryId}/`,
        {
          method: "POST",
          headers: {
            Authorization: `${token}`,
          },
          body: formDataToSend,
        }
      );

      if (response.ok) {
        const newSubcategoria = await response.json();
        notification.success({
          message: "Éxito",
          description: "Subcategoría de bienes agregada correctamente.",
        });

        // Actualizar las subcategorías en el componente padre
        updateSubcategorias(newSubcategoria);

        onClose();
      } else {
        throw new Error(
          `Error al agregar la subcategoría de bienes: ${response.statusText}`
        );
      }
    } catch (error) {
      console.error("Error:", error);
      notification.error({
        message: "Error",
        description: `Error al agregar la subcategoría de bienes: ${error}`,
      });
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div className="w-full flex justify-center">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-5xl">
        <h2 className="text-2xl font-bold mb-4">
          Agregar Subcategoría de Bienes
        </h2>
        <FormularioSubcategorias
          handleInputChange={handleInputChange}
          formData={formData}
        />
        <div className="mt-8 flex flex-col md:flex-row justify-end md:space-x-4 space-y-4 md:space-y-0">
          <button
            type="button"
            onClick={handleSaveSubcategoria}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 
            border-b-4 border-blue-300 hover:border-blue-700 rounded"
          >
           <FontAwesomeIcon icon={faSave} /> Guardar
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 
            px-4 border-b-4 border-red-400 hover:border-red-900 rounded"
          >
           <FontAwesomeIcon icon={faTimes} /> Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgregarSubCategoriasBienes;
