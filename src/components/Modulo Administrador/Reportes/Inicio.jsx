import React, { useState, useEffect } from 'react';
import { notification } from 'antd';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import API_URL from '../../../Config';

const Reportes = () => {
  const [conductores, setConductores] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState('');
  const [conductorSeleccionado, setConductorSeleccionado] = useState('');
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState('');
  const [rutas, setRutas] = useState([]);
  const [selectedRuta, setSelectedRuta] = useState('');
  const [error, setError] = useState(null);
  const [selectedYearInicio, setSelectedYearInicio] = useState('');
  const [selectedMonthInicio, setSelectedMonthInicio] = useState('');
  const [selectedDayInicio, setSelectedDayInicio] = useState('');
  const [selectedYearFin, setSelectedYearFin] = useState('');
  const [selectedMonthFin, setSelectedMonthFin] = useState('');
  const [selectedDayFin, setSelectedDayFin] = useState('');
  const [daysInicio, setDaysInicio] = useState([]);
  const [daysFin, setDaysFin] = useState([]);
  const [estadoOrden, setEstadoOrden] = useState(0);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; 
  const currentDay = new Date().getDate(); 

  const years = Array.from(new Array(currentYear - 2021), (val, index) => 2022 + index);
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ]; 

  const getDaysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
  };

  const updateDays = (setDays, year, month) => {
    if (year && month) {
      const daysInMonth = getDaysInMonth(month, year);
      const maxDay = (year === currentYear && month === currentMonth) ? currentDay : daysInMonth;
      setDays(Array.from(new Array(maxDay), (val, index) => index + 1));
    } else {
      setDays([]);
    }
  };

  useEffect(() => {
    updateDays(setDaysInicio, selectedYearInicio, selectedMonthInicio);
  }, [selectedYearInicio, selectedMonthInicio]);

  useEffect(() => {
    updateDays(setDaysFin, selectedYearFin, selectedMonthFin);
  }, [selectedYearFin, selectedMonthFin]);
  
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const idUsuario = storedUser?.usuario?.id_usuario;

  useEffect(() => {
    fetchVehiculos();
    fetchConductores();
    fetchRutas();
  }, []);

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
        if (!token) throw new Error('Token no encontrado');

        let fechaInicioFormatted = null;
        let fechaFinFormatted = null;

        if (selectedYearInicio && selectedMonthInicio && selectedDayInicio && selectedYearFin && selectedMonthFin && selectedDayFin) {
            // Si se selecciona la fecha completa para inicio y fin.
            fechaInicioFormatted = `${selectedYearInicio}-${selectedMonthInicio}-${selectedDayInicio}`;
            fechaFinFormatted = `${selectedYearFin}-${selectedMonthFin}-${selectedDayFin}`;
        } else if (selectedYearInicio && selectedYearFin) {
            // Si se seleccionan ambos años, desde el inicio del primer año hasta el final del segundo año.
            fechaInicioFormatted = `${selectedYearInicio}-01-01`;
            fechaFinFormatted = `${selectedYearFin}-12-31`;
        } else if (selectedYearInicio && selectedMonthInicio && !selectedDayInicio) {
            // Si se selecciona la fecha inicio sin día y no se selecciona fecha fin.
            fechaInicioFormatted = `${selectedYearInicio}-${selectedMonthInicio}-01`;
            fechaFinFormatted = new Date().toISOString().split('T')[0];
        } else if (selectedYearInicio) {
            // Si solo se selecciona el año inicio, usar todo ese año.
            fechaInicioFormatted = `${selectedYearInicio}-01-01`;
            fechaFinFormatted = `${selectedYearInicio}-12-31`;
        }

        const formData = new FormData();
        formData.append('fecha_inicio', fechaInicioFormatted || '');
        formData.append('fecha_fin', fechaFinFormatted || '');
        formData.append('empleado', empleadoSeleccionado);
        formData.append('conductor', conductorSeleccionado);
        formData.append('vehiculo', vehiculoSeleccionado);
        formData.append('ruta', selectedRuta);
        formData.append('estado', estadoOrden);

        const response = await fetch(`${API_URL}/Reportes/reporte_ordenes/${idUsuario}/`, {
            method: 'POST',
            headers: {
                'Authorization': token,
            },
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Error en la respuesta del servidor');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const popup = window.open('', '_blank');
        if (popup) {
            popup.location.href = url;
        } else {
            const errorData = await response.json();
            setError(errorData.error);
            notification.error({
              message: 'Error',
              description: errorData.error,
            });
        }
        window.URL.revokeObjectURL(url);
    } catch (error) {
      notification.error({
          message: 'Error',
          description: `Error generando el reporte: ${error.message.replace(/^\{.*"error":\s*"/, '').replace(/"\}$/, '')}`,
          placement: 'topRight',
      });
    }
  };

  const handleYearChangeInicio = (e) => {
    const year = e.target.value;
    setSelectedYearInicio(year);
    setSelectedMonthInicio('');
    setSelectedDayInicio('');
  };

  const handleMonthChangeInicio = (e) => {
    const month = e.target.value;
    setSelectedMonthInicio(month);
    setSelectedDayInicio('');
  };

  const handleDayChangeInicio = (e) => {
    setSelectedDayInicio(e.target.value);
  };

  const handleYearChangeFin = (e) => {
    const year = e.target.value;
    setSelectedYearFin(year);
    setSelectedMonthFin('');
    setSelectedDayFin('');
  };

  const handleMonthChangeFin = (e) => {
    const month = e.target.value;
    setSelectedMonthFin(month);
    setSelectedDayFin('');
  };

  const handleDayChangeFin = (e) => {
    setSelectedDayFin(e.target.value);
  };

  const filterYears = (year) => year === currentYear ? years.slice(0, -1) : years;
  const filterMonths = (year) => year === currentYear ? months.slice(0, currentMonth) : months;

  return (
    <div className="p-4 mt-16">
  <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
    <h2 className="text-xl sm:text-2xl font-bold">Generar Reportes</h2>
  </div>

  <div className="mb-6 border-2 border-gray-600 rounded-lg p-4">
    <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
      <h2 className="text-xl sm:text-2xl font-bold">Ordenes de Movilización</h2>
    </div>

    <div className="space-y-4 sm:space-y-0 sm:flex sm:space-x-4">
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700">Ruta</label>
        <select
          name="lugar_origen_destino_movilizacion"
          value={selectedRuta}
          onChange={(e) => setSelectedRuta(e.target.value)}
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

      <div className="flex-1">
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
    </div>

    <div className="space-y-4 sm:space-y-0 sm:flex sm:space-x-4 mt-4">
      <div className="flex-1">
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

      <div className="flex-1">
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
    </div>

    <div className="space-y-4 sm:space-y-0 sm:flex sm:space-x-4 mt-4">
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700">Estado de la Orden</label>
        <div className="flex flex-wrap sm:flex-nowrap items-center">
          <label className="inline-flex items-center ml-4">
            <input
              type="radio"
              value={0}
              checked={estadoOrden === 0}
              onChange={() => setEstadoOrden(0)}
              className="form-radio"
            />
            <span className="ml-2">Ambos</span>
          </label>
          <label className="inline-flex items-center ml-4">
            <input
              type="radio"
              value={1}
              checked={estadoOrden === 1}
              onChange={() => setEstadoOrden(1)}
              className="form-radio"
            />
            <span className="ml-2">Aprobada</span>
          </label>
          <label className="inline-flex items-center ml-4">
            <input
              type="radio"
              value={2}
              checked={estadoOrden === 2}
              onChange={() => setEstadoOrden(2)}
              className="form-radio"
            />
            <span className="ml-2">Rechazada</span>
          </label>
        </div>
      </div>
    </div>

    <div className="space-y-4 sm:space-y-0 sm:flex sm:space-x-4 mt-4">
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700">Fecha desde</label>
        <div className="space-y-4 sm:space-y-0 sm:flex sm:space-x-4 mt-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Año</label>
            <select
              value={selectedYearInicio}
              onChange={handleYearChangeInicio}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecciona un año</option>
              {filterYears(selectedYearInicio).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Mes</label>
            <select
              value={selectedMonthInicio}
              onChange={handleMonthChangeInicio}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!selectedYearInicio}
            >
              <option value="">Selecciona un mes</option>
              {filterMonths(selectedYearInicio).map((month, index) => (
                <option key={index} value={index + 1}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Día</label>
            <select
              value={selectedDayInicio}
              onChange={handleDayChangeInicio}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!selectedMonthInicio}
            >
              <option value="">Selecciona un día</option>
              {daysInicio.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700">Fecha hasta</label>
        <div className="space-y-4 sm:space-y-0 sm:flex sm:space-x-4 mt-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Año</label>
            <select
              value={selectedYearFin}
              onChange={handleYearChangeFin}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecciona un año</option>
              {filterYears(selectedYearFin).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Mes</label>
            <select
              value={selectedMonthFin}
              onChange={handleMonthChangeFin}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!selectedYearFin}
            >
              <option value="">Selecciona un mes</option>
              {filterMonths(selectedYearFin).map((month, index) => (
                <option key={index} value={index + 1}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Día</label>
            <select
              value={selectedDayFin}
              onChange={handleDayChangeFin}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!selectedMonthFin}
            >
              <option value="">Selecciona un día</option>
              {daysFin.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
    <div className="flex justify-end mt-4">
    <button
      className="w-full
      bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 border-b-4 border-blue-300 
      hover:border-blue-700 rounded
      mt-2 md:mt-0 md:ml-2"      
      onClick={handleGenerarReporte}
    >
     <FontAwesomeIcon icon={faFilePdf} /> Generar Reporte
    </button>
  </div>
  </div>

  
  <br></br>

<div className="mb-6 border-2 border-gray-600 rounded-lg p-4">
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-2xl font-bold">Guías de Viaje</h2>
  </div>
</div>
</div>
     
  );
};

export default Reportes;
