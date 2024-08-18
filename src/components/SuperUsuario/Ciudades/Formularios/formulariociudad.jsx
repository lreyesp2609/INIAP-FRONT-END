import React from "react";

const FormularioCiudad = ({ formData, handleInputChange, errors }) => {
  return (
    <form className="space-y-4">
      <h3 className="text-xl font-semibold mb-4">Datos de la Ciudad</h3>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Nombre de la Ciudad
        </label>
        <input
          id="ciudad"
          name="ciudad"
          type="text"
          value={formData.ciudad}
          onChange={handleInputChange}
          className={`w-full ${errors.ciudad ? "bg-red-100 border-red-500" : "bg-blue-100 text-black border-blue-100"} border rounded py-2 px-4`}
          placeholder="Nombre de la Ciudad"
        />
        {errors.ciudad && (
          <p className="text-red-500 text-sm mt-1">{errors.ciudad}</p>
        )}
      </div>
    </form>
  );
};

export default FormularioCiudad;
