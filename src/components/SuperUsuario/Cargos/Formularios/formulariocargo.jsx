import React from "react";

const FormularioCargo = ({ formData,Unidades = [],Cargo, handleInputChange, handleUnidadChange }) => {
  return (
    <form id="cargoForm" className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold mb-4">Datos del Cargo</h3>
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre del Cargo
            </label>
            <input
              type="text"
              name="cargo"
              value={Cargo}
              onChange={handleInputChange}
              className="w-full bg-blue-100 text-black border border-blue-100 rounded py-2 px-4"
              required
            />
          </div>
          <div>
        <label className="block text-sm font-medium text-gray-700">
          Seleccione la unidad a la que pertenece
        </label>
        <select
          name="id_estacion"
          value={formData.id_unidad}
          onChange={handleUnidadChange}
          className="w-full bg-blue-100 text-black border border-blue-100 rounded py-2 px-4"
        >
          <option value="">Seleccionar Unidad</option>
          {Unidades.map((unidad) => (
            <option key={unidad.id_undiad} value={unidad.id_unidad}>
              {unidad.nombre_unidad}
            </option>
          ))}
        </select>
      </div>
        </div>
      </div>
    </form>
  );
};

export default FormularioCargo;
