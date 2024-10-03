import React, { useState, useEffect} from "react";
import API_URL from "../../../Config";
import FormularioCargo from "./Formularios/formulariocargo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { notification } from "antd";

const AgregarCargo = ({ onClose, user }) => {
  const [cargo, setCargo] = useState("");
  const [error, setError] = useState("");
  const [Unidades, setUnidades] = useState([]);
  const [formData, setFormData] = useState({
    id_unidad: "",
  });
  
  const handleInputChange = (event) => {
    setCargo(event.target.value);
  };
  useEffect(() => {
  const fetchUnidades = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/Unidades/unidadesall/`, {
        method: "POST",
        headers: {
          Authorization: `${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUnidades(data); // Extrae la lista de la propiedad tipos_licencias
      } else {
        console.error("Error al obtener las Unidades:", response.statusText);
      }
    } catch (error) {
      console.error("Error al obtener Unidades:", error);
    }
  };
  fetchUnidades();
}, []);
const handleUnidadChange = (e) => {
  setFormData({
    ...formData,
    id_unidad: e.target.value,
  });
};

  const handleSubmit = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Token no encontrado");
      return;
    }

    // Crear un objeto FormData
    const formDataToSend = new FormData();
    formDataToSend.append("cargo", cargo);
    console.log("id_unidad:",formData.id_unidad);
    console.log("id_usuario:", user.id_usuario);
    try {
      const response = await fetch(
        `${API_URL}/Cargos/crear-cargos/${user.id_usuario}/${formData.id_unidad}/`,
        {
          method: "POST",
          headers: {
            Authorization: `${token}`, // Asegúrate de que el token esté precedido por "Bearer "
          },
          body: formDataToSend, // Enviar el objeto FormData
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
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 border-b-4 border-gray-600 hover:border-gray-500 rounded"
          >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Volver
        </button>
        <h2 className="text-xl font-light">Agregar Cargo</h2>
        <div className="w-10"></div>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <FormularioCargo 
       formData={formData}
       Unidades={Unidades}
       handleUnidadChange={handleUnidadChange}
       handleInputChange={handleInputChange} />
      <div className="mt-8 flex flex-col md:flex-row justify-end md:space-x-4 space-y-4 md:space-y-0">
        <button
          type="button"
          onClick={onClose}
          className="
            w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 
            px-4 border-b-4 border-red-400 hover:border-red-900 rounded
            "
        >
          Cancelar
        </button>
        <button
          type="submit"
          onClick={handleSubmit}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 
          px-4 border-b-4 border-blue-300 hover:border-blue-700 rounded"

        >
          Agregar
        </button>
      </div>
    </div>
  );
};

export default AgregarCargo;
