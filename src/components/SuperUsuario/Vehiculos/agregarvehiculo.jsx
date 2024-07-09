import React, { useState, useEffect } from "react";
import { notification } from "antd";
import API_URL from "../../../Config";
import FormularioVehiculo from "./Formularios/formulariovehiculos";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTimes } from '@fortawesome/free-solid-svg-icons';

const AgregarVehiculo = ({ onClose, onVehiculoAdded, userId }) => {
  const [formData, setFormData] = useState({
    id_categoria_bien: "",
    id_subcategoria_bien: "",
    placa: "",
    codigo_inventario: "",
    modelo: "",
    marca: "",
    color_primario: "",
    color_secundario: "",
    anio_fabricacion: "",
    numero_motor: "",
    numero_chasis: "",
    numero_matricula: "",
  });

  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token no encontrado");
          return;
        }

        const response = await fetch(
          `${API_URL}/CategoriasBienes/categorias-bienes/${userId}/`,
          {
            method: "GET",
            headers: {
              Authorization: `${token}`,
            },
          }
        );

        if (response.ok) {
          const categoriasData = await response.json();
          setCategorias(categoriasData);
        } else {
          const errorText = await response.text();
          console.error("Error al obtener categorías:", errorText);
        }
      } catch (error) {
        console.error("Error al obtener categorías:", error);
      }
    };

    fetchCategorias();
  }, [userId]);

  const handleCategoriaChange = (e) => {
    const categoriaId = e.target.value;
    setFormData({
      ...formData,
      id_categoria_bien: categoriaId,
      id_subcategoria_bien: "", // Limpiar la subcategoría seleccionada al cambiar de categoría
    });

    const selectedCategoria = categorias.find(
      (categoria) => categoria.id_categorias_bien === parseInt(categoriaId)
    );

    setSubcategorias(selectedCategoria ? selectedCategoria.subcategorias : []);
  };

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
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      const response = await fetch(
        `${API_URL}/Vehiculos/crear-vehiculo/${userId}/`,
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
          description: "Vehículo agregado correctamente",
        });
        onVehiculoAdded();
        onClose();
      } else {
        const errorText = await response.text();
        try {
          const errorJson = JSON.parse(errorText);
          console.error("Error:", errorJson);
          notification.error({
            message: "Error",
            description: `Error al agregar el vehículo: ${errorJson.error}`,
          });
        } catch (parseError) {
          console.error("Error al parsear JSON de error:", parseError);
          notification.error({
            message: "Error",
            description: `Error al agregar el vehículo: ${errorText}`,
          });
        }
      }
    } catch (error) {
      console.error("Error al agregar el vehículo:", error);
      notification.error({
        message: "Error",
        description: `Error al agregar el vehículo: ${error}`,
      });
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-5xl">
        <h2 className="text-2xl font-bold mb-4">Agregar Vehículo</h2>
        <FormularioVehiculo
          formData={formData}
          handleInputChange={handleInputChange}
          categorias={categorias}
          subcategorias={subcategorias}
          handleCategoriaChange={handleCategoriaChange}
        />
        <div className="mt-8 flex flex-col md:flex-row justify-end md:space-x-4 space-y-4 md:space-y-0">
          <button
            type="button"
            onClick={onClose}
            className="
            w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 border-b-4 border-red-400 hover:border-red-900 rounded
            "
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

export default AgregarVehiculo;
