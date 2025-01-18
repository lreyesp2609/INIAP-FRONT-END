import React, { useState, useEffect } from "react";
import { message } from "antd"; // Importar Ant Design para las notificaciones
import API_URL from "../../../../Config";

const FormularioRegistrarKilometraje = ({ vehiculo, handleSubmit, handleCancel }) => {
  const [formData, setFormData] = useState({ ...vehiculo });
  const [data, setData] = useState({
    fecha_registro: '',
    kilometraje: '',
    evento: '',
    placa: '',
    marca: ''
  });

  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    // Obtener los detalles del vehículo
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
          setData({
            placa: result.placa,
            marca: result.marca,
            fecha_registro: result.fecha_registro || '',
            kilometraje: result.ultimo_kilometraje || '',
            evento: result.evento || ''
          });
        } else {
          console.error('Error al obtener los datos del vehículo:', result.mensaje);
        }
      } catch (error) {
        console.error('Error al obtener los datos del vehículo:', error);
      }
    };

    obtenerVehiculo();
  }, [formData.id_vehiculo, userId, token]);

  // Función para manejar los cambios de los inputs
  const handleChange = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // Función para registrar el kilometraje
  const registrarKilometraje = async () => {
    const formData = new FormData();
    formData.append('fecha_registro', data.fecha_registro);
    formData.append('kilometraje', data.kilometraje);
    formData.append('evento', data.evento);

    try {
      const response = await fetch(`${API_URL}/Mantenimientos/registrarkilometraje/${userId}/${formData.id_vehiculo}/`, {
        method: 'POST',
        headers: {
          'Authorization': `${token}`,
        },
        body: formData, // Enviar como FormData
      });

      const result = await response.json();

      if (response.ok) {
        // Mostrar la notificación de éxito
        message.success(result.mensaje);

        // Cerrar el formulario después de un registro exitoso
        handleCancel();
      } else {
        console.error('Error al registrar el kilometraje:', result.mensaje);
        message.error('Hubo un error al registrar el kilometraje');
      }
    } catch (error) {
      console.error('Error al hacer la solicitud:', error);
      message.error('Hubo un error al realizar la solicitud');
    }
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); registrarKilometraje(); }} className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold mb-4">Registrar Kilometraje</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Placa (solo lectura) */}
          <div>
            <label htmlFor="placa" className="block text-sm font-medium text-gray-700">
              Placa
            </label>
            <input
              id="placa"
              name="placa"
              type="text"
              value={data.placa}
              readOnly
              className="w-full bg-gray-100 text-black border border-gray-300 rounded py-2 px-4"
            />
          </div>

          {/* Marca (solo lectura) */}
          <div>
            <label htmlFor="marca" className="block text-sm font-medium text-gray-700">
              Marca
            </label>
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
        {/* Fecha de Registro */}
        <div>
          <label htmlFor="fecha_registro" className="block text-sm font-medium text-gray-700">
            Fecha de Registro
          </label>
          <input
            id="fecha_registro"
            name="fecha_registro"
            type="date"
            value={data.fecha_registro}
            onChange={handleChange}
            className="w-full bg-blue-100 text-black border border-blue-100 rounded py-2 px-4"
          />
        </div>

        {/* Kilometraje */}
        <div>
          <label htmlFor="kilometraje" className="block text-sm font-medium text-gray-700">
            Kilometraje
          </label>
          <input
            id="kilometraje"
            name="kilometraje"
            type="number"
            value={data.kilometraje !== undefined ? data.kilometraje : ''}
            onChange={handleChange}
            className="w-full bg-blue-100 text-black border border-blue-100 rounded py-2 px-4"
            placeholder="Kilometraje"
          />
        </div>
      </div>

      {/* Evento */}
      <div>
        <label htmlFor="evento" className="block text-sm font-medium text-gray-700">
          Evento
        </label>
        <textarea
          id="evento"
          name="evento"
          value={data.evento}
          onChange={handleChange}
          className="w-full bg-blue-100 text-black border border-blue-100 rounded py-2 px-4 h-32 resize-none"
          placeholder="Descripción del evento"
        />
      </div>

      <div className="mt-6 flex space-x-4 flex-wrap">
        <button
          type="submit"
          className="w-full sm:w-auto bg-blue-500 text-white rounded py-2 px-4 hover:bg-blue-600"
        >
          Registrar Kilometraje
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="w-full sm:w-auto bg-gray-500 text-white rounded py-2 px-4 hover:bg-gray-600"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default FormularioRegistrarKilometraje;
