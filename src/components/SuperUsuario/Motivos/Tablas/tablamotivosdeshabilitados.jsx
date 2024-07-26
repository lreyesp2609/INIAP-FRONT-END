import React, { useState } from "react";
import { Button } from "antd";

const TablaMotivosDeshabilitados = ({ motivos, onHabilitarMotivo }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMotivos = motivos.filter((motivo) =>
    motivo.nombre_motivo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full">
      <div className="p-4 bg-white shadow-sm rounded-md mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre del motivo"
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
                  ID
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Nombre del Motivo
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Descripción
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredMotivos.map((motivo) => (
                <tr key={motivo.id_motivo} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm text-gray-600">
                    {motivo.id_motivo}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600">
                    {motivo.nombre_motivo}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600">
                    {motivo.descripcion_motivo}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600 flex space-x-2">
                    <Button
                      onClick={() => onHabilitarMotivo(motivo)}
                      type="primary"
                      danger
                    >
                      Habilitar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="block md:hidden">
          {filteredMotivos.map((motivo) => (
            <div
              key={motivo.id_motivo}
              className="mb-4 border border-gray-200 p-4 rounded-lg bg-white shadow-sm"
            >
              <div className="mb-2">
                <span className="font-bold">ID: </span>
                {motivo.id_motivo}
              </div>
              <div className="mb-2">
                <span className="font-bold">Nombre del Motivo: </span>
                {motivo.nombre_motivo}
              </div>
              <div className="mb-2">
                <span className="font-bold">Descripción: </span>
                {motivo.descripcion_motivo}
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={() => onHabilitarMotivo(motivo)}
                  type="primary"
                  danger
                >
                  Habilitar
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TablaMotivosDeshabilitados;
