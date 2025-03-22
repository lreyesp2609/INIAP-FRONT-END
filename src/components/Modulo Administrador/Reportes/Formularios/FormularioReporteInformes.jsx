import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import API_URL from '../../../../Config';
import { DatePicker, notification } from 'antd';
import moment from 'moment';

const FormularioReporteInformes = ({ empleados, provincias, idUsuario }) => {
    const [empleadoInput, setEmpleadoInput] = useState("");
    const [empleadosSeleccionados, setEmpleadosSeleccionados] = useState([]);
    const [ciudades, setCiudades] = useState([]);
    const [selectedProvincia, setSelectedProvincia] = useState('');
    const [selectedCiudad, setSelectedCiudad] = useState('');
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

    const handleProvinciaChange = (e) => {
        const provincia = e.target.value;
        setSelectedProvincia(provincia);
        const selectedProvinciaData = provincias.find((p) => p.Provincia === provincia);
        setCiudades(selectedProvinciaData ? selectedProvinciaData.Ciudades : []);
        setSelectedCiudad('');
    };

    const handleGenerarReporteInformes = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Token no encontrado');

            const fechaInicioFormatted = fechaInicio
                ? fechaInicio.format("YYYY-MM-DD")
                : "2022-01-01";

            const fechaFinFormatted = fechaFin
                ? fechaFin.format("YYYY-MM-DD")
                : fechaActual;

            let lugar = '';

            if (selectedCiudad && selectedProvincia) {
                lugar = `${selectedCiudad}-${selectedProvincia}`;
            }

            // Construir el formData con las fechas y otros filtros
            const formData = new FormData();
            formData.append('fecha_inicio', fechaInicioFormatted || '');
            formData.append('fecha_fin', fechaFinFormatted || '');
            empleadosSeleccionados.forEach((empleado) => formData.append('empleados', empleado));
            formData.append('lugar', lugar || '');


            const response = await fetch(`${API_URL}/Reportes/reporte_informes/${idUsuario}/`, {
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
            <h2 className="text-xl sm:text-2xl font-bold mb-4">Informes de Viaje</h2>

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

            {/* Selección de ruta */}
            <div className="space-y-4 sm:space-y-0 sm:flex sm:space-x-4 mt-4">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Lugar de Servicio</label>
                    <div className="space-y-4 sm:space-y-0 sm:flex sm:space-x-4 mt-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700">Provincia</label>

                            <select
                                value={selectedProvincia}
                                onChange={handleProvinciaChange}
                                className="block w-full p-2 border"
                            >
                                <option value="">Seleccione una provincia</option>
                                {provincias.map((provincia) => (
                                    <option key={provincia.Provincia} value={provincia.Provincia}>
                                        {provincia.Provincia}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700">Ciudad</label>
                            <select
                                value={selectedCiudad}
                                onChange={(e) => setSelectedCiudad(e.target.value)}
                                className="block w-full p-2 border"
                                disabled={!selectedProvincia}
                            >
                                <option value="">Seleccione una ciudad</option>
                                {ciudades.map((ciudad) => (
                                    <option key={ciudad} value={ciudad}>
                                        {ciudad}
                                    </option>
                                ))}
                            </select>
                        </div>
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
                        handleGenerarReporteInformes({
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

export default FormularioReporteInformes;
