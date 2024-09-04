import React, { useEffect, useState } from 'react';
import FormularioEditarCargo from '../Cargos/Formularios/formularioeditarcargo';
import API_URL from "../../../Config";
import { notification } from "antd";

const EditarCargo = ({ cargo, onCancel, onActualizacion }) => {
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
    urlEncodedData.append("cargo", formData.cargo);
;

    try {
      const response = await fetch(
        `${API_URL}/Cargos/editar-cargos/${userId}/${cargo.id_cargo}/`,
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
          description: data.mensaje || 'Cargo editado correctamente'
        });
        onActualizacion();
        onCancel();
      } else {
        const errorData = await response.json();
        notification.error({
          message: 'Error',
          description: errorData.error || 'Error al editar el cargo'
        });
        console.error('Error al actualizar la estación:', response.statusText);
      }
    } catch (error) {
      console.error('Error al actualizar la estación:', error);
    }
  };

  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Editar Estación</h2>
      <FormularioEditarCargo
        cargo={cargo}
        onSubmit={handleSubmit}
        onCancel={onCancel}
      />
    </div>
  );
};

export default EditarCargo;
