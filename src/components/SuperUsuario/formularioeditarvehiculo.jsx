import React from "react";

const FormularioEditarVehiculo = ({
  formData,
  handleInputChange,
  handleCategoriaChange,
  categorias,
  subcategorias, 
  handleSubcategoriaChange
}) => {
  return (
    <form className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold mb-4">Datos del Vehículo</h3>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <label
              htmlFor="categoria"
              className="block text-sm font-medium text-gray-700"
            >
              Categoría de Bienes
            </label>
            <select
              name="categoria"
              value={formData.categoria.id_categoria}
              onChange={handleCategoriaChange}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            >
              <option value="">Seleccionar una categoría</option>
              {categorias.map((categoria) => (
                <option
                  key={categoria.id_categorias_bien}
                  value={categoria.id_categorias_bien}
                >
                  {categoria.descripcion_categoria}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="subcategoria"
              className="block text-sm font-medium text-gray-700"
            >
              Subcategoría de Bienes
            </label>
            <select
              name="subcategoria"
              value={formData.subcategoria.id_subcategoria}
              onChange={handleSubcategoriaChange}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            >
              <option value="">Seleccionar Subcategoría</option>
              {subcategorias.map((subcategoria) => (
                <option
                  key={subcategoria.id_subcategoria_bien}
                  value={subcategoria.id_subcategoria_bien}
                >
                  {subcategoria.descripcion}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="placa"
              className="block text-sm font-medium text-gray-700"
            >
              Placa
            </label>
            <input
              id="placa"
              name="placa"
              type="text"
              value={formData.placa}
              onChange={handleInputChange}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
              placeholder="Placa"
            />
          </div>
          <div>
            <label
              htmlFor="codigo_inventario"
              className="block text-sm font-medium text-gray-700"
            >
              Código de Inventario
            </label>
            <input
              id="codigo_inventario"
              name="codigo_inventario"
              type="text"
              value={formData.codigo_inventario}
              onChange={handleInputChange}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
              placeholder="Código de Inventario"
            />
          </div>
          <div>
            <label
              htmlFor="modelo"
              className="block text-sm font-medium text-gray-700"
            >
              Modelo
            </label>
            <input
              id="modelo"
              name="modelo"
              type="text"
              value={formData.modelo}
              onChange={handleInputChange}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
              placeholder="Modelo"
            />
          </div>
          <div>
            <label
              htmlFor="marca"
              className="block text-sm font-medium text-gray-700"
            >
              Marca
            </label>
            <input
              id="marca"
              name="marca"
              type="text"
              value={formData.marca}
              onChange={handleInputChange}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
              placeholder="Marca"
            />
          </div>
          <div>
            <label
              htmlFor="color_primario"
              className="block text-sm font-medium text-gray-700"
            >
              Color Primario
            </label>
            <input
              id="color_primario"
              name="color_primario"
              type="text"
              value={formData.color_primario}
              onChange={handleInputChange}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
              placeholder="Color Primario"
            />
          </div>
          <div>
            <label
              htmlFor="color_secundario"
              className="block text-sm font-medium text-gray-700"
            >
              Color Secundario
            </label>
            <input
              id="color_secundario"
              name="color_secundario"
              type="text"
              value={formData.color_secundario}
              onChange={handleInputChange}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
              placeholder="Color Secundario"
            />
          </div>
          <div>
            <label
              htmlFor="anio_fabricacion"
              className="block text-sm font-medium text-gray-700"
            >
              Año de Fabricación
            </label>
            <input
              id="anio_fabricacion"
              name="anio_fabricacion"
              type="number"
              value={formData.anio_fabricacion}
              onChange={handleInputChange}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
              placeholder="Año de Fabricación"
            />
          </div>
          <div>
            <label
              htmlFor="numero_motor"
              className="block text-sm font-medium text-gray-700"
            >
              Número de Motor
            </label>
            <input
              id="numero_motor"
              name="numero_motor"
              type="text"
              value={formData.numero_motor}
              onChange={handleInputChange}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
              placeholder="Número de Motor"
            />
          </div>
          <div>
            <label
              htmlFor="numero_chasis"
              className="block text-sm font-medium text-gray-700"
            >
              Número de Chasis
            </label>
            <input
              id="numero_chasis"
              name="numero_chasis"
              type="text"
              value={formData.numero_chasis}
              onChange={handleInputChange}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
              placeholder="Número de Chasis"
            />
          </div>
          <div>
            <label
              htmlFor="numero_matricula"
              className="block text-sm font-medium text-gray-700"
            >
              Número de Matrícula
            </label>
            <input
              id="numero_matricula"
              name="numero_matricula"
              type="text"
              value={formData.numero_matricula}
              onChange={handleInputChange}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
              placeholder="Número de Matrícula"
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default FormularioEditarVehiculo;
