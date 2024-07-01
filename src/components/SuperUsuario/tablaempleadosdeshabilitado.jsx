import React, { useState } from "react";
import { MdPersonAdd } from "react-icons/md";

const TablaEmpleadosDeshabilitados = ({
  empleados,
  onHabilitarEmpleado,
  fetchEmpleados,
  user,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEmpleados = empleados.filter((empleado) =>
    empleado.cedula.includes(searchTerm)
  );

  const handleHabilitar = () => {
    fetchEmpleados(user.usuario.id_usuario);
  };

  return (
    <div className="w-full">
      <div className="p-4 bg-white shadow-sm rounded-md mb-4">
        <input
          type="text"
          placeholder="Buscar por cédula"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="overflow-x-auto">
        <div className="hidden md:block">
          <table className="min-w-full bg-white border border-gray-200 table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Nombres
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Apellidos
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Distintivo
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Cédula
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Usuario
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Cargo
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Unidad
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Estación
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredEmpleados.map((empleado, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm text-gray-600">
                    {empleado.nombres}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600">
                    {empleado.apellidos}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600">
                    {empleado.distintivo}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600">
                    {empleado.cedula}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600">
                    {empleado.usuario}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600">
                    {empleado.cargo}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600">
                    {empleado.nombre_unidad}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600">
                    {empleado.nombre_estacion}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600 flex space-x-2">
                    <button
                      className="p-2 bg-blue-500 text-white rounded-full"
                      title="Habilitar empleado"
                      onClick={() =>
                        onHabilitarEmpleado(
                          empleado.id_empleado,
                          empleado.nombres,
                          empleado.cedula
                        )
                      }
                    >
                      <MdPersonAdd />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="block md:hidden">
          {filteredEmpleados.map((empleado, index) => (
            <div
              key={index}
              className="mb-4 border border-gray-200 p-4 rounded-lg bg-white shadow-sm"
            >
              <div className="mb-2">
                <span className="font-bold">Nombres: </span>
                {empleado.nombres}
              </div>
              <div className="mb-2">
                <span className="font-bold">Apellidos: </span>
                {empleado.apellidos}
              </div>
              <div className="mb-2">
                <span className="font-bold">Distintivo: </span>
                {empleado.distintivo}
              </div>
              <div className="mb-2">
                <span className="font-bold">Cédula: </span>
                {empleado.cedula}
              </div>
              <div className="mb-2">
                <span className="font-bold">Usuario: </span>
                {empleado.usuario}
              </div>
              <div className="mb-2">
                <span className="font-bold">Cargo: </span>
                {empleado.cargo}
              </div>
              <div className="mb-2">
                <span className="font-bold">Unidad: </span>
                {empleado.nombre_unidad}
              </div>
              <div className="mb-2">
                <span className="font-bold">Estación: </span>
                {empleado.nombre_estacion}
              </div>
              <div className="flex space-x-2">
                <button
                  className="p-2 bg-blue-500 text-white rounded-full"
                  title="Habilitar empleado"
                  onClick={() =>
                    onHabilitarEmpleado(
                      empleado.id_empleado,
                      empleado.nombres,
                      empleado.cedula
                    )
                  }
                >
                  <MdPersonAdd />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TablaEmpleadosDeshabilitados;
