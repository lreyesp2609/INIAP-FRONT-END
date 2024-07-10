import React from "react";
import { FaEdit } from "react-icons/fa";

const TablaLicencias = ({ licencias, onEditLicencia, userId }) => {
  const handleEditClick = (licencia) => {
    onEditLicencia(licencia);
  };

  return (
    <div className="w-full">
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Tipo de Licencia</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Observación</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {licencias.map((licencia, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-600">{licencia.tipo_licencia}</td>
                <td className="px-4 py-2 text-sm text-gray-600">{licencia.observacion}</td>
                <td className="px-4 py-2 text-sm text-gray-600 flex space-x-2">
                  <button
                    className="p-2 bg-blue-500 text-white rounded-full"
                    title="Editar licencia"
                    onClick={() => handleEditClick(licencia)}
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
        {licencias.map((licencia, index) => (
          <div key={index} className="bg-white p-4 border rounded shadow-md">
            <div className="text-sm font-medium text-gray-700">Tipo de Licencia:</div>
            <div className="text-sm text-gray-600">{licencia.tipo_licencia}</div>
            <div className="text-sm font-medium text-gray-700">Observación:</div>
            <div className="text-sm text-gray-600">{licencia.observacion}</div>
            <div className="mt-2 flex space-x-2">
              <button
                className="p-2 bg-blue-500 text-white rounded-full"
                title="Editar licencia"
                onClick={() => handleEditClick(licencia)}
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

export default TablaLicencias;
