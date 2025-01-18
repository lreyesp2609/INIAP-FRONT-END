import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";

const FormularioReporte = ({
    rutas,
    vehiculos,
    conductores,
    selectedRuta,
    setSelectedRuta,
    vehiculoSeleccionado,
    setVehiculoSeleccionado,
    empleadoSeleccionado,
    setEmpleadoSeleccionado,
    conductorSeleccionado,
    setConductorSeleccionado,
    estadoOrden,
    setEstadoOrden,
    selectedYearInicio,
    setSelectedYearInicio,
    selectedMonthInicio,
    setSelectedMonthInicio,
    selectedDayInicio,
    setSelectedDayInicio,
    selectedYearFin,
    setSelectedYearFin,
    selectedMonthFin,
    setSelectedMonthFin,
    selectedDayFin,
    setSelectedDayFin,
    handleYearChangeInicio,
    handleMonthChangeInicio,
    handleDayChangeInicio,
    handleYearChangeFin,
    handleMonthChangeFin,
    handleDayChangeFin,
    filterYears,
    filterMonths,
    daysInicio,
    daysFin,
    handleGenerarReporte,
}) => {
    return (
        <div>
            <h2 className="text-xl sm:text-2xl font-bold mb-4">Órdenes de Movilización</h2>

            <div className="space-y-4 sm:space-y-0 sm:flex sm:space-x-4">
                {/* Ruta */}
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

                {/* Vehículo */}
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
                {/* Empleado */}
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

                {/* Conductor */}
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


            <div className="flex justify-end mt-4">
                <button
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 border-b-4 border-blue-300 hover:border-blue-700 rounded"
                    onClick={handleGenerarReporte}
                >
                    <FontAwesomeIcon icon={faFilePdf} /> Generar Reporte
                </button>
            </div>
        </div>
    );
};

export default FormularioReporte;
