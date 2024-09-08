import React from 'react';
import { FaEdit, FaPlus } from 'react-icons/fa';

const TablaUnidades = ({ unidades, onEditUnidad }) => {
  const handleEditClick = (unidad) => {
    onEditUnidad(unidad);
  };


  return (
    <div className="w-full">
  <div className="overflow-x-auto">
    <div className="hidden md:block">
      <table className="min-w-full bg-white border border-gray-200 table-auto">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left text-xs md:text-sm font-medium text-gray-700">
              ID
            </th>
            <th className="px-4 py-2 text-left text-xs md:text-sm font-medium text-gray-700">
              Nombre de la Unidad
            </th>
            <th className="px-4 py-2 text-left text-xs md:text-sm font-medium text-gray-700">
              Siglas de la Unidad
            </th>
            <th className="px-4 py-2 text-left text-xs md:text-sm font-medium text-gray-700">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {unidades.map((unidad) => (
            <tr key={unidad.id_unidad} className="hover:bg-gray-50">
              <td className="px-4 py-2 text-xs md:text-sm text-gray-600">
                {unidad.id_unidad}
              </td>
              <td className="px-4 py-2 text-xs md:text-sm text-gray-600">
                {unidad.nombre_unidad}
              </td>
              <td className="px-4 py-2 text-xs md:text-sm text-gray-600">
                {unidad.siglas_unidad}
              </td>
              <td className="px-4 py-2 text-xs md:text-sm text-gray-600 flex space-x-2">
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
    <div className="block md:hidden">
      {unidades.map((unidad) => (
        <div
          key={unidad.id_unidad}
          className="mb-4 border border-gray-200 p-4 rounded-lg bg-white shadow-sm"
        >
          <div className="mb-2">
            <span className="font-bold">ID: </span>
            {unidad.id_unidad}
          </div>
          <div className="mb-2">
            <span className="font-bold">Nombre de la Unidad: </span>
            {unidad.nombre_unidad}
          </div>
          <div className="mb-2">
            <span className="font-bold">Siglas de la Unidad: </span>
            {unidad.siglas_unidad}
          </div>
          <div className="flex space-x-2">
            <button
              className="p-2 bg-blue-500 text-white rounded-full"
              title="Editar unidad"
              onClick={() => handleEditClick(unidad)}
            >
              <FaEdit />
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>


  );
};

export default TablaUnidades;
