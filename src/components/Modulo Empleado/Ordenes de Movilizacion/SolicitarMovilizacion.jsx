import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../../Config';
import { notification, Tooltip } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { QuestionCircleOutlined} from '@ant-design/icons';
import moment from 'moment-timezone';


const SolicitarMovilizacion = ({ onClose }) => {
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem('user'));
  const idEmpleado = storedUser?.usuario?.id_empleado;
  const idUsuario = storedUser?.usuario?.id_usuario;

  const nowInQuevedo = moment.tz('America/Guayaquil');
  const currentDate = nowInQuevedo.format('YYYY-MM-DD');
  const currentTime = nowInQuevedo.format('HH:mm');

  const [formData, setFormData] = useState({
    secuencial_orden_movilizacion: '0000', 
    motivo_movilizacion: '',
    lugar_origen_destino_movilizacion: 'Mocache - Quevedo',
    duracion_movilizacion: '00:30',
    id_conductor: '',
    id_vehiculo: '',
    fecha_viaje: currentDate,
    hora_ida: currentTime, 
    hora_regreso: '',
    estado_movilizacion: 'Pendiente',
    id_empleado: idEmpleado,
  });

  const [vehiculos, setVehiculos] = useState([]);
  const [conductores, setConductores] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVehiculos();
    fetchConductores();
  }, []);

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

  const fetchVehiculos = async () => {
    try {
      const token = localStorage.getItem('token');  
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
      console.error('Error fetching vehiculos:', error);
    }
  };

  const fetchConductores = async () => {
    try {
      const token = localStorage.getItem('token');
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
      console.error('Error fetching conductores:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const idEmpleado = storedUser?.usuario?.id_empleado;
    const idUsuario = storedUser?.usuario?.id_usuario;

    if (!token) {
        setError('Token no encontrado');
        return;
    }

    const formDataObj = new FormData();
    formDataObj.append('secuencial_orden_movilizacion', formData.secuencial_orden_movilizacion);
    formDataObj.append('motivo_movilizacion', formData.motivo_movilizacion);
    formDataObj.append('lugar_origen_destino_movilizacion', formData.lugar_origen_destino_movilizacion);
    formDataObj.append('duracion_movilizacion', formData.duracion_movilizacion);
    formDataObj.append('id_conductor', formData.id_conductor);
    formDataObj.append('id_vehiculo', formData.id_vehiculo);
    formDataObj.append('fecha_viaje', formData.fecha_viaje);
    formDataObj.append('hora_ida', formData.hora_ida);
    formDataObj.append('hora_regreso', formData.hora_regreso);
    formDataObj.append('estado_movilizacion', formData.estado_movilizacion);
    formDataObj.append('id_empleado', idEmpleado);  

    try {
        const response = await fetch(`${API_URL}/OrdenesMovilizacion/crear-orden/${idUsuario}/`, {
            method: 'POST',
            headers: {
                Authorization: `${token}`,
            },
            body: formDataObj,
        });

        if (response.ok) {
            const data = await response.json();
            notification.success({
                message: 'Éxito',
                description: data.message || 'Solicitud creada exitosamente.',
                placement: 'topRight',
            });
            onClose();
        } else {
            const errorMessage = await response.text();
            throw new Error(`Error al crear la solicitud: ${errorMessage}`);
        }
    } catch (error) {
        notification.error({
            message: 'Error',
            description: error.message || 'Ha ocurrido un error al crear la solicitud.',
            placement: 'topRight',
        });
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-5xl">
        <h2 className="text-2xl font-bold mb-4 text-center">Solicitar Movilización</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form id="solicitudForm" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">

            <div className="mb-4 relative">
              <label className="block text-sm font-medium text-gray-700">Lugar Origen - Destino:</label>
                <div className="flex items-center">
                  <Tooltip title="Una Orden de movilización solo puede ser de Mocache a Quevedo">
                    <QuestionCircleOutlined className="text-gray-500 cursor-pointer absolute right-0 mr-2" />
                    </Tooltip>
                  <input
                    type="text"
                    name="lugar_origen_destino_movilizacion"
                    value={formData.lugar_origen_destino_movilizacion}
                    onChange={handleInputChange}
                    required
                    readOnly // Bloquea la edición del campo
                    className="w-full p-2 pl-8 pr-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
            </div>
          
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Fecha de Viaje:</label>
              <input
                type="date"
                name="fecha_viaje"
                value={formData.fecha_viaje}
                min={new Date().toISOString().split('T')[0]} // Permite ingresar solo desde la fecha actual en adelante
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
                min="00:30"
                max="02:00"
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
                readOnly  // Campo no editable
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
          <input type="hidden" name="estado_movilizacion" value={formData.estado_movilizacion} />
          <input type="hidden" name="id_empleado" value={idEmpleado} />
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

export default SolicitarMovilizacion;
