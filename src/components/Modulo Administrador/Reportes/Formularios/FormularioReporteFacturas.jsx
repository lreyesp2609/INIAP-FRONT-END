import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import API_URL from '../../../../Config';
import { DatePicker, notification } from 'antd';
import moment from 'moment';


const FormularioReporteFacturas = ({ empleados, idUsuario }) => {
    const [empleadoInput, setEmpleadoInput] = useState("");
    const [empleadosSeleccionados, setEmpleadosSeleccionados] = useState([]);
    const [montoMinimo, setMontoMinimo] = useState("");
    const [montoMaximo, setMontoMaximo] = useState("");
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

    const handleGenerarReporteFacturas = async () => {
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
