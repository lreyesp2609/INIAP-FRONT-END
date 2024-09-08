import React, { useEffect, useState } from 'react';
import FormularioEditarunidad from '../Unidades/Formulario/formularioeditarunidad';
import API_URL from "../../../Config";
import { notification } from "antd";

const EditarUnidad = ({ unidad, onCancel, onActualizacion }) => {
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
    urlEncodedData.append("nombre_unidad", formData.nombre_unidad);
    urlEncodedData.append("siglas_unidad", formData.siglas_unidad);
;

    try {
      const response = await fetch(
        `${API_URL}/Unidades/editar-unidades/${userId}/${unidad.id_unidad}/`,
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
      <h2 className="text-2xl font-bold mb-4">Editar Unidad</h2>
      <FormularioEditarunidad
        unidad={unidad}
        onSubmit={handleSubmit}
        onCancel={onCancel}
      />
    </div>
  );
};

export default EditarUnidad;
