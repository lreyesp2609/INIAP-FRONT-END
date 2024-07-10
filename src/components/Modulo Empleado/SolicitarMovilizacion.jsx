import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../Config';

const SolicitarMovilizacion = () => {
  const navigate = useNavigate();
  const [secuencialOrden, setSecuencialOrden] = useState('');
  const [fechaViaje, setFechaViaje] = useState('');
  const [horaIda, setHoraIda] = useState('');
  const [horaRegreso, setHoraRegreso] = useState('');
  const [error, setError] = useState(null);

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
        body: JSON.stringify({
          secuencial_orden_movilizacion: secuencialOrden,
          fecha_viaje: fechaViaje,
          hora_ida: horaIda,
          hora_regreso: horaRegreso,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al crear la solicitud');
      }

      const data = await response.json();
      navigate('/lista-solicitudes'); // Redirigir a la lista de solicitudes después de crear una nueva solicitud
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Solicitar Movilización</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Secuencial de Orden:</label>
          <input
            type="text"
            value={secuencialOrden}
            onChange={(e) => setSecuencialOrden(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Fecha de Viaje:</label>
          <input
            type="date"
            value={fechaViaje}
            onChange={(e) => setFechaViaje(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Hora de Ida:</label>
          <input
            type="time"
            value={horaIda}
            onChange={(e) => setHoraIda(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Hora de Regreso:</label>
          <input
            type="time"
            value={horaRegreso}
            onChange={(e) => setHoraRegreso(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Crear Solicitud
          </button>
        </div>
      </form>
    </div>
  );
};

export default SolicitarMovilizacion;
