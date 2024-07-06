import React from "react";
import { FaEdit, FaPlus } from "react-icons/fa";

const TablaEstaciones = ({
  currentItems,
  onEditEstacion,
  onAgregarUnidades,
}) => {
  const handleEditClick = (estacion) => {
    onEditEstacion(estacion);
  };

  const handleAgregarUnidadesClick = (estacion) => {
    onAgregarUnidades(estacion);
  };

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                ID
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Nombre de la Estación
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Siglas
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                RUC
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Dirección
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Teléfono
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((estacion) => (
              <tr key={estacion.id_estacion} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-600">
                  {estacion.id_estacion}
                </td>
                <td className="px-4 py-2 text-sm text-gray-600">
                  {estacion.nombre_estacion}
                </td>
                <td className="px-4 py-2 text-sm text-gray-600">
                  {estacion.siglas_estacion}
                </td>
                <td className="px-4 py-2 text-sm text-gray-600">
                  {estacion.ruc}
                </td>
                <td className="px-4 py-2 text-sm text-gray-600">
                  {estacion.direccion}
                </td>
                <td className="px-4 py-2 text-sm text-gray-600">
                  {estacion.telefono}
                </td>
                <td className="px-4 py-2 text-sm text-gray-600 flex space-x-2">
                  <button
                    className="p-2 bg-blue-500 text-white rounded-full"
                    title="Editar estación"
                    onClick={() => handleEditClick(estacion)}
                  >
                    <FaEdit />
                  </button>
                  <div className="flex items-center">
                    <button
                      className="p-2 bg-green-500 text-white rounded-full"
                      title="Agregar unidades"
                      onClick={() => handleAgregarUnidadesClick(estacion)}
                    >
                      <FaPlus />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablaEstaciones;