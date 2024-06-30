import React from "react";

const FormularioVehiculo = ({ formData, handleInputChange }) => {
  return (
    <form id="vehicleForm" className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold mb-4">Datos del Vehículo</h3>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              ID Subcategoría Bien
            </label>
            <input
              type="text"
              name="id_subcategoria_bien"
              value={formData.id_subcategoria_bien}
              onChange={handleInputChange}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Placa
            </label>
            <input
              type="text"
              name="placa"
              value={formData.placa}
              onChange={handleInputChange}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Código Inventario
            </label>
            <input
              type="text"
              name="codigo_inventario"
              value={formData.codigo_inventario}
              onChange={handleInputChange}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Modelo
            </label>
            <input
              type="text"
              name="modelo"
              value={formData.modelo}
              onChange={handleInputChange}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Marca
            </label>
            <input
              type="text"
              name="marca"
              value={formData.marca}
              onChange={handleInputChange}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Color Primario
            </label>
            <input
              type="text"
              name="color_primario"
              value={formData.color_primario}
              onChange={handleInputChange}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Color Secundario
            </label>
            <input
              type="text"
              name="color_secundario"
              value={formData.color_secundario}
              onChange={handleInputChange}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Año de Fabricación
            </label>
            <input
              type="text"
              name="anio_fabricacion"
              value={formData.anio_fabricacion}
              onChange={handleInputChange}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Número de Motor
            </label>
            <input
              type="text"
              name="numero_motor"
              value={formData.numero_motor}
              onChange={handleInputChange}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Número de Chasis
            </label>
            <input
              type="text"
              name="numero_chasis"
              value={formData.numero_chasis}
              onChange={handleInputChange}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Número de Matrícula
            </label>
            <input
              type="text"
              name="numero_matricula"
              value={formData.numero_matricula}
              onChange={handleInputChange}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Habilitado
            </label>
            <select
              name="habilitado"
              value={formData.habilitado}
              onChange={handleInputChange}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            >
              <option value="1">Sí</option>
              <option value="0">No</option>
            </select>
          </div>
        </div>
      </div>
    </form>
  );
};

export default FormularioVehiculo;
