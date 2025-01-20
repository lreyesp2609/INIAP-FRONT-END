import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import API_URL from '../../../../Config';
import { notification } from 'antd';

const FormularioReporteFacturas = ({ empleados, idUsuario }) => {
    const [empleadoInput, setEmpleadoInput] = useState("");
    const [empleadosSeleccionados, setEmpleadosSeleccionados] = useState([]);
    const [montoMinimo, setMontoMinimo] = useState("");
    const [montoMaximo, setMontoMaximo] = useState("");

    const [selectedYearInicio, setSelectedYearInicio] = useState('');
    const [selectedMonthInicio, setSelectedMonthInicio] = useState('');
    const [selectedDayInicio, setSelectedDayInicio] = useState('');
    const [selectedYearFin, setSelectedYearFin] = useState('');
    const [selectedMonthFin, setSelectedMonthFin] = useState('');
    const [selectedDayFin, setSelectedDayFin] = useState('');
    const [daysInicio, setDaysInicio] = useState([]);
    const [daysFin, setDaysFin] = useState([]);

    // Obtener la fecha actual de la zona horaria de Guayaquil (Ecuador)
    const getCurrentDateInGuayaquil = () => {
        const guayaquilTime = new Date().toLocaleString("en-US", { timeZone: "America/Guayaquil" });
        return new Date(guayaquilTime);
    };

    // Obtener el año, mes y día actuales de la zona horaria de Guayaquil
    const currentDate = getCurrentDateInGuayaquil();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;  // Los meses en JavaScript empiezan desde 0
    const currentDay = currentDate.getDate();

    const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    // Función para obtener los días en un mes, considerando años bisiestos
    const getDaysInMonth = (month, year) => {
        return new Date(year, month, 0).getDate();
    };

    // Función para actualizar los días disponibles según el mes y el año
    const updateDays = (setDays, year, month) => {
        if (year && month) {
            const daysInMonth = getDaysInMonth(month, year);
            let maxDay = daysInMonth;

            // Si es el año y mes actual, limitar hasta el día actual
            if (parseInt(year) === currentYear && parseInt(month) === currentMonth) {
                maxDay = currentDay;
            }

            setDays(Array.from(new Array(maxDay), (_, index) => index + 1));
        } else {
            setDays([]);
        }
    };

    // Limitar los meses hasta el mes actual si estamos en el año actual
    const filterMonths = (year) => {
        if (parseInt(year) === currentYear) {
            return months.slice(0, currentMonth);  // Limita hasta el mes actual
        }
        return months;  // Muestra todos los meses para años anteriores
    };

    // Filtrar los años hasta el año actual
    const filterYears = () => {
        return Array.from(
            new Array(currentYear - 2021 + 1),
            (_, index) => 2022 + index
        ).filter(year => year <= currentYear);
    };

    // Efecto para actualizar los días de la fecha hasta
    useEffect(() => {
        updateDays(setDaysFin, selectedYearFin, selectedMonthFin);
    }, [selectedYearFin, selectedMonthFin]);

    // Efecto para actualizar los días de la fecha desde
    useEffect(() => {
        updateDays(setDaysInicio, selectedYearInicio, selectedMonthInicio);
    }, [selectedYearInicio, selectedMonthInicio]);


    // Funciones de cambio para las fechas
    const handleYearChangeInicio = (e) => setSelectedYearInicio(e.target.value);
    const handleMonthChangeInicio = (e) => setSelectedMonthInicio(e.target.value);
    const handleDayChangeInicio = (e) => setSelectedDayInicio(e.target.value);
    const handleYearChangeFin = (e) => setSelectedYearFin(e.target.value);
    const handleMonthChangeFin = (e) => setSelectedMonthFin(e.target.value);
    const handleDayChangeFin = (e) => setSelectedDayFin(e.target.value);


    const handleMontoChange = (e, setMonto) => {
        // Asegúrate de que el valor no contenga caracteres no deseados
        const value = e.target.value;
        if (/^\d*(\.\d{0,2})?$/.test(value)) {
            setMonto(value);
        }
    };

    const handleAddEmpleado = () => {
        if (empleadoInput && !empleadosSeleccionados.includes(empleadoInput)) {
            setEmpleadosSeleccionados([...empleadosSeleccionados, empleadoInput]);
            setEmpleadoInput("");
        }
    };

    const handleRemoveEmpleado = (index) => {
        const nuevosEmpleados = empleadosSeleccionados.filter((_, i) => i !== index);
        setEmpleadosSeleccionados(nuevosEmpleados);
    };


    const handleGenerarReporteFacturas = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Token no encontrado');
    
            let fechaInicioFormatted = null;
            let fechaFinFormatted = null;
    
            // Obtener la fecha actual en formato correcto
            const getCurrentDateFormatted = () => {
                const fecha = getCurrentDateInGuayaquil();
                const year = fecha.getFullYear();
                const month = String(fecha.getMonth() + 1).padStart(2, '0');
                const day = String(fecha.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            };
    
            // Obtener el año actual
            const getCurrentYear = () => {
                const fecha = getCurrentDateInGuayaquil();
                return fecha.getFullYear();
            };
    
            const currentYear = getCurrentYear();
            const currentDateFormatted = getCurrentDateFormatted();
    
            // Obtener el último día de un mes específico
            const getLastDayOfMonth = (year, month) => {
                return new Date(year, month, 0).getDate();
            };
    
            // Construir la fecha de inicio
            if (!selectedYearInicio) {
                // Si no se selecciona año de inicio, dejar fecha de inicio vacía
                fechaInicioFormatted = '';
            } else {
                // Año desde seleccionado
                if (selectedMonthInicio) {
                    // Si se selecciona mes
                    if (selectedDayInicio) {
                        // Año, mes y día seleccionados
                        fechaInicioFormatted = `${selectedYearInicio}-${String(selectedMonthInicio).padStart(2, '0')}-${String(selectedDayInicio).padStart(2, '0')}`;
                    } else {
                        // Solo año y mes seleccionados
                        fechaInicioFormatted = `${selectedYearInicio}-${String(selectedMonthInicio).padStart(2, '0')}-01`;
                    }
                } else {
                    // Solo año seleccionado
                    fechaInicioFormatted = `${selectedYearInicio}-01-01`;
                }
            }
    
            // Construir la fecha de fin
            if (!selectedYearFin || selectedYearFin === String(currentYear)) {
                // Si no se selecciona año de fin, establecer fecha de fin como fecha actual
                fechaFinFormatted = currentDateFormatted;
            } else {
                // Año hasta seleccionado
                if (selectedMonthFin) {
                    // Si se selecciona mes
                    if (selectedDayFin) {
                        // Año, mes y día seleccionados
                        fechaFinFormatted = `${selectedYearFin}-${String(selectedMonthFin).padStart(2, '0')}-${String(selectedDayFin).padStart(2, '0')}`;
                    } else {
                        // Solo año y mes seleccionados
                        const lastDay = getLastDayOfMonth(selectedYearFin, selectedMonthFin);
                        fechaFinFormatted = `${selectedYearFin}-${String(selectedMonthFin).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
                    }
                } else {
                    // Solo año seleccionado
                    fechaFinFormatted = `${selectedYearFin}-12-31`;
                }
            }
    
            // Si no se selecciona fecha desde y solo se selecciona año hasta
            if (!selectedYearInicio && selectedYearFin) {
                fechaInicioFormatted = '2022-01-01'; 
            }    
            // Construir formData
            const formData = new FormData();
            formData.append('fecha_inicio', fechaInicioFormatted || '');
            formData.append('fecha_fin', fechaFinFormatted || '');
            formData.append('monto_min', montoMinimo || '');
            formData.append('monto_max', montoMaximo || '');
            empleadosSeleccionados.forEach((empleado) => formData.append('empleados', empleado));
    
            // Enviar la solicitud al servidor
            const response = await fetch(`${API_URL}/Reportes/reporte_facturas/${idUsuario}/`, {
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
                description: `Error generando el reporte: ${error.message}`,
                placement: 'topRight',
            });
        }
    };
    

    return (
        <div className="p-6 bg-gray-100 rounded-lg">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">Justificación de Gastos</h2>

           {/* Listado de empleados */}
           <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    Servidores
                </label>
                <div className="flex mb-2 items-center">
                    <select
                        value={empleadoInput}
                        onChange={(e) => setEmpleadoInput(e.target.value)}
                        className="w-full p-2 border rounded"
                    >
                        <option value="">Seleccione un empleado</option>
                        {empleados.map((emp) => (
                            <option
                                key={emp.id_empleado}
                                value={emp.id_empleado}
                            >
                                {emp.nombres} {emp.apellidos}
                            </option>
                        ))}
                    </select>
                    <button
                        type="button"
                        onClick={handleAddEmpleado}
                        className="ml-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                    >
                        +
                    </button>
                </div>
                {/* Listado de empleados */}
                <div className="flex flex-wrap gap-2">
                    {empleadosSeleccionados.map((empleadoId, index) => {
                        // Encuentra el empleado por su ID
                        const empleado = empleados.find(emp => emp.id_empleado === parseInt(empleadoId));
                        return (
                            <span key={index} className="flex items-center bg-gray-200 rounded px-2 py-1">
                                {empleado ? `${empleado.nombres} ${empleado.apellidos}` : 'Empleado no encontrado'}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveEmpleado(index)}
                                    className="ml-2 text-red-500 hover:text-red-700"
                                >
                                    &times;
                                </button>
                            </span>
                        );
                    })}
                </div>

            </div>

            {/* Fecha desde hasta */}
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
                                {filterYears().map((year) => (
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
                                {filterYears().map((year) => (
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

            {/* Monto mínimo y máximo */}
            <div className="flex space-x-4 mt-4">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Monto mínimo (USD)</label>
                    <div className="flex items-center">
                        <span className="p-2 bg-gray-200 border border-r-0 border-gray-300 rounded-l">$</span>
                        <input
                            type="text"
                            value={montoMinimo}
                            onChange={(e) => handleMontoChange(e, setMontoMinimo)}
                            placeholder="0.00"
                            className="w-full p-2 border border-gray-300 rounded-r text-right"
                        />
                    </div>
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Monto máximo (USD)</label>
                    <div className="flex items-center">
                        <span className="p-2 bg-gray-200 border border-r-0 border-gray-300 rounded-l">$</span>
                        <input
                            type="text"
                            value={montoMaximo}
                            onChange={(e) => handleMontoChange(e, setMontoMaximo)}
                            placeholder="0.00"
                            className="w-full p-2 border border-gray-300 rounded-r text-right"
                        />
                    </div>
                </div>
            </div>

            {/* Botón generar reporte */}
            <div className="flex justify-end mt-4">
                <button
                    onClick={() =>
                        handleGenerarReporteFacturas({
                        })
                    }
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                    <FontAwesomeIcon icon={faFilePdf} /> Generar Reporte
                </button>
            </div>
        </div>
    );
};

export default FormularioReporteFacturas;
