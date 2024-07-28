import React from "react";

const FormularioSubcategoriaEditar = ({ formData, handleInputChange }) => {
  return (
    <form>
      <div className="mb-4">
        <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
          Descripción
        </label>
        <input
          type="text"
          id="descripcion"
          name="descripcion"
          value={formData.descripcion || ""}
          onChange={handleInputChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="identificador" className="block text-sm font-medium text-gray-700">
          Identificador
        </label>
        <input
          type="text"
          id="identificador"
          name="identificador"
          value={formData.identificador || ""}
          onChange={handleInputChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded"
        />
      </div>
    </form>
  );
};

export default FormularioSubcategoriaEditar;
