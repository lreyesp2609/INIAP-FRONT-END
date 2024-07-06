import React from "react";

const FormularioCargo = ({ formData, handleInputChange }) => {
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
              value={formData.cargo}
              onChange={handleInputChange}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
              required
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default FormularioCargo;
