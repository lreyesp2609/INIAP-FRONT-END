import React, { useState, useEffect} from "react";
import { notification } from "antd";
import API_URL from "../../../Config";
import FormularioUnidad from "./Formulario/formulariounidad";

const AgregarUnidad = ({ onClose, onUnidadAdded, id_estacion }) => {
  const [nombre_unidad, setNombreUnidad] = useState("");
  const [Estaciones, setEstaciones] = useState([]);
  const [formData, setFormData] = useState({
    id_Estacion: "",
  });
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const id_usuario = JSON.parse(atob(token.split(".")[1])).id_usuario;
      setUserId(id_usuario);
      fetchEstaciones(id_usuario);
    }
  }, []);

  

  const handleInputChange = (e) => {
    setNombreUnidad(e.target.value);
  };

  const fetchEstaciones = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token not found");
        return;
      }

      const response = await fetch(`${API_URL}/Estaciones/estaciones/${userId}`, {
        method: "GET",
        headers: {
          Authorization: `${token}`, // Añade 'Bearer' si el token es un JWT
        },
      });

      if (response.ok) {
        const data = await response.json();
        setEstaciones(data);
      } else {
        console.error("Error:", response.statusText);
        notification.error({
          message: "Error",
          description: "Error al obtener las estaciones",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      notification.error({
        message: "Error",
        description: "Error al obtener las estaciones",
      });
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token no encontrado");
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("nombre_unidad", nombre_unidad);

      const response = await fetch(
        `${API_URL}/Unidades/crear-unidades/${id_usuario}/${id_estacion}/`,
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
          description: "Unidad agregada correctamente",
        });
        onUnidadAdded();
        onClose();
      } else {
        const errorText = await response.text();
        try {
          const errorJson = JSON.parse(errorText);
          console.error("Error:", errorJson);
          notification.error({
            message: "Error",
            description: `Error al agregar la unidad: ${errorJson.error}`,
          });
        } catch (parseError) {
          console.error("Error al parsear JSON de error:", parseError);
          notification.error({
            message: "Error",
            description: `Error al agregar la unidad: ${errorText}`,
          });
        }
      }
    } catch (error) {
      console.error("Error al agregar la unidad:", error);
      notification.error({
        message: "Error",
        description: `Error al agregar la unidad: ${error}`,
      });
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
        <button
          onClick={onClose}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Volver a la Lista
        </button>
        <h2 className="text-2xl font-bold mb-4">Agregar Unidad</h2>
        <FormularioUnidad
          nombre_unidad={nombre_unidad}
          formData={formData}
          
          id_estacion={id_estacion}
          Estaciones={Estaciones}
          onInputChange={handleInputChange}
        />
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => onClose()} // Cierra el formulario sin hacer cambios
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

export default AgregarUnidad;
