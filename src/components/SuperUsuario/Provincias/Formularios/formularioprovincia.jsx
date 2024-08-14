import React from "react";

const FormularioProvincia = ({ formData, handleInputChange }) => {
  return (
    <form className="space-y-4">
      <h3 className="text-xl font-semibold mb-4">Datos de la Provincia</h3>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Nombre de la Provincia
        </label>
        <input
          id="provincia"
          name="provincia"
          type="text"
          value={formData.provincia}
          onChange={handleInputChange}
          className="w-full bg-blue-100 text-black border border-blue-100 rounded py-2 px-4"
          placeholder="Nombre de la Provincia"
        />
      </div>
    </form>
  );
};

export default FormularioProvincia;
