import React from "react";

const FormularioMotivo = ({ formData, handleInputChange }) => {
  return (
    <form className="space-y-4">
      <h3 className="text-xl font-semibold mb-4">Datos del Motivo</h3>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Nombre del Motivo
        </label>
        <input
          id="nombre_motivo"
          name="nombre_motivo"
          type="text"
          value={formData.nombre_motivo}
          onChange={handleInputChange}
          className="w-full bg-blue-100 text-black border border-blue-100 rounded py-2 px-4"
          placeholder="Nombre del Motivo"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Descripción del Motivo
        </label>
        <input
          id="descripcion_motivo"
          name="descripcion_motivo"
          type="text"
          value={formData.descripcion_motivo}
          onChange={handleInputChange}
          className="w-full bg-blue-100 text-black border border-blue-100 rounded py-2 px-4"
          placeholder="Descripción del Motivo"
        />
      </div>
    </form>
  );
};

export default FormularioMotivo;
