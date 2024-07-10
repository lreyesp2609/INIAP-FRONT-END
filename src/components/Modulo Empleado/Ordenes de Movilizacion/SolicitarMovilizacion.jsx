import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../../Config';
import { notification } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes } from '@fortawesome/free-solid-svg-icons';

const SolicitarMovilizacion = ({ onClose }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    secuencial_orden_movilizacion: '',
    fecha_viaje: '',
    hora_ida: '',
    hora_regreso: ''
  });
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const idUsuario = storedUser?.usuario?.id_usuario;
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token no encontrado');

      const response = await fetch(`${API_URL}/crear-orden-movilizacion/${idUsuario}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Error al crear la solicitud');
      }

      const data = await response.json();
      navigate('/lista-solicitudes'); // Redirigir a la lista de solicitudes después de crear una nueva solicitud
      notification.success({
        message: "Éxito",
        description: "Solicitud creada exitosamente",
      });
    } catch (error) {
      setError(error.message);
      notification.error({
        message: "Error",
        description: `Error al crear la solicitud: ${error.message}`,
      });
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-5xl">
        <h2 className="text-2xl font-bold mb-4 text-center">Solicitar Movilización</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form id="solicitudForm" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Secuencial de Orden:</label>
            <input
              type="text"
              name="secuencial_orden_movilizacion"
              value={formData.secuencial_orden_movilizacion}
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Fecha de Viaje:</label>
            <input
              type="date"
              name="fecha_viaje"
              value={formData.fecha_viaje}
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Hora de Ida:</label>
            <input
              type="time"
              name="hora_ida"
              value={formData.hora_ida}
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Hora de Regreso:</label>
            <input
              type="time"
              name="hora_regreso"
              value={formData.hora_regreso}
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mt-8 flex flex-col md:flex-row justify-end md:space-x-4 space-y-4 md:space-y-0">
            <button
              type="button"
              onClick={onClose}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 border-b-4 border-red-400 hover:border-red-900 rounded"
            >
              <FontAwesomeIcon icon={faTimes} /> Cancelar
            </button>
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 border-b-4 border-blue-300 hover:border-blue-700 rounded"
            >
              <FontAwesomeIcon icon={faSave} /> Crear Solicitud
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SolicitarMovilizacion;
