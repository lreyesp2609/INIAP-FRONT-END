import React, { useState, useEffect } from "react";
import { notification } from "antd";
import API_URL from "../../../Config";
import FormularioEditarVehiculo from "./Formularios/formularioeditarvehiculo";

const EditarVehiculo = ({ vehiculo, onClose, onVehiculoUpdated, userId }) => {
  const [formData, setFormData] = useState({ ...vehiculo });
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehiculoDetalle = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token no encontrado");
          return;
        }

        const response = await fetch(
          `${API_URL}/Vehiculos/detalle-vehiculo/${userId}/${formData.id_vehiculo}/`,
          {
            method: "GET",
            headers: {
              Authorization: `${token}`,
            },
          }
        );

        if (response.ok) {
          const vehiculoDetalle = await response.json();
          setFormData((prevFormData) => ({
            ...prevFormData,
            ...vehiculoDetalle,
            subcategoria: {
              id_subcategoria: vehiculoDetalle.subcategoria.id_subcategoria,
            },
          }));

          fetchCategorias(vehiculoDetalle.categoria.id_categoria);
        } else {
          const errorText = await response.text();
          console.error("Error al obtener detalle del vehículo:", errorText);
        }
      } catch (error) {
        console.error("Error al obtener detalle del vehículo:", error);
      } finally {
        setLoading(false);
      }
    };

    if (formData.id_vehiculo) {
      fetchVehiculoDetalle();
    }
  }, [userId, formData.id_vehiculo]);

  const fetchCategorias = async (idCategoria) => {
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

        const categoriaInicial = categoriasData.find(
          (categoria) => categoria.id_categorias_bien === idCategoria
        );

        if (categoriaInicial) {
          setSubcategorias(categoriaInicial.subcategorias);
        }
      } else {
        const errorText = await response.text();
        console.error("Error al obtener categorías:", errorText);
      }
    } catch (error) {
      console.error("Error al obtener categorías:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCategoriaChange = (e) => {
    const categoriaId = e.target.value;
    setFormData({
      ...formData,
      categoria: {
        id_categoria: categoriaId,
      },
      subcategoria: {
        id_subcategoria: "",
      },
    });

    const selectedCategoria = categorias.find(
      (categoria) => categoria.id_categorias_bien === parseInt(categoriaId)
    );

    setSubcategorias(selectedCategoria ? selectedCategoria.subcategorias : []);
  };

  const handleSubcategoriaChange = (e) => {
    const subcategoriaId = e.target.value;
    const selectedSubcategoria = subcategorias.find(
      (subcategoria) => subcategoria.id_subcategoria_bien === parseInt(subcategoriaId)
    );
  
    setFormData({
      ...formData,
      id_subcategoria_bien: subcategoriaId, // Actualiza id_subcategoria_bien con el ID seleccionado
      subcategoria: {
        id_subcategoria: subcategoriaId,
      },
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
  
      // Asegúrate de que id_subcategoria_bien esté definido y sea un número
      formDataToSend.append("id_subcategoria_bien", formData.id_subcategoria_bien || '');
  
      // Agrega los demás campos
      formDataToSend.append("placa", formData.placa);
      formDataToSend.append("codigo_inventario", formData.codigo_inventario);
      formDataToSend.append("modelo", formData.modelo);
      formDataToSend.append("marca", formData.marca);
      formDataToSend.append("color_primario", formData.color_primario);
      formDataToSend.append("color_secundario", formData.color_secundario);
      formDataToSend.append("anio_fabricacion", formData.anio_fabricacion);
      formDataToSend.append("numero_motor", formData.numero_motor);
      formDataToSend.append("numero_chasis", formData.numero_chasis);
      formDataToSend.append("numero_matricula", formData.numero_matricula);
  
      const response = await fetch(
        `${API_URL}/Vehiculos/editar-vehiculo/${userId}/${formData.id_vehiculo}/`,
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
          description: "Vehículo actualizado correctamente",
        });
        onVehiculoUpdated();
        onClose();
      } else {
        const errorText = await response.text();
        console.error("Error al actualizar el vehículo:", errorText);
        notification.error({
          message: "Error",
          description: `Error al actualizar el vehículo: ${errorText}`,
        });
      }
    } catch (error) {
      console.error("Error al actualizar el vehículo:", error);
      notification.error({
        message: "Error",
        description: `Error al actualizar el vehículo: ${error}`,
      });
    }
  };
  
  
  if (loading) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="w-full flex justify-center">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-5xl">
        <button
          onClick={onClose}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Volver a la Lista
        </button>
        <h2 className="text-2xl font-bold mb-4">Editar Vehículo</h2>
        <FormularioEditarVehiculo
          formData={formData}
          categorias={categorias}
          subcategorias={subcategorias}
          handleInputChange={handleInputChange}
          handleCategoriaChange={handleCategoriaChange}
          handleSubcategoriaChange={handleSubcategoriaChange}
        />
        <div className="flex justify-end space-x-4 mt-4">
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

export default EditarVehiculo;
