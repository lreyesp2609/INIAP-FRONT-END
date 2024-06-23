import React from 'react';

const TablaVehiculos = ({ vehiculos, handleEditVehiculo }) => {
  return (
    <div className="w-full">
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Placa</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Modelo</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Marca</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Color Primario</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Año Fabricación</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {vehiculos.map((vehiculo, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-600">{vehiculo.placa}</td>
                <td className="px-4 py-2 text-sm text-gray-600">{vehiculo.modelo}</td>
                <td className="px-4 py-2 text-sm text-gray-600">{vehiculo.marca}</td>
                <td className="px-4 py-2 text-sm text-gray-600">{vehiculo.color_primario}</td>
                <td className="px-4 py-2 text-sm text-gray-600">{vehiculo.anio_fabricacion}</td>
                <td className="px-4 py-2 text-sm text-gray-600">
                  <button
                    className="mt-2 bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
                    onClick={() => handleEditVehiculo(vehiculo)}
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="block md:hidden">
        {vehiculos.map((vehiculo, index) => (
          <div key={index} className="bg-white shadow-md rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-700"><strong>Placa:</strong> {vehiculo.placa}</p>
            <p className="text-sm text-gray-700"><strong>Modelo:</strong> {vehiculo.modelo}</p>
            <p className="text-sm text-gray-700"><strong>Marca:</strong> {vehiculo.marca}</p>
            <p className="text-sm text-gray-700"><strong>Color Primario:</strong> {vehiculo.color_primario}</p>
            <p className="text-sm text-gray-700"><strong>Año Fabricación:</strong> {vehiculo.anio_fabricacion}</p>
            <button
              className="mt-2 bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
              onClick={() => handleEditVehiculo(vehiculo)}
            >
              Editar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TablaVehiculos;
