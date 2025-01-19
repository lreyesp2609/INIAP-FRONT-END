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

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const currentDay = new Date().getDate();
    // Funciones de cambio para las fechas
    const handleYearChangeInicio = (e) => setSelectedYearInicio(e.target.value);
    const handleMonthChangeInicio = (e) => setSelectedMonthInicio(e.target.value);
    const handleDayChangeInicio = (e) => setSelectedDayInicio(e.target.value);
    const handleYearChangeFin = (e) => setSelectedYearFin(e.target.value);
    const handleMonthChangeFin = (e) => setSelectedMonthFin(e.target.value);
    const handleDayChangeFin = (e) => setSelectedDayFin(e.target.value);
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

    const filterYears = (year) => year === currentYear ? years.slice(0, -1) : years;
    const filterMonths = (year) => year === currentYear ? months.slice(0, currentMonth) : months;
    const filterDays = (month) => {
        const daysInMonth = new Date(2024, month, 0).getDate();
        return Array.from({ length: daysInMonth }, (_, i) => i + 1);
    };

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
                                key={emp.id}
                                value={`${emp.nombres} ${emp.apellidos}`}
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
                <div className="flex flex-wrap gap-2">
                    {empleadosSeleccionados.map((empleado, index) => (
                        <span key={index} className="flex items-center bg-gray-200 rounded px-2 py-1">
                            {empleado}
                            <button
                                type="button"
                                onClick={() => handleRemoveEmpleado(index)}
                                className="ml-2 text-red-500 hover:text-red-700"
                            >
                                &times;
                            </button>
                        </span>
                    ))}
                </div>
            </div>

            {/* Selección de fechas */}
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
