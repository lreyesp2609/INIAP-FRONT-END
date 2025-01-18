import React from 'react';

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
    <div className="mb-6 border-2 border-gray-600 rounded-lg p-4">
      <h2 className="text-xl sm:text-2xl font-bold">Ordenes de Movilización</h2>
      {/* Resto del formulario */}
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
            {/* Más inputs aquí */}
          </div>
        </div>
      </div>
      <button
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
        onClick={handleGenerarReporte}
      >
        Generar Reporte
      </button>
    </div>
  );
};

export default FormularioReporte;
