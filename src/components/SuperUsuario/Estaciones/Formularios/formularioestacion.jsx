import React from "react";

const FormularioEstacion = ({ formData, handleInputChange }) => {
  return (
    <form className="space-y-4">
      <div>
      <h3 className="text-xl font-semibold mb-4">Datos de la Estación</h3>
        <label className="block text-sm font-medium text-gray-700">
          Nombre de la Estación
        </label>
        <input
          type="text"
          name="nombre_estacion"
          value={formData.nombre_estacion}
          onChange={handleInputChange}
          className="w-full bg-blue-100 text-black border border-blue-100 rounded py-2 px-4"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">RUC</label>
        <input
          type="text"
          name="ruc"
          value={formData.ruc}
          onChange={handleInputChange}
          className="w-full bg-blue-100 text-black border border-blue-100 rounded py-2 px-4"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Dirección
        </label>
        <input
          type="text"
          name="direccion"
          value={formData.direccion}
          onChange={handleInputChange}
          className="w-full bg-blue-100 text-black border border-blue-100 rounded py-2 px-4"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Teléfono
        </label>
        <input
          type="text"
          name="telefono"
          value={formData.telefono}
          onChange={handleInputChange}
          className="w-full bg-blue-100 text-black border border-blue-100 rounded py-2 px-4"
        />
      </div>
    </form>
  );
};

export default FormularioEstacion;
