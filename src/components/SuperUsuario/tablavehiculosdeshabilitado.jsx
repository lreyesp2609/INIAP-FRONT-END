import React, { useState } from "react";
import { MdCarRepair } from "react-icons/md";

const TablaVehiculosDeshabilitados = ({ vehiculos, onHabilitarVehiculo }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredVehiculos = vehiculos.filter((vehiculo) =>
    vehiculo.placa.includes(searchTerm)
  );

  return (
    <div className="w-full">
      <div className="p-4 bg-white shadow-sm rounded-md mb-4">
        <input
          type="text"
          placeholder="Buscar por placa"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="overflow-x-auto">
        <div className="hidden md:block">
          <table className="min-w-full bg-white border border-gray-200 table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Placa
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Marca
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Modelo
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Año
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Color
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredVehiculos.map((vehiculo, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm text-gray-600">
                    {vehiculo.placa}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600">
                    {vehiculo.marca}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600">
                    {vehiculo.modelo}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600">
                    {vehiculo.anio_fabricacion}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600">
                    {vehiculo.color_primario}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600 flex space-x-2">
                    <button
                      onClick={() => {
                        console.log("ID del vehículo:", vehiculo.id_vehiculo);  // Depuración: verifica el id
                        onHabilitarVehiculo(vehiculo);
                      }}
                      className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600"
                      title="Habilitar vehículo"
                    >
                      <MdCarRepair />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="block md:hidden">
          {filteredVehiculos.map((vehiculo, index) => (
            <div
              key={index}
              className="mb-4 border border-gray-200 p-4 rounded-lg bg-white shadow-sm"
            >
              <div className="mb-2">
                <span className="font-bold">Placa: </span>
                {vehiculo.placa}
              </div>
              <div className="mb-2">
                <span className="font-bold">Marca: </span>
                {vehiculo.marca}
              </div>
              <div className="mb-2">
                <span className="font-bold">Modelo: </span>
                {vehiculo.modelo}
              </div>
              <div className="mb-2">
                <span className="font-bold">Año: </span>
                {vehiculo.anio_fabricacion}
              </div>
              <div className="mb-2">
                <span className="font-bold">Color: </span>
                {vehiculo.color_primario}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    console.log("ID del vehículo:", vehiculo.id_vehiculo); 
                    onHabilitarVehiculo(vehiculo);
                  }}
                  className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600"
                  title="Habilitar vehículo"
                >
                  <MdCarRepair />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TablaVehiculosDeshabilitados;
