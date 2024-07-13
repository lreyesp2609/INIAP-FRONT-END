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
          className="w-full bg-blue-100 text-black border border-blue-100 rounded py-2 px-4"
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
          className="w-full bg-blue-100 text-black border border-blue-100 rounded py-2 px-4"
          placeholder="Ingrese el identificador"
        />
      </div>
    </div>
  );
};

export default FormularioSubcategorias;
