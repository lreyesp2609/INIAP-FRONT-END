import React from "react";

const FormularioEncabezado = ({ formData, handleFileChange }) => {
  return (
    <form className="space-y-4">
      <h3 className="text-xl font-semibold mb-4">Datos del Encabezado</h3>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Encabezado Superior
        </label>
        <input
          id="encabezado_superior"
          name="encabezado_superior"
          type="file"
          onChange={handleFileChange}
          className="w-full bg-blue-100 text-black border border-blue-100 rounded py-2 px-4"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Encabezado Inferior
        </label>
        <input
          id="encabezado_inferior"
          name="encabezado_inferior"
          type="file"
          onChange={handleFileChange}
          className="w-full bg-blue-100 text-black border border-blue-100 rounded py-2 px-4"
        />
      </div>
    </form>
  );
};

export default FormularioEncabezado;
