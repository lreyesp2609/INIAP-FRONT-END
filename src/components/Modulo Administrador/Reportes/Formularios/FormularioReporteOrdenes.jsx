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
        const vehiculoSeleccionado = vehiculos.find(v => v.placa === vehiculoInput);
        if (vehiculoSeleccionado && !vehiculosSeleccionados.includes(vehiculoSeleccionado.id_vehiculo)) {
            setVehiculosSeleccionados([...vehiculosSeleccionados, vehiculoSeleccionado.id_vehiculo]);
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
    
            // Construir el formData con las fechas y otros filtros
            const formData = new FormData();
            formData.append('fecha_inicio', fechaInicioFormatted || '');
            formData.append('fecha_fin', fechaFinFormatted || '');
    
            empleadosSeleccionados.forEach((empleado) => formData.append('empleados', empleado));
            conductoresSeleccionados.forEach((conductor) => formData.append('conductores', conductor));
            vehiculosSeleccionados.forEach((vehiculo) => formData.append('vehiculos', vehiculo));
            rutasSeleccionadas.forEach((ruta) => formData.append('rutas', ruta));
            formData.append('estado', estadoOrden);
    
            // Enviar solicitud al servidor
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
                description: `Error generando el reporte: ${error.message}`,
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
                                key={r.id_ruta_movilizacion}
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
                    {vehiculosSeleccionados.map((idVehiculo, index) => {
                        const vehiculo = vehiculos.find(v => v.id_vehiculo === idVehiculo);
                        return (
                            <span key={index} className="flex items-center bg-gray-200 rounded px-2 py-1">
                                {vehiculo ? vehiculo.placa : 'Vehículo no encontrado'}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveVehiculo(index)}
                                    className="ml-2 text-red-500 hover:text-red-700"
                                >
                                    &times;
                                </button>
                            </span>
                        );
                    })}
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
                                key={c.id_empleado}
                                value={c.id_empleado}
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
                {/* Listado de conductores */}
                <div className="flex flex-wrap gap-2">
                    {conductoresSeleccionados.map((conductorId, index) => {
                        // Encuentra el conductor por su ID
                        const conductor = conductores.find(c => c.id_empleado === parseInt(conductorId));
                        return (
                            <span key={index} className="flex items-center bg-gray-200 rounded px-2 py-1">
                                {conductor ? `${conductor.nombres} ${conductor.apellidos}` : 'Conductor no encontrado'}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveConductor(index)}
                                    className="ml-2 text-red-500 hover:text-red-700"
                                >
                                    &times;
                                </button>
                            </span>
                        );
                    })}
                </div>

            </div>

            {/* Estado de la Orden */}
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
