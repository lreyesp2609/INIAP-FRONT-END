import React, { useState, useEffect } from 'react';
import API_URL from '../../../Config';
import { notification, Tooltip } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment-timezone';

const EditarSolicitudMovilizacion = ({ orderId, onClose }) => {

  const storedUser = JSON.parse(localStorage.getItem('user'));
  const idUsuario = storedUser?.usuario?.id_usuario;

  const [formData, setFormData] = useState({
    secuencial_orden_movilizacion: '',
    motivo_movilizacion: '',
    lugar_origen_destino_movilizacion: '',
    duracion_movilizacion: '',
    id_conductor: '',
    id_vehiculo: '',
    fecha_viaje: '',
    hora_ida: '',
    hora_regreso: '',
    estado_movilizacion: '',
    id_empleado: '',
  });

  const [conductores, setConductores] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [error, setError] = useState(null);
  const [rutas, setRutas] = useState([]);
  const [selectedRuta, setSelectedRuta] = useState('');
  const [horario, setHorario] = useState({});

  useEffect(() => {
    fetchDetallesOrden();
    fetchVehiculos();
    fetchHorario();
    fetchConductores();
    fetchRutas();
  }, [orderId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRutaChange = (e) => {
    const selectedRutaDescripcion = e.target.value;
    setSelectedRuta(selectedRutaDescripcion);
    setFormData({
      ...formData,
      lugar_origen_destino_movilizacion: selectedRutaDescripcion,
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hourInt = parseInt(hours, 10);
    const ampm = hourInt >= 12 ? 'pm' : 'am';
    const formattedHour = hourInt % 12 || 12;
    return `${formattedHour}:${minutes}${ampm}`;
  };



  const formatDuration = (minutes) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs}:${mins.toString().padStart(2, '0')}hrs`;
  };

  const fetchHorario = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      notification.error({
        message: 'Error',
        description: 'Token no proporcionado',
      });
      return;
    }

    try {
      const response = await fetch(`${API_URL}/OrdenesMovilizacion/ver-horario/${idUsuario}/`, {
        headers: {
          Authorization: `${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setHorario(data.horario);
      } else {
        const errorData = await response.json();
        setError(errorData.error);
        notification.error({
          message: 'Error',
          description: errorData.error,
        });
      }
    } catch (error) {
      setError(error.toString());
      notification.error({
        message: 'Error',
        description: 'Error al obtener el horario',
      });
    }
  };

  const fetchRutas = async () => {

    const token = localStorage.getItem("token");
    if (!token) {
      notification.error({
        message: 'Error',
        description: 'Token no proporcionado',
      });
      return;
    }

    try {
      const response = await fetch(`${API_URL}/OrdenesMovilizacion/listar-rutas/${idUsuario}/`, {
        headers: {
          Authorization: `${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRutas(data.rutas);
      } else {
        const errorData = await response.json();
        setError(errorData.error);
        notification.error({
          message: 'Error',
          description: errorData.error,
        });
      }
    } catch (error) {
      setError(error.toString());
      notification.error({
        message: 'Error',
        description: 'Error al obtener las rutas',
      });
    }
  };

  useEffect(() => {
    // Calcular hora de regreso cada vez que cambian la hora de ida o la duración
    if (formData.hora_ida && formData.duracion_movilizacion) {
      const [horaIdaHoras, horaIdaMinutos] = formData.hora_ida.split(':').map(Number);
      const [duracionHoras, duracionMinutos] = formData.duracion_movilizacion.split(':').map(Number);
      
      const totalMinutos = horaIdaMinutos + duracionMinutos;
      const totalHoras = horaIdaHoras + duracionHoras + Math.floor(totalMinutos / 60);
      const minutosRegreso = totalMinutos % 60;
      const horasRegreso = totalHoras % 24;

      const horaRegreso = `${String(horasRegreso).padStart(2, '0')}:${String(minutosRegreso).padStart(2, '0')}`;
      setFormData({ ...formData, hora_regreso: horaRegreso });
    }
  }, [formData.hora_ida, formData.duracion_movilizacion]);

  const fetchDetallesOrden = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const idUsuario = storedUser?.usuario?.id_usuario;

      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token no encontrado');
      if (!idUsuario) throw new Error('ID de usuario no encontrado');

      const response = await fetch(`${API_URL}/OrdenesMovilizacion/detalle-orden/${idUsuario}/${orderId}/`, {
        headers: {
          Authorization: `${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener los detalles de la orden');
      }

      const data = await response.json();
      setFormData({
        secuencial_orden_movilizacion: data.secuencial_orden_movilizacion,
        motivo_movilizacion: data.motivo_movilizacion,
        lugar_origen_destino_movilizacion: data.lugar_origen_destino_movilizacion,
        duracion_movilizacion: data.duracion_movilizacion,
        id_conductor: data.id_conductor,
        id_vehiculo: data.id_vehiculo,
        fecha_viaje: moment(data.fecha_viaje).format('YYYY-MM-DD'), 
        hora_ida: data.hora_ida,
        hora_regreso: data.hora_regreso,
        estado_movilizacion: data.estado_movilizacion,
        id_empleado: data.id_empleado,
      });
    } catch (error) {
      setError('Error al obtener los detalles de la orden');
      console.error('Error fetching order details:', error);
    }
  };

  const fetchConductores = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const idUsuario = storedUser?.usuario?.id_usuario;

      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token no encontrado');
      if (!idUsuario) throw new Error('ID de usuario no encontrado');

      const response = await fetch(`${API_URL}/Empleados/lista-empleados/${idUsuario}/`, {
        headers: {
          Authorization: `${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener conductores');
      }

      const data = await response.json();
      setConductores(data);
    } catch (error) {
      setError('Error al obtener conductores');
      console.error('Error fetching conductors:', error);
    }
  };

  const fetchVehiculos = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const idUsuario = storedUser?.usuario?.id_usuario;

      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token no encontrado');
      if (!idUsuario) throw new Error('ID de usuario no encontrado');

      const response = await fetch(`${API_URL}/Vehiculos/vehiculos/${idUsuario}/`, {
        headers: {
          Authorization: `${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener vehículos');
      }

      const data = await response.json();
      setVehiculos(data.vehiculos);
    } catch (error) {
      setError('Error al obtener vehículos');
      console.error('Error fetching vehicles:', error);
    }
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');
  
    if (!token) {
      setError('Token no encontrado');
      return;
    }
  
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('motivo_movilizacion', formData.motivo_movilizacion);
      formDataToSend.append('duracion_movilizacion', formData.duracion_movilizacion);
      formDataToSend.append('id_conductor', formData.id_conductor);
      formDataToSend.append('id_vehiculo', formData.id_vehiculo);
      formDataToSend.append('fecha_viaje', formData.fecha_viaje);
      formDataToSend.append('hora_ida', formData.hora_ida);
      formDataToSend.append('hora_regreso', formData.hora_regreso);
  
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const idUsuario = storedUser?.usuario?.id_usuario;
  
      const response = await fetch(`${API_URL}/OrdenesMovilizacion/editar-orden/${idUsuario}/${orderId}/`, {
        method: 'POST',
        headers: {
          Authorization: `${token}`,
        },
        body: formDataToSend,
      });
  
      if (response.ok) {
        const data = await response.json();
        notification.success({
          message: 'Éxito',
          description: data.mensaje || 'Orden de movilización actualizada exitosamente.',
          placement: 'topRight',
        });
        onClose();
      } else {
        const errorData = await response.json();
        setError(errorData.error);
        notification.error({
          message: 'Error',
          description: errorData.error,
        }) }
    } catch (error) {
      notification.error({
        message: 'Error',
        description: error.message || 'Ha ocurrido un error al editar la solicitud.',
        placement: 'topRight',
      });
    }
  };

  
  return (
    <div className="w-full flex justify-center">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-5xl">
        <h2 className="text-2xl font-bold mb-4 text-center">Editar Solicitud de Movilización</h2>
        
        <div>
          {Object.keys(horario).length === 0 ? (
          <p>Horario no asignado. {' '} </p> 
            ) : (
              <div>
                <p>
                  Las Órdenes de Movilización se pueden realizar desde las{' '}
                  <strong>{formatTime(horario.hora_ida_minima)}</strong> hasta las{' '}
                  <strong>{formatTime(horario.hora_llegada_maxima)}</strong>, pueden
                  tener una duración mínima de <strong>{formatDuration(horario.duracion_minima)}</strong> y durar
                  máximo <strong>{formatDuration(horario.duracion_maxima)}</strong>.{' '} 
                </p>
                <br></br>
              </div>
            )}
          </div>
        
        <form id="editarSolicitudForm" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Lugar Origen - Destino:</label>
              <select
                name="lugar_origen_destino_movilizacion"
                value={formData.lugar_origen_destino_movilizacion}
                onChange={handleRutaChange}
                required
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecciona una ruta</option>
                {rutas.map((ruta) => (
                  <option key={ruta.id} value={ruta.ruta_descripcion}>
                    {ruta.ruta_descripcion}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Fecha de Viaje:</label>
              <input
                type="date"
                name="fecha_viaje"
                value={formData.fecha_viaje}
                min={moment().tz('America/Guayaquil').format('YYYY-MM-DD')}
                onChange={handleInputChange}
                required
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Motivo de Movilización:</label>
            <input
              type="text"
              name="motivo_movilizacion"
              value={formData.motivo_movilizacion}
              onChange={handleInputChange}
              maxLength="30"
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Duración de la Movilización:</label>
              <input
                type="time"
                name="duracion_movilizacion"
                value={formData.duracion_movilizacion}
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
                readOnly
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Conductor:</label>
              <select
                name="id_conductor"
                value={formData.id_conductor}
                onChange={handleInputChange}
                required
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecciona un conductor</option>
                {conductores.map((conductor) => (
                  <option key={conductor.id_empleado} value={conductor.id_empleado}>
                    {conductor.nombres} {conductor.apellidos}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Vehículo:</label>
              <select
                name="id_vehiculo"
                value={formData.id_vehiculo}
                onChange={handleInputChange}
                required
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecciona un vehículo</option>
                {vehiculos.map((vehiculo) => (
                  <option key={vehiculo.id_vehiculo} value={vehiculo.id_vehiculo}>
                    {vehiculo.placa}
                  </option>
                ))}
              </select>
            </div>
          </div>

          
          <div className="mt-8 flex flex-col md:flex-row justify-end md:space-x-4 space-y-4 md:space-y-0">
            <button
              type="button"
              onClick={onClose}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 border-b-4 border-red-400 hover:border-red-900 rounded"
            >
              <FontAwesomeIcon icon={faTimes} className="mr-2" />
              Cancelar
            </button>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 border-b-4 border-blue-400 hover:border-blue-900 rounded"
            >
              <FontAwesomeIcon icon={faSave} className="mr-2" />
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarSolicitudMovilizacion;
