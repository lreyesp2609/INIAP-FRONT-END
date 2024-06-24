import React from 'react';

const TablaEmpleados = ({ empleados, handleEditEmpleado }) => {
  return (
    <div className="w-full">
      <div className="overflow-x-auto">
  <div className="hidden md:block">
    <table className="min-w-full bg-white border border-gray-200 table-auto">
      <thead>
        <tr className="bg-gray-100">
          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Nombres</th>
          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Apellidos</th>
          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Distintivo</th>
          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Cédula</th>
          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Usuario</th>
          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Cargo</th>
          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Unidad</th>
          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Estación</th>
          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {empleados.map((empleado, index) => (
          <tr key={index} className="hover:bg-gray-50">
            <td className="px-4 py-2 text-sm text-gray-600">{empleado.nombres}</td>
            <td className="px-4 py-2 text-sm text-gray-600">{empleado.apellidos}</td>
            <td className="px-4 py-2 text-sm text-gray-600">{empleado.distintivo}</td>
            <td className="px-4 py-2 text-sm text-gray-600">{empleado.cedula}</td>
            <td className="px-4 py-2 text-sm text-gray-600">{empleado.usuario}</td>
            <td className="px-4 py-2 text-sm text-gray-600">{empleado.cargo}</td>
            <td className="px-4 py-2 text-sm text-gray-600">{empleado.nombre_unidad}</td>
            <td className="px-4 py-2 text-sm text-gray-600">{empleado.nombre_estacion}</td>
            <td className="px-4 py-2 text-sm text-gray-600">
              <button
                className="mt-2 bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
                onClick={() => handleEditEmpleado(empleado)}
              >
                Editar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  <div className="block md:hidden">
    {empleados.map((empleado, index) => (
      <div key={index} className="mb-4 border border-gray-200 p-4 rounded-lg bg-white shadow-sm">
        <div className="mb-2">
          <span className="font-bold">Nombres: </span>{empleado.nombres}
        </div>
        <div className="mb-2">
          <span className="font-bold">Apellidos: </span>{empleado.apellidos}
        </div>
        <div className="mb-2">
          <span className="font-bold">Distintivo: </span>{empleado.distintivo}
        </div>
        <div className="mb-2">
          <span className="font-bold">Cédula: </span>{empleado.cedula}
        </div>
        <div className="mb-2">
          <span className="font-bold">Usuario: </span>{empleado.usuario}
        </div>
        <div className="mb-2">
          <span className="font-bold">Cargo: </span>{empleado.cargo}
        </div>
        <div className="mb-2">
          <span className="font-bold">Unidad: </span>{empleado.nombre_unidad}
        </div>
        <div className="mb-2">
          <span className="font-bold">Estación: </span>{empleado.nombre_estacion}
        </div>
        <div>
          <button
            className="mt-2 bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
            onClick={() => handleEditEmpleado(empleado)}
          >
            Editar
          </button>
        </div>
      </div>
    ))}
  </div>
</div>

      <div className="block md:hidden">
        {empleados.map((empleado, index) => (
          <div key={index} className="bg-white shadow-md rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-700"><strong>Nombres:</strong> {empleado.nombres}</p>
            <p className="text-sm text-gray-700"><strong>Apellidos:</strong> {empleado.apellidos}</p>
            <p className="text-sm text-gray-700"><strong>Distintivo:</strong> {empleado.distintivo}</p>
            <p className="text-sm text-gray-700"><strong>Cédula:</strong> {empleado.cedula}</p>
            <p className="text-sm text-gray-700"><strong>Usuario:</strong> {empleado.usuario}</p>
            <p className="text-sm text-gray-700"><strong>Cargo:</strong> {empleado.cargo}</p>
            <p className="text-sm text-gray-700"><strong>Unidad:</strong> {empleado.nombre_unidad}</p>
            <p className="text-sm text-gray-700"><strong>Estación:</strong> {empleado.nombre_estacion}</p>
            <button
              className="mt-2 bg-blue-500 hover:bg-blue-400 
                  text-white font-bold py-2 px-4 border-b-4 border-blue-700
                  hover:border-blue-500 rounded"
              onClick={() => handleEditEmpleado(empleado)}
            >
              Editar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TablaEmpleados;
