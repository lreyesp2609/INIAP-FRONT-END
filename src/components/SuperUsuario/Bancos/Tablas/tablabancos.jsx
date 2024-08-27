import React from 'react';
import { FaEdit } from 'react-icons/fa';

const TablaBancos = ({ bancos, onEditBanco }) => {
  const handleEditClick = (banco) => {
    if (onEditBanco) {
      onEditBanco(banco);
    }
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
                Nombre del Banco
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {bancos.map((banco) => (
              <tr key={banco.id_banco} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-600">
                  {banco.id_banco}
                </td>
                <td className="px-4 py-2 text-sm text-gray-600">
                  {banco.nombre_banco}
                </td>
                <td className="px-4 py-2 text-sm text-gray-600 flex space-x-2">
                  <button
                    className="p-2 bg-blue-500 text-white rounded-full"
                    title="Editar banco"
                    onClick={() => handleEditClick(banco)}
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

export default TablaBancos;
