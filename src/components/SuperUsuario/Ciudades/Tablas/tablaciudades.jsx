import React from 'react';
import { FaEdit } from 'react-icons/fa';

const TablaCiudades = ({ ciudades, onEditCiudad, userId }) => {
  const handleEditClick = (ciudad) => {
    onEditCiudad(ciudad);
  };

  return (
    <div className="w-full">
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">ID Ciudad</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Ciudad</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ciudades.map((ciudad, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-600">{ciudad.id_ciudad}</td>
                <td className="px-4 py-2 text-sm text-gray-600">{ciudad.ciudad}</td>
                <td className="px-4 py-2 text-sm text-gray-600 flex space-x-2">
                  <button
                    className="p-2 bg-blue-500 text-white rounded-full"
                    title="Editar ciudad"
                    onClick={() => handleEditClick(ciudad)}
                  >
                    <FaEdit />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="md:hidden space-y-4">
        {ciudades.map((ciudad, index) => (
          <div key={index} className="bg-white p-4 border rounded shadow-md">
            <div className="text-sm font-medium text-gray-700">ID Ciudad:</div>
            <div className="text-sm text-gray-600">{ciudad.id_ciudad}</div>
            <div className="text-sm font-medium text-gray-700">Ciudad:</div>
            <div className="text-sm text-gray-600">{ciudad.ciudad}</div>
            <div className="mt-2 flex space-x-2">
              <button
                className="p-2 bg-blue-500 text-white rounded-full"
                title="Editar ciudad"
                onClick={() => handleEditClick(ciudad)}
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

export default TablaCiudades;
