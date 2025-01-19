import React, { useState } from "react";
import { FaBell, FaEdit } from "react-icons/fa";
import { FaWrench, FaHistory } from "react-icons/fa"; // Icono para historial de mantenimiento
import DeshabilitarVehiculo from "../deshabilitarvehiculo";
import FormularioGestionarAlertas from "../../Mantenimiento/Formularios/CrearEditarAlerta"; // Importar el componente

const TablaVehiculos = ({ vehiculos, userId, fetchVehiculos, onEditVehiculo, onKilometraje, onHistorialMantenimiento }) => {
  const [selectedVehiculo, setSelectedVehiculo] = useState(null);

  const handleDeshabilitar = async () => {
    await fetchVehiculos(userId);
  };

  const handleEditClick = (vehiculo, userId) => {
    onEditVehiculo(vehiculo, userId);
  };

  const handleKilometraje = (vehiculo) => {
    onKilometraje(vehiculo); // Lógica para gestionar el kilometraje o mantenimiento
  };

  const handleHistorialMantenimiento = (vehiculo) => {
    onHistorialMantenimiento(vehiculo); // Lógica para gestionar el historial de mantenimiento
  };

  const handleGestionarAlerta = (vehiculo) => {
    setSelectedVehiculo(vehiculo); // Mostrar el formulario para gestionar la alerta
  };

  const handleCancel = () => {
    setSelectedVehiculo(null); // Cerrar el formulario de alerta
  };

  return (
    <div className="w-full">
      {selectedVehiculo && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <FormularioGestionarAlertas vehiculo={selectedVehiculo} handleCancel={handleCancel} />
          </div>
        </div>
      )}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">ID</th>
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
                <td className="px-4 py-2 text-sm text-gray-600">{vehiculo.id_vehiculo}</td>
                <td className="px-4 py-2 text-sm text-gray-600">{vehiculo.placa}</td>
                <td className="px-4 py-2 text-sm text-gray-600">{vehiculo.modelo}</td>
                <td className="px-4 py-2 text-sm text-gray-600">{vehiculo.marca}</td>
                <td className="px-4 py-2 text-sm text-gray-600">{vehiculo.color_primario}</td>
                <td className="px-4 py-2 text-sm text-gray-600">{vehiculo.anio_fabricacion}</td>
                <td className="px-4 py-2 text-sm text-gray-600 flex space-x-2">
                  <button
                    className="p-2 bg-blue-500 text-white rounded-full"
                    title="Editar vehículo"
                    onClick={() => handleEditClick(vehiculo, userId)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="p-2 bg-green-500 text-white rounded-full"
                    title="Kilometraje o mantenimiento"
                    onClick={() => handleKilometraje(vehiculo)}
                  >
                    <FaWrench />
                  </button>
                  <button
                    className="p-2 bg-yellow-500 text-white rounded-full"
                    title="Historial de mantenimiento"
                    onClick={() => handleHistorialMantenimiento(vehiculo)}
                  >
                    <FaHistory />
                  </button>
                  <button
                    className="p-2 bg-orange-500 text-white rounded-full"
                    title="Gestionar Alerta"
                    onClick={() => handleGestionarAlerta(vehiculo)}
                  >
                    <FaBell />
                  </button>
                  <DeshabilitarVehiculo
                    vehiculoId={vehiculo.id_vehiculo}
                    userId={userId}
                    onDeshabilitar={handleDeshabilitar}
                    vehiculoPlaca={vehiculo.placa}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="block md:hidden">
        {vehiculos.map((vehiculo, index) => (
          <div key={index} className="bg-white shadow-md rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-700"><strong>ID:</strong> {vehiculo.id_vehiculo}</p>
            <p className="text-sm text-gray-700"><strong>Placa:</strong> {vehiculo.placa}</p>
            <p className="text-sm text-gray-700"><strong>Modelo:</strong> {vehiculo.modelo}</p>
            <p className="text-sm text-gray-700"><strong>Marca:</strong> {vehiculo.marca}</p>
            <p className="text-sm text-gray-700"><strong>Color Primario:</strong> {vehiculo.color_primario}</p>
            <p className="text-sm text-gray-700"><strong>Año Fabricación:</strong> {vehiculo.anio_fabricacion}</p>
            <div className="flex space-x-2">
              <button
                className="p-2 bg-blue-500 text-white rounded-full"
                title="Editar vehículo"
                onClick={() => handleEditClick(vehiculo, userId)}
              >
                <FaEdit />
              </button>
              <button
                className="p-2 bg-green-500 text-white rounded-full"
                title="Kilometraje o mantenimiento"
                onClick={() => handleKilometraje(vehiculo)}
              >
                <FaWrench />
              </button>
              <button
                className="p-2 bg-yellow-500 text-white rounded-full"
                title="Historial de mantenimiento"
                onClick={() => handleHistorialMantenimiento(vehiculo)}
              >
                <FaHistory />
              </button>
              <button
                className="p-2 bg-orange-500 text-white rounded-full"
                title="Gestionar Alerta"
                onClick={() => handleGestionarAlerta(vehiculo)}
              >
                <FaBell />
              </button>
              <DeshabilitarVehiculo
                vehiculoId={vehiculo.id_vehiculo}
                userId={userId}
                onDeshabilitar={handleDeshabilitar}
                vehiculoPlaca={vehiculo.placa}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TablaVehiculos;
