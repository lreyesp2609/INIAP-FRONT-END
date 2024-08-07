import React from "react";
import { FaPlus, FaEdit } from "react-icons/fa";

const TablaGestionCategorias = ({ categorias, handleOpenSubcategorias, handleEditCategoria, handleEditSubcategoria }) => {
  return (
    <div className="w-full">
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                ID Categoría
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Descripción
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Subcategorías
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((categoria) => (
              <tr key={categoria.id_categorias_bien} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-600">
                  {categoria.id_categorias_bien}
                </td>
                <td className="px-4 py-2 text-sm text-gray-600">
                  {categoria.descripcion_categoria}
                </td>
                <td className="px-4 py-2 text-sm text-gray-600">
                  <ul>
                    {categoria.subcategorias.map((subcategoria) => (
                      <li key={subcategoria.id_subcategoria_bien} className="text-gray-600">
                        ID: {subcategoria.id_subcategoria_bien} - {subcategoria.descripcion} (Identificador: {subcategoria.identificador})
                        <button
                          className="ml-2 p-1 bg-blue-500 text-white rounded-full"
                          title="Editar subcategoría"
                          onClick={() => handleEditSubcategoria(categoria.id_categorias_bien, subcategoria.id_subcategoria_bien)}
                        >
                          <FaEdit className="text-xs" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-4 py-2 text-sm text-gray-600">
                  <div className="flex space-x-2">
                    <button
                      className="p-2 bg-green-500 text-white rounded-full"
                      title="Agregar subcategorías"
                      onClick={() => handleOpenSubcategorias(categoria.id_categorias_bien)}
                    >
                      <FaPlus />
                    </button>
                    <button
                      className="p-2 bg-blue-500 text-white rounded-full"
                      title="Editar categoría"
                      onClick={() => handleEditCategoria(categoria.id_categorias_bien)}
                    >
                      <FaEdit />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="block md:hidden">
        {categorias.map((categoria) => (
          <div key={categoria.id_categorias_bien} className="bg-white shadow-md rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-700">
              <strong>ID Categoría:</strong> {categoria.id_categorias_bien}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Descripción:</strong> {categoria.descripcion_categoria}
            </p>
            <div className="text-sm text-gray-700">
              <strong>Subcategorías:</strong>
              <ul>
                {categoria.subcategorias.map((subcategoria) => (
                  <li key={subcategoria.id_subcategoria_bien} className="text-gray-600">
                    ID: {subcategoria.id_subcategoria_bien} - {subcategoria.descripcion} (Identificador: {subcategoria.identificador})
                    <button
                      className="ml-2 p-1 bg-blue-500 text-white rounded-full"
                      title="Editar subcategoría"
                      onClick={() => handleEditSubcategoria(categoria.id_categorias_bien, subcategoria.id_subcategoria_bien)}
                    >
                      <FaEdit className="text-xs" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex space-x-2 mt-2">
              <button
                className="p-2 bg-green-500 text-white rounded-full"
                title="Agregar subcategorías"
                onClick={() => handleOpenSubcategorias(categoria.id_categorias_bien)}
              >
                <FaPlus />
              </button>
              <button
                className="p-2 bg-blue-500 text-white rounded-full"
                title="Editar categoría"
                onClick={() => handleEditCategoria(categoria.id_categorias_bien)}
              >
                <FaEdit />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TablaGestionCategorias;
