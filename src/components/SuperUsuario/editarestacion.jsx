import React, { useEffect, useState } from 'react';
import FormularioEditarEstacion from './formularioeditarestacion';
import API_URL from "../../Config";
import { notification } from "antd";

const EditarEstacion = ({ estacion, onCancel, onActualizacion }) => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const id_usuario = JSON.parse(atob(token.split(".")[1])).id_usuario;
      setUserId(id_usuario);
    }
  }, []);

  const handleSubmit = async (formData) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }

    const urlEncodedData = new URLSearchParams();
    urlEncodedData.append("nombre_estacion", formData.nombre_estacion);
    urlEncodedData.append("ruc", formData.ruc);
    urlEncodedData.append("direccion", formData.direccion);
    urlEncodedData.append("telefono", formData.telefono);

    try {
      const response = await fetch(
        `${API_URL}/Estaciones/editar-estacion/${userId}/${estacion.id_estacion}/`,
        {
          method: 'POST',
          headers: {
            'Authorization': token,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: urlEncodedData.toString()
        }
      );

      if (response.ok) {
        const data = await response.json();
        notification.success({
          message: 'Éxito',
          description: data.mensaje || 'Estación editada correctamente'
        });
        onActualizacion();
        onCancel();
      } else {
        const errorData = await response.json();
        notification.error({
          message: 'Error',
          description: errorData.error || 'Error al editar la estación'
        });
        console.error('Error al actualizar la estación:', response.statusText);
      }
    } catch (error) {
      console.error('Error al actualizar la estación:', error);
    }
  };

  return (
    <div>
      <button
        onClick={onCancel}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Volver a la Lista
      </button>
      <h2 className="text-2xl font-bold mb-4">Editar Estación</h2>
      <FormularioEditarEstacion
        estacion={estacion}
        onSubmit={handleSubmit}
        onCancel={onCancel}
      />
    </div>
  );
};

export default EditarEstacion;
