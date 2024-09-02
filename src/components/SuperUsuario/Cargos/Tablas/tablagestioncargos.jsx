import React from "react";
import { FaEdit, FaPlus } from "react-icons/fa";
const TablaGestionCargos = ({ cargos }) => {


  const handleEditClick = (cargo) => {
    onEditCargos(cargo);
  };


  return (
    <table className="min-w-full bg-white">
      <thead className="bg-gray-200">
        <tr>
          <th className="py-2 px-4 border-b">ID Cargo</th>
          <th className="py-2 px-4 border-b">Nombre del Cargo</th>
          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Acciones
          </th>
        </tr>
      </thead>
      <tbody>
        {cargos.map((cargo) => (
          <tr key={cargo.id_cargo}>
            <td className="py-2 px-4 border-b">{cargo.id_cargo}</td>
            <td className="py-2 px-4 border-b">{cargo.cargo}</td>
            <td className="px-4 py-2 text-sm text-gray-600 flex space-x-2">
                  <button
                    className="p-2 bg-blue-500 text-white rounded-full"
                    title="Editar un cargo"
                    onClick={() => handleEditClick(cargo)}
                  >
                    <FaEdit />
                  </button>
                </td>
          </tr>
          
        ))}
            
      </tbody>
    </table>
  );
};

export default TablaGestionCargos;
