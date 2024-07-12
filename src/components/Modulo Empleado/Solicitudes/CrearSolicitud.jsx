import React, { useState, useEffect } from 'react';
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
  const [codigoSolicitud, setCodigoSolicitud] = useState('');
  const [fechaHoraPrevisualizacion, setFechaHoraPrevisualizacion] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    const formattedFechaSalida = fechaSalida ? fechaSalida : null;
    const formattedFechaLlegada = fechaLlegada ? fechaLlegada : null;

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
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          motivo_movilizacion: motivo,
          fecha_salida_solicitud: formattedFechaSalida,
          hora_salida_solicitud: horaSalida,
          fecha_llegada_solicitud: formattedFechaLlegada,
          hora_llegada_solicitud: horaLlegada,
          descripcion_actividades: actividades,
          listado_empleado: listadoEmpleados,
          id_empleado: idEmpleado,
        }),
      });

      if (response.ok) {
        onClose();
        navigate('/menu-empleados');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Error al crear la solicitud');
      }
    } catch (error) {
      setError('Error al crear la solicitud: ' + error.message);
    }
  };

  const fetchPrevisualizacion = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const idUsuario = storedUser.usuario.id_usuario;
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Token no encontrado');
        return;
      }

      const response = await fetch(`${API_URL}/Informes/previsualizar-codigo-solicitud/${idUsuario}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.previsualizacion) {
          setCodigoSolicitud(data.previsualizacion['Codigo de Solicitud'] || '');
          setFechaHoraPrevisualizacion(data.previsualizacion['Fecha y Hora de Previsualización'] || '');
        } else {
          setError('Datos de previsualización no encontrados');
        }
      } else {
        setError('Error al obtener la previsualización');
      }
    } catch (error) {
      setError('Error al obtener la previsualización: ' + error.message);
    }
  };

  useEffect(() => {
    fetchPrevisualizacion();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Crear Nueva Solicitud</h2>
      <label className="block text-gray-700 text-sm font-bold mb-2">{'\u00A0'}</label>
      {error && <div className="mb-4 text-red-500">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4 flex">
          <div className="mr-4 w-1/2">
            <label className="block text-gray-700 text-sm font-bold mb-2">Nro. SOLICITUD DE AUTORIZACIÓN PARA CUMPLIMIENTO DE SERVICIOS INSTITUCIONALES</label>
            <input
              type="text"
              value={codigoSolicitud}
              readOnly
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="w-1/2">
            <label className="block text-gray-700 text-sm font-bold mb-2">FECHA DE SOLICITUD (dd-mmm-aaa)</label>
            <label className="block text-gray-700 text-sm font-bold mb-1/2">{'\u00A0'}</label>
            <input
              type="text"
              value={fechaHoraPrevisualizacion}
              readOnly
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
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
