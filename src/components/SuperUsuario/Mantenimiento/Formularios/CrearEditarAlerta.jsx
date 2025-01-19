import React, { useState, useEffect } from "react";
import { message } from "antd"; // Importar Ant Design para las notificaciones
import API_URL from "../../../../Config";

const FormularioGestionarAlertas = ({ vehiculo, handleSubmit, handleCancel }) => {
  const [formData, setFormData] = useState({ ...vehiculo });
  const [data, setData] = useState({
    kilometraje_activacion: '',
    tipo_mantenimiento: '',
    placa: '',
    marca: '',
  });

  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  // Obtener detalles del vehículo y alertas asociadas
  useEffect(() => {
    const obtenerVehiculo = async () => {
      try {
        const response = await fetch(`${API_URL}/Mantenimientos/vehiculosultimo_kilometraje/${userId}/${formData.id_vehiculo}/`, {
          method: 'GET',
          headers: {
            Authorization: `${token}`,
          },
        });

        const result = await response.json();
        if (response.ok) {
          setData((prevData) => ({
            ...prevData,
            id_vehiculo: formData.id_vehiculo,
            placa: result.placa,
            marca: result.marca,
            kilometraje_activacion: result.ultimo_kilometraje || '',
          }));
        } else {
          message.warning('No se ha registrado kilometraje para este vehículo');
          setData((prevData) => ({
            ...prevData,
            kilometraje_activacion: '',
          }));
        }
      } catch (error) {
        console.error('Error al obtener los datos del vehículo:', error);
        message.error('Error al obtener los datos del vehículo');
      }
    };

    // Obtener las alertas de mantenimiento asociadas al vehículo
    const obtenerAlertas = async () => {
      try {
        const response = await fetch(`${API_URL}/Mantenimientos/listar_detalle_alertas/${userId}/${formData.id_vehiculo}/`, {
          method: 'GET',
          headers: {
            Authorization: `${token}`,
          },
        });

        const result = await response.json();
        if (response.ok && result.alertas.length > 0) {
          // Si hay alertas previas, se llena el formulario con los datos más recientes
          const ultimaAlerta = result.alertas[result.alertas.length - 1]; // Tomamos la última alerta
          setData((prevData) => ({
            ...prevData,
            kilometraje_activacion: ultimaAlerta.kilometraje_activacion,
            tipo_mantenimiento: ultimaAlerta.tipo_mantenimiento,
          }));
        } else {
          message.warning('No se encontraron alertas de mantenimiento para este vehículo');
        }
      } catch (error) {
        console.error('Error al obtener las alertas de mantenimiento:', error);
        message.error('Error al obtener las alertas de mantenimiento');
      }
    };

    obtenerVehiculo();
    obtenerAlertas();
  }, [formData.id_vehiculo, userId, token]);

  // Función para manejar los cambios de los inputs
  const handleChange = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // Función para crear o editar la alerta de mantenimiento
  const gestionarAlerta = async () => {
    const formData = new FormData();
    formData.append('kilometraje_activacion', data.kilometraje_activacion);
    formData.append('tipo_mantenimiento', data.tipo_mantenimiento);

    try {
      const response = await fetch(`${API_URL}/Mantenimientos/gestionar_alerta/${userId}/${data.id_vehiculo}/`, {
        method: 'POST',
        headers: {
          'Authorization': `${token}`,
        },
        body: formData, // Enviar como FormData
      });

      const result = await response.json();

      if (response.ok) {
        message.success(result.mensaje);
        handleCancel();
      } else {
        message.error(`Error al gestionar la alerta: ${result.mensaje}`);
      }
    } catch (error) {
      console.error('Error al hacer la solicitud:', error);
      message.error('Hubo un error al realizar la solicitud');
    }
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); gestionarAlerta(); }} className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold mb-4">Gestionar Alerta de Mantenimiento</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="placa" className="block text-sm font-medium text-gray-700">Placa</label>
            <input
              id="placa"
              name="placa"
              type="text"
              value={data.placa}
              readOnly
              className="w-full bg-gray-100 text-black border border-gray-300 rounded py-2 px-4"
            />
          </div>
          <div>
            <label htmlFor="marca" className="block text-sm font-medium text-gray-700">Marca</label>
            <input
              id="marca"
              name="marca"
              type="text"
              value={data.marca}
              readOnly
              className="w-full bg-gray-100 text-black border border-gray-300 rounded py-2 px-4"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="kilometraje_activacion" className="block text-sm font-medium text-gray-700">Kilometraje Activación</label>
          <input
            id="kilometraje_activacion"
            name="kilometraje_activacion"
            type="number"
            value={data.kilometraje_activacion}
            onChange={handleChange}
            className="w-full bg-blue-100 text-black border border-blue-100 rounded py-2 px-4"
            placeholder="Kilometraje de activación"
          />
        </div>
        <div>
          <label htmlFor="tipo_mantenimiento" className="block text-sm font-medium text-gray-700">Tipo de Mantenimiento</label>
          <input
            id="tipo_mantenimiento"
            name="tipo_mantenimiento"
            type="text"
            value={data.tipo_mantenimiento}
            onChange={handleChange}
            className="w-full bg-blue-100 text-black border border-blue-100 rounded py-2 px-4"
            placeholder="Tipo de mantenimiento"
          />
        </div>
      </div>

      <div className="mt-6 flex space-x-4 flex-wrap">
        <button type="submit" className="w-full sm:w-auto bg-blue-500 text-white rounded py-2 px-4 hover:bg-blue-600">Guardar Alerta</button>
        <button type="button" onClick={handleCancel} className="w-full sm:w-auto bg-gray-500 text-white rounded py-2 px-4 hover:bg-gray-600">Cancelar</button>
      </div>
    </form>
  );
};

export default FormularioGestionarAlertas;
