import React, { useState, useEffect } from "react";
import { notification } from "antd";
import API_URL from "../../../Config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import FormularioSubcategoriaEditar from "./Formularios/formulariosubcategoriaeditar";

const EditarSubcategoriaBienes = ({ onClose, user, categoria, subcategoria }) => {
  const [formData, setFormData] = useState({
    descripcion: "",
    identificador: "",
  });

  useEffect(() => {
    const fetchSubcategoria = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token not found");
          return;
        }

        const response = await fetch(
          `${API_URL}/CategoriasBienes/subcategorias/${categoria.id_categorias_bien}/`,
          {
            method: "GET",
            headers: {
              Authorization: `${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          // Buscar la subcategoría que necesitamos editar
          const subcategoriaData = data.find(
            (sub) => sub.id_subcategoria_bien === subcategoria.id_subcategoria_bien
          );
          if (subcategoriaData) {
            setFormData({
              descripcion: subcategoriaData.descripcion || "",
              identificador: subcategoriaData.identificador || "",
            });
          }
        } else {
          const errorText = await response.text();
          notification.error({
            message: "Error",
            description: `Error al cargar las subcategorías: ${errorText}`,
          });
        }
      } catch (error) {
        notification.error({
          message: "Error",
          description: `Error al cargar las subcategorías: ${error}`,
        });
      }
    };

    if (subcategoria) {
      fetchSubcategoria();
    }
  }, [user, categoria, subcategoria]);

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
      formDataToSend.append("descripcion", formData.descripcion);
      formDataToSend.append("identificador", formData.identificador);

      const response = await fetch(
        `${API_URL}/CategoriasBienes/editar-subcategoria/${user.id_usuario}/${categoria.id_categorias_bien}/${subcategoria.id_subcategoria_bien}/`,
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
          description: "Subcategoría editada exitosamente",
        });
      } else {
        const errorText = await response.text();
        try {
          const errorJson = JSON.parse(errorText);
          console.error("Error:", errorJson);
          notification.error({
            message: "Error",
            description: `Error al editar la subcategoría: ${errorJson.error}`,
          });
        } catch (parseError) {
          console.error("Error al parsear JSON de error:", parseError);
          notification.error({
            message: "Error",
            description: `Error al editar la subcategoría: ${errorText}`,
          });
        }
      }
    } catch (error) {
      console.error("Error:", error);
      notification.error({
        message: "Error",
        description: `Error al editar la subcategoría: ${error}`,
      });
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-5xl">
        <h2 className="text-2xl font-bold mb-4">Editar Subcategoría de Bienes</h2>
        <FormularioSubcategoriaEditar
          formData={formData}
          handleInputChange={handleInputChange}
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

export default EditarSubcategoriaBienes;
