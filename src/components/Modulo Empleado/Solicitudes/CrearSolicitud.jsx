import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../../Config';

const CrearSolicitud = ({ onClose, idEmpleado }) => {
  const [motivo, setMotivo] = useState('');
  const [fechaSalida, setFechaSalida] = useState('');
  const [horaSalida, setHoraSalida] = useState('');
  const [fechaLlegada, setFechaLlegada] = useState('');
  const [horaLlegada, setHoraLlegada] = useState('');
  const [actividades, setActividades] = useState('');
  const [listadoEmpleados, setListadoEmpleados] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
  
    // Validar y ajustar las fechas
    const formattedFechaSalida = fechaSalida ? fechaSalida : null; // O ajusta según tu lógica
    const formattedFechaLlegada = fechaLlegada ? fechaLlegada : null; // O ajusta según tu lógica
  
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const idUsuario = storedUser.usuario.id_usuario;
    
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Token no encontrado');
      return;
    }
  
    try {
      const response = await fetch(`${API_URL}/Informes/crear-solicitud/${idUsuario}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
        body: JSON.stringify({
          motivo_movilizacion: motivo,
          fecha_salida_solicitud: formattedFechaSalida, // Enviar la fecha formateada
          hora_salida_solicitud: horaSalida,
          fecha_llegada_solicitud: formattedFechaLlegada, // Enviar la fecha formateada
          hora_llegada_solicitud: horaLlegada,
          descripcion_actividades: actividades,
          listado_empleado: listadoEmpleados,
          id_empleado: idEmpleado,
        }),
      });
  
      if (response.ok) {
        onClose();
        navigate('/menu-empleados'); // Redirigir a la lista de solicitudes
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Error al crear la solicitud');
      }
    } catch (error) {
      setError('Error al crear la solicitud: ' + error.message);
    }
  };
  
  

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Nueva Solicitud</h2>
      {error && <div className="mb-4 text-red-500">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Motivo Movilización</label>
          <input
            type="text"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Fecha Salida</label>
          <input
            type="date"
            value={fechaSalida}
            onChange={(e) => setFechaSalida(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Hora Salida</label>
          <input
            type="time"
            value={horaSalida}
            onChange={(e) => setHoraSalida(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Fecha Llegada</label>
          <input
            type="date"
            value={fechaLlegada}
            onChange={(e) => setFechaLlegada(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Hora Llegada</label>
          <input
            type="time"
            value={horaLlegada}
            onChange={(e) => setHoraLlegada(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Descripción Actividades</label>
          <textarea
            value={actividades}
            onChange={(e) => setActividades(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Listado Empleados</label>
          <textarea
            value={listadoEmpleados}
            onChange={(e) => setListadoEmpleados(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            required
          ></textarea>
        </div>
        <div className="flex justify-between">
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Enviar
          </button>
          <button type="button" onClick={onClose} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrearSolicitud;
