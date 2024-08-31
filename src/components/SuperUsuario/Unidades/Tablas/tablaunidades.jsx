import React from 'react';
import { FaEdit, FaPlus } from 'react-icons/fa';

const TablaUnidades = ({ unidades, onEditUnidad, onAddCargos }) => {
  const handleEditClick = (unidad) => {
    onEditUnidad(unidad);
  };

  const handleAddCargosClick = (unidad) => {
    onAddCargos(unidad);
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
                Nombre de la Unidad
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Siglas de la Unidad
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {unidades.map((unidad) => (
              <tr key={unidad.id_unidad} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-600">
                  {unidad.id_unidad}
                </td>
                <td className="px-4 py-2 text-sm text-gray-600">
                  {unidad.nombre_unidad}
                </td>
                <td className="px-4 py-2 text-sm text-gray-600">
                  {unidad.siglas_unidad}
                </td>
                <td className="px-4 py-2 text-sm text-gray-600 flex space-x-2">
                  <button
                    className="p-2 bg-blue-500 text-white rounded-full"
                    title="Editar unidad"
                    onClick={() => handleEditClick(unidad)}
                  >
                    <FaEdit />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablaUnidades;
