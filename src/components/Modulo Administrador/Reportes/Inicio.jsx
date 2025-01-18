import React, { useState, useEffect } from 'react';
import { notification } from 'antd';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import API_URL from '../../../Config';
import FormularioReporteOrdenes from './Formularios/FormularioReporteOrdenes';

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
      <h2 className="text-xl sm:text-2xl font-bold mb-4">Generar Reportes</h2>
      <FormularioReporteOrdenes
        rutas={rutas}
        vehiculos={vehiculos}
        conductores={conductores}
        selectedRuta={selectedRuta}
        setSelectedRuta={setSelectedRuta}
        vehiculoSeleccionado={vehiculoSeleccionado}
        setVehiculoSeleccionado={setVehiculoSeleccionado}
        empleadoSeleccionado={empleadoSeleccionado}
        setEmpleadoSeleccionado={setEmpleadoSeleccionado}
        conductorSeleccionado={conductorSeleccionado}
        setConductorSeleccionado={setConductorSeleccionado}
        estadoOrden={estadoOrden}
        setEstadoOrden={setEstadoOrden}
        selectedYearInicio={selectedYearInicio}
        setSelectedYearInicio={setSelectedYearInicio}
        selectedMonthInicio={selectedMonthInicio}
        setSelectedMonthInicio={setSelectedMonthInicio}
        selectedDayInicio={selectedDayInicio}
        setSelectedDayInicio={setSelectedDayInicio}
        selectedYearFin={selectedYearFin}
        setSelectedYearFin={setSelectedYearFin}
        selectedMonthFin={selectedMonthFin}
        setSelectedMonthFin={setSelectedMonthFin}
        selectedDayFin={selectedDayFin}
        setSelectedDayFin={setSelectedDayFin}
        handleYearChangeInicio={(e) => setSelectedYearInicio(e.target.value)}
        handleMonthChangeInicio={(e) => setSelectedMonthInicio(e.target.value)}
        handleDayChangeInicio={(e) => setSelectedDayInicio(e.target.value)}
        handleYearChangeFin={(e) => setSelectedYearFin(e.target.value)}
        handleMonthChangeFin={(e) => setSelectedMonthFin(e.target.value)}
        handleDayChangeFin={(e) => setSelectedDayFin(e.target.value)}
        filterYears={filterYears}
        filterMonths={filterMonths}
        daysInicio={daysInicio}
        daysFin={daysFin}
        handleGenerarReporte={handleGenerarReporte}
      />
    </div>

  );
};

export default Reportes;
