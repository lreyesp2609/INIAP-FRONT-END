import React, { useState } from "react";
import { notification } from "antd";
import API_URL from "../../Config";
import FormularioSubcategorias from "./formulariosubcategorias";

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
        <button
          onClick={handleCancel}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Volver a la Lista
        </button>
        <h2 className="text-2xl font-bold mb-4">
          Agregar Subcategoría de Bienes
        </h2>
        <FormularioSubcategorias
          handleInputChange={handleInputChange}
          formData={formData}
        />
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={handleSaveSubcategoria}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Guardar
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgregarSubCategoriasBienes;
