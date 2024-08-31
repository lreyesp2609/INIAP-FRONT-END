import React, { useState, useEffect} from "react";
import { notification } from "antd";
import API_URL from "../../../Config";
import FormularioUnidad from "./Formulario/formulariounidad";

const AgregarUnidad = ({ onClose, onUnidadAdded }) => {
  const [nombre_unidad, setNombreUnidad] = useState("");
  const [Estaciones, setEstaciones] = useState([]);
  const [formData, setFormData] = useState({
    id_estacion: "",
  });
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      setUserId(decodedToken.id_usuario); // Aquí debes asegurarte de que 'decodedToken.id_usuario' es un valor primitivo
      fetchEstaciones(decodedToken.id_usuario);
    }
  }, []);
  
  
  const fetchEstaciones = async (id_usuario) => {  // id_usuario como parámetro
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token not found");
        return;
      }
  
      const response = await fetch(`${API_URL}/Estaciones/estaciones/${id_usuario}`, {
        method: "GET",
        headers: {
          Authorization: `${token}`,
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
  
  const handleInputChange = (e) => {
    setNombreUnidad(e.target.value);
  };
  const handleEstacionChange = (e) => {
    setFormData({
      ...formData,
      id_estacion: e.target.value,
    });
  };
  
 

  const handleSave = async () => {
    try {
      console.log("Datos a enviar:", {
        nombre_unidad,
        id_estacion: formData.id_estacion,
      });
    
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token no encontrado");
        return;
      }
  
      const formDataToSend = new FormData();
      formDataToSend.append("nombre_unidad", nombre_unidad);
  
      console.log("id_usuario:", userId);
      console.log("id_estacion:", formData.id_estacion);
      
      const response = await fetch(
        `${API_URL}/Unidades/crear-unidades/${userId}/${formData.id_estacion}/`,
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
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 
          px-4 border-b-4 border-gray-600 hover:border-gray-500 rounded"
        >
          Volver a la Lista
        </button>
        <h2 className="text-2xl font-bold mb-4">Agregar Unidad</h2>
        <FormularioUnidad
          nombre_unidad={nombre_unidad}
          formData={formData}
          Estaciones={Estaciones}
          onInputChange={handleInputChange}
          onEstacionChange={handleEstacionChange} 

        />
        <div className="mt-8 flex flex-col md:flex-row justify-end md:space-x-4 space-y-4 md:space-y-0">
          <button
            type="button"
            onClick={() => onClose()} // Cierra el formulario sin hacer cambios
            className="
            w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 
            px-4 border-b-4 border-red-400 hover:border-red-900 rounded
            "
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 
          px-4 border-b-4 border-blue-300 hover:border-blue-700 rounded"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgregarUnidad;
