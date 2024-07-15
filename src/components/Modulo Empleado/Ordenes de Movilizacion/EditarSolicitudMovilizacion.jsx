import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API_URL from '../../../Config';
import { notification } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment-timezone';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'react-bootstrap';

const EditarSolicitudMovilizacion = ({ onClose }) => {
  const navigate = useNavigate();
  const { idUsuario, idOrden } = useParams(); // Obtener los parámetros de la URL

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

  useEffect(() => {
    fetchDetallesOrden();
    fetchConductores();
    fetchVehiculos();
  }, []);

  const fetchDetallesOrden = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/OrdenesMovilizacion/detalle-orden/${idUsuario}/${idOrden}/`, {
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
        fecha_viaje: moment(data.fecha_viaje).format('YYYY-MM-DD'), // Formatear fecha según necesidad
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
      console.error('Error fetching conductors:', error);
    }
  };

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
      console.error('Error fetching vehicles:', error);
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

    if (!token) {
      setError('Token no encontrado');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/OrdenesMovilizacion/editar-orden/${idOrden}/`, {
        method: 'PUT',
        headers: {
          Authorization: `${token}`,
          'Content-Type': 'application/json', // Asegúrate de que el servidor espere JSON
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        notification.success({
          message: 'Éxito',
          description: data.mensaje || 'Orden de movilización actualizada exitosamente.',
          placement: 'topRight',
        });
        navigate('/ruta-a-lista-de-solicitudes'); // Reemplazar con la ruta adecuada
      } else {
        const errorMessage = await response.text();
        throw new Error(`Error al editar la solicitud: ${errorMessage}`);
      }
    } catch (error) {
      notification.error({
        message: 'Error',
        description: error.message || 'Ha ocurrido un error al editar la solicitud.',
        placement: 'topRight',
      });
    }
  };

  const handleCancel = () => {
    navigate('/ruta-a-lista-de-solicitudes'); // Reemplazar con la ruta adecuada
  };

  return (
    <div className="w-full flex justify-center">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-5xl">
        <h2 className="text-2xl font-bold mb-4 text-center">Editar Solicitud de Movilización</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form id="editarSolicitudForm" onSubmit={handleSubmit}>
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
                readOnly // Campo no editable
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

          <div className="mt-8 flex justify-end">
            <button
              type="button"
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
