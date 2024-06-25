import React, { useState } from "react";
import { notification } from "antd";
import API_URL from "../../Config";
import FormularioCategoriaBienes from "./formulariocategoriabienes";

const AgregarCategoriasBienes = (props) => {
  const { onClose, user } = props;
  const [formData, setFormData] = useState({
    descripcion_categoria: "",
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
      formDataToSend.append("descripcion_categoria", formData.descripcion_categoria);
  
      const response = await fetch(
        `${API_URL}/CategoriasBienes/crear_categoria/${user.id_usuario}/`,
        {
          method: "POST",
          headers: {
            Authorization: `${token}`,
          },
          body: formDataToSend,
        }
      );
  
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        onClose();
        notification.success({
          message: "Éxito",
          description: "Categoría de bienes agregada exitosamente",
        });
  
        fetch(`${API_URL}/CategoriasBienes/categorias-bienes/${user.id_usuario}/`, {
          headers: {
            Authorization: `${token}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            setCategorias(data);
            setFilteredCategorias(data);
          })
          .catch((error) => {
            console.error("Error al obtener categorías:", error);
          });
      } else {
        const errorText = await response.text();
        try {
          const errorJson = JSON.parse(errorText);
          console.error("Error:", errorJson);
          notification.error({
            message: "Error",
            description: `Error al agregar la categoría de bienes: ${errorJson.error}`,
          });
        } catch (parseError) {
          console.error("Error al parsear JSON de error:", parseError);
          notification.error({
            message: "Error",
            description: `Error al agregar la categoría de bienes: ${errorText}`,
          });
        }
      }
    } catch (error) {
      console.error("Error:", error);
      notification.error({
        message: "Error",
        description: `Error al agregar la categoría de bienes: ${error}`,
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
        <h2 className="text-2xl font-bold mb-4">Agregar Categoría de Bienes</h2>
        <FormularioCategoriaBienes
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

export default AgregarCategoriasBienes;
