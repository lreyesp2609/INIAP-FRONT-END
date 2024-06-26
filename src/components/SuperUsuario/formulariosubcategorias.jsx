import React from "react";

const FormularioSubcategorias = ({ formData, handleInputChange }) => {
  return (
    <div>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="descripcion"
        >
          Descripción
        </label>
        <input
          type="text"
          id="descripcion"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleInputChange}
          className="p-2 border border-gray-300 rounded w-full"
          placeholder="Ingrese la descripción"
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="identificador"
        >
          Identificador
        </label>
        <input
          type="text"
          id="identificador"
          name="identificador"
          value={formData.identificador}
          onChange={handleInputChange}
          className="p-2 border border-gray-300 rounded w-full"
          placeholder="Ingrese el identificador"
        />
      </div>
    </div>
  );
};

export default FormularioSubcategorias;
