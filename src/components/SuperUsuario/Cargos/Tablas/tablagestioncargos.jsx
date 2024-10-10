import React from "react";
import { FaEdit } from "react-icons/fa";

const TablaGestionCargos = ({ cargos, onEditCargos }) => {
  const handleEditClick = (cargo) => {
    onEditCargos(cargo);
  };

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <div className="hidden md:block">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4 border-b">ID Cargo</th>
                <th className="py-2 px-4 border-b">Nombre del Cargo</th>
                <th className="py-2 px-4 border-b">Unidad</th> {/* Nueva columna */}
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
                  <td className="py-2 px-4 border-b">{cargo.id_unidad__nombre_unidad}</td> {/* Mostrar nombre de la unidad */}
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
        </div>

        {/* Para dispositivos móviles */}
        <div className="block md:hidden">
          {cargos.map((cargo) => (
            <div
              key={cargo.id_cargo}
              className="mb-4 border border-gray-200 p-4 rounded-lg bg-white shadow-sm"
            >
              <div className="mb-2">
                <span className="font-bold">ID Cargo: </span>
                {cargo.id_cargo}
              </div>
              <div className="mb-2">
                <span className="font-bold">Nombre del Cargo: </span>
                {cargo.cargo}
              </div>
              <div className="mb-2">
                <span className="font-bold">Unidad: </span>
                {cargo.id_unidad__nombre_unidad} {/* Mostrar nombre de la unidad */}
              </div>
              <div className="flex space-x-2">
                <button
                  className="p-2 bg-blue-500 text-white rounded-full"
                  title="Editar un cargo"
                  onClick={() => handleEditClick(cargo)}
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

export default TablaGestionCargos;
