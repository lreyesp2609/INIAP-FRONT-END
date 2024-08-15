import React, { useState, useEffect } from 'react';
import { notification } from 'antd';
import API_URL from '../../../Config';

const Reportes = () => {
  const [conductores, setConductores] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState('');
  const [conductorSeleccionado, setConductorSeleccionado] = useState('');
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState('');
  const [error, setError] = useState(null);

  const storedUser = JSON.parse(localStorage.getItem('user'));
  const idUsuario = storedUser?.usuario?.id_usuario;

  useEffect(() => {
    fetchVehiculos();
    fetchConductores();
  }, []);

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
      notification.error({
        message: 'Error',
        description: 'No se pudo obtener la lista de vehículos.',
        placement: 'topRight',
      });
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
      notification.error({
        message: 'Error',
        description: 'No se pudo obtener la lista de conductores.',
        placement: 'topRight',
      });
      console.error('Error fetching conductores:', error);
    }
  };

  const handleGenerarReporte = async () => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('fecha_inicio', fechaInicio);
      formData.append('fecha_fin', fechaFin);
      formData.append('empleado', empleadoSeleccionado);
      formData.append('conductor', conductorSeleccionado);
      formData.append('vehiculo', vehiculoSeleccionado);
  
      const response = await axios.post(`${API_URL}/Reportes/reporte_ordenes/${idUsuario}/`, formData, {
        headers: {
          Authorization: `${token}`,
          'Content-Type': 'multipart/form-data'
        },
        responseType: 'blob'
      });
  
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      window.open(url, '_blank');

      notification.success({
        message: 'Éxito',
        description: 'Reporte generado exitosamente.',
        placement: 'topRight',
      });
    } catch (error) {
      notification.error({
        message: 'Error',
        description: error.message || 'Ha ocurrido un error al generar el reporte.',
        placement: 'topRight',
      });
    }
  };
  
  return (
    <div className="p-4 sm:p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Generar Reportes</h2>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Empleado</label>
          <select
            value={empleadoSeleccionado}
            onChange={(e) => setEmpleadoSeleccionado(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
            <option value="">Seleccione un empleado</option>
            {conductores.map((empleado) => (
              <option key={`empleado-${empleado.id_empleado}`} value={empleado.id_empleado}>
                 {empleado.nombres} {empleado.apellidos}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Conductor</label>
          <select
            value={conductorSeleccionado}
            onChange={(e) => setConductorSeleccionado(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
            <option value="">Seleccione un conductor</option>
            {conductores.map((conductor) => (
              <option key={`conductor-${conductor.id_empleado}`} value={conductor.id_empleado}>
                {conductor.nombres} {conductor.apellidos}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Vehículo</label>
          <select
            value={vehiculoSeleccionado}
            onChange={(e) => setVehiculoSeleccionado(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
            <option value="">Seleccione un vehículo</option>
            {vehiculos.map((vehiculo) => (
              <option key={`vehiculo-${vehiculo.id_vehiculo}`} value={vehiculo.id_vehiculo}>
                {vehiculo.placa}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Fecha desde</label>
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Fecha hasta</label>
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <button
          onClick={handleGenerarReporte}
          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Generar Reporte
        </button>
      </div>
    </div>
  );
};

export default Reportes;
