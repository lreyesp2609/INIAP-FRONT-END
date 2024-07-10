import React from "react";

const FormularioEditarLicencia = ({ formData, handleInputChange }) => {
  return (
    <form id="licenciaForm" className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold mb-4">Datos de la Licencia</h3>
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tipo de Licencia
            </label>
            <input
              type="text"
              name="tipo_licencia"
              value={formData.tipo_licencia}
              onChange={handleInputChange}
              className="w-full bg-blue-100 text-black border border-blue-100 rounded py-2 px-4"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Observación
            </label>
            <input
              type="text"
              name="observacion"
              value={formData.observacion}
              onChange={handleInputChange}
              className="w-full bg-blue-100 text-black border border-blue-100 rounded py-2 px-4"
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default FormularioEditarLicencia;
