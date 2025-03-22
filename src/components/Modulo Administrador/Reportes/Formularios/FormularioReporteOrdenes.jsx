import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import API_URL from '../../../../Config';
import 'moment/locale/es';
import { DatePicker, notification } from 'antd';
import moment from 'moment';

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
    const [fechaInicio, setFechaInicio] = useState(null);
    const [fechaFin, setFechaFin] = useState(null);

    const fechaMinima = moment("2022-01-01");
    const fechaActual = moment().endOf('year').format("YYYY-MM-DD")

    const handleFechaInicioChange = (date) => {
        setFechaInicio(date ? date : null);
    };

    const handleFechaFinChange = (date) => {
        setFechaFin(date ? date : null);
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

            const fechaInicioFormatted = fechaInicio
                ? fechaInicio.format("YYYY-MM-DD")
                : "2022-01-01";

            const fechaFinFormatted = fechaFin
                ? fechaFin.format("YYYY-MM-DD")
                : fechaActual;

            // Construir formData
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

            {/* Fecha desde/hasta */}
            <div className="space-y-4 sm:space-y-0 sm:flex sm:space-x-4 mt-4">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Fecha desde</label>
                    <DatePicker
                        value={fechaInicio}
                        onChange={handleFechaInicioChange}
                        format="YYYY-MM-DD"
                        className="w-full"
                        disabledDate={(date) => date.isBefore(fechaMinima)}
                    />
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Fecha hasta</label>
                    <DatePicker
                        value={fechaFin}
                        onChange={handleFechaFinChange}
                        format="YYYY-MM-DD"
                        className="w-full"
                        disabledDate={(date) => date.isBefore(fechaMinima)}
                    />
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
