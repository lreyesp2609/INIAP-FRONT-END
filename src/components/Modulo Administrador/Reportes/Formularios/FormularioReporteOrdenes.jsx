import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { notification } from 'antd';
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import API_URL from '../../../../Config';

const FormularioReporte = ({ rutas, vehiculos, conductores, empleados, idUsuario }) => {
    const [empleadoInput, setEmpleadoInput] = useState("");
    const [empleadosSeleccionados, setEmpleadosSeleccionados] = useState([]);
    const [conductorInput, setConductorInput] = useState("");
    const [conductoresSeleccionados, setConductoresSeleccionados] = useState([]);
    const [rutaInput, setrutaInput] = useState("");
    const [rutasSeleccionadas, setRutasSeleccionadas] = useState([]);
    const [vehiculoInput, setVehiculoInput] = useState("");
    const [vehiculosSeleccionados, setVehiculosSeleccionados] = useState([]);
    const [estadoOrden, setEstadoOrden] = useState(0);
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

    const handleAddConductor = () => {
        if (conductorInput && !conductoresSeleccionados.includes(conductorInput)) {
            setConductoresSeleccionados([...conductoresSeleccionados, conductorInput]);
            setConductorInput("");
        }
    };

    const handleRemoveConductor = (index) => {
        const nuevosConductores = conductoresSeleccionados.filter((_, i) => i !== index);
        setConductoresSeleccionados(nuevosConductores);
    };

    const handleAddRuta = () => {
        if (rutaInput && !rutasSeleccionadas.includes(rutaInput)) {
            setRutasSeleccionadas([...rutasSeleccionadas, rutaInput]);
            setrutaInput("");
        }
    };

    const handleRemoveRuta = (index) => {
        const nuevasRutas = rutasSeleccionadas.filter((_, i) => i !== index);
        setRutasSeleccionadas(nuevasRutas);
    };

    const handleAddVehiculo = () => {
        if (vehiculoInput && !vehiculosSeleccionados.includes(vehiculoInput)) {
            setVehiculosSeleccionados([...vehiculosSeleccionados, vehiculoInput]);
            setVehiculoInput("");
        }
    };

    const handleRemoveVehiculo = (index) => {
        const nuevosVehiculos = vehiculosSeleccionados.filter((_, i) => i !== index);
        setVehiculosSeleccionados(nuevosVehiculos);
    };

    const handleGenerarReporteOrdenes = async () => {
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
            formData.append('empleado', empleadosSeleccionados);
            formData.append('conductor', conductoresSeleccionados);
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
            <h2 className="text-xl sm:text-2xl font-bold mb-4">Órdenes de Movilización</h2>

            {/* Ruta */}
            <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    Rutas
                </label>
                <div className="flex mb-2 items-center">
                    <select
                        value={rutaInput}
                        onChange={(e) => setrutaInput(e.target.value)}
                        className="w-full p-2 border rounded"
                    >
                        <option value="">Seleccione una Ruta</option>
                        {rutas.map((r) => (
                            <option
                                key={r.id}
                                value={r.ruta_descripcion}
                            >
                                {r.ruta_descripcion}
                            </option>
                        ))}
                    </select>
                    <button
                        type="button"
                        onClick={handleAddRuta}
                        className="ml-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                    >
                        +
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {rutasSeleccionadas.map((ruta, index) => (
                        <span key={index} className="flex items-center bg-gray-200 rounded px-2 py-1">
                            {ruta}
                            <button
                                type="button"
                                onClick={() => handleRemoveRuta(index)}
                                className="ml-2 text-red-500 hover:text-red-700"
                            >
                                &times;
                            </button>
                        </span>
                    ))}
                </div>
            </div>

            {/* Vehículo */}
            <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                Vehículos
                </label>
                <div className="flex mb-2 items-center">
                    <select
                        value={vehiculoInput}
                        onChange={(e) => setVehiculoInput(e.target.value)}
                        className="w-full p-2 border rounded"
                    >
                        <option value="">Seleccione un Vehículo</option>
                        {vehiculos.map((v) => (
                            <option
                                key={v.id_vehiculo}
                                value={v.placa}
                            >
                                {v.placa}
                            </option>
                        ))}
                    </select>
                    <button
                        type="button"
                        onClick={handleAddVehiculo}
                        className="ml-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                    >
                        +
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {vehiculosSeleccionados.map((vehiculo, index) => (
                        <span key={index} className="flex items-center bg-gray-200 rounded px-2 py-1">
                            {vehiculo}
                            <button
                                type="button"
                                onClick={() => handleRemoveVehiculo(index)}
                                className="ml-2 text-red-500 hover:text-red-700"
                            >
                                &times;
                            </button>
                        </span>
                    ))}
                </div>
            </div>

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
            
            {/* Listado de conductores */}
            <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    Conductores
                </label>
                <div className="flex mb-2 items-center">
                    <select
                        value={conductorInput}
                        onChange={(e) => setConductorInput(e.target.value)}
                        className="w-full p-2 border rounded"
                    >
                        <option value="">Seleccione un conductor</option>
                        {conductores.map((c) => (
                            <option
                                key={c.id}
                                value={`${c.nombres} ${c.apellidos}`}
                            >
                                {c.nombres} {c.apellidos}
                            </option>
                        ))}
                    </select>
                    <button
                        type="button"
                        onClick={handleAddConductor}
                        className="ml-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                    >
                        +
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {conductoresSeleccionados.map((conductores, index) => (
                        <span key={index} className="flex items-center bg-gray-200 rounded px-2 py-1">
                            {conductores}
                            <button
                                type="button"
                                onClick={() => handleRemoveConductor(index)}
                                className="ml-2 text-red-500 hover:text-red-700"
                            >
                                &times;
                            </button>
                        </span>
                    ))}
                </div>
            </div>




            <div className="space-y-4 sm:space-y-0 sm:flex sm:space-x-4 mt-4">
                {/* Estado de la Orden */}
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



            {/* Botón generar reporte */}
            <div className="flex justify-end mt-4">
                <button
                    onClick={() =>
                        handleGenerarReporteOrdenes({
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

export default FormularioReporte;
