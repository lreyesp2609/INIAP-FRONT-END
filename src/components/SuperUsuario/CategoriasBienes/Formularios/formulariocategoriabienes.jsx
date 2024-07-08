import React from "react";

const FormularioCategoriaBienes = ({ formData, handleInputChange }) => {
    return (
      <form id="categoryForm" className="space-y-8">
        <div>
          <h3 className="text-xl font-semibold mb-4">Datos de la Categoría</h3>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Descripción de la Categoría
              </label>
              <input
                type="text"
                name="descripcion_categoria"
                value={formData.descripcion_categoria}
                onChange={handleInputChange}
                className="mt-1 p-2 border border-gray-300 rounded w-full"
              />
            </div>
          </div>
        </div>
      </form>
    );
  };
  
  export default FormularioCategoriaBienes;