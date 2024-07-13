import React from "react";
import { FaEdit } from "react-icons/fa";

const TablaOrdenes = ({ ordenes, userId, fetchOrdenes, onEditOrden }) => {
  const handleDeshabilitar = async () => {
    await fetchOrdenes(userId);
  };

  const handleEditClick = (orden) => {
    onEditOrden(orden);
  };

  return (
    <div className="w-full">
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">ID</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Motivo</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Descripción</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ordenes.map((orden, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-600">{orden.id_motivo}</td>
                <td className="px-4 py-2 text-sm text-gray-600">{orden.nombre_motivo}</td>
                <td className="px-4 py-2 text-sm text-gray-600">{orden.descripcion_motivo}</td>
                <td className="px-4 py-2 text-sm text-gray-600 flex space-x-2">
                  <button
                    className="p-2 bg-blue-500 text-white rounded-full"
                    title="Editar orden"
                    onClick={() => handleEditClick(orden)}
                  >
                    <FaEdit />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="block md:hidden">
        {ordenes.map((orden, index) => (
          <div key={index} className="bg-white shadow-md rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-700"><strong>ID:</strong> {orden.id_motivo}</p>
            <p className="text-sm text-gray-700"><strong>Motivo:</strong> {orden.nombre_motivo}</p>
            <p className="text-sm text-gray-700"><strong>Descripción:</strong> {orden.descripcion_motivo}</p>
            <div className="flex space-x-2">
              <button
                className="p-2 bg-blue-500 text-white rounded-full"
                title="Editar orden"
                onClick={() => handleEditClick(orden)}
              >
                <FaEdit />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TablaOrdenes;
