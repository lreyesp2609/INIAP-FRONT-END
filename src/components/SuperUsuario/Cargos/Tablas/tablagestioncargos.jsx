import React from "react";

const TablaGestionCargos = ({ cargos }) => {
  return (
    <table className="min-w-full bg-white">
      <thead className="bg-gray-200">
        <tr>
          <th className="py-2 px-4 border-b">ID Cargo</th>
          <th className="py-2 px-4 border-b">Nombre del Cargo</th>
        </tr>
      </thead>
      <tbody>
        {cargos.map((cargo) => (
          <tr key={cargo.id_cargo}>
            <td className="py-2 px-4 border-b">{cargo.id_cargo}</td>
            <td className="py-2 px-4 border-b">{cargo.cargo}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TablaGestionCargos;
