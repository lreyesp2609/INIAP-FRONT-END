import React from "react";
import { FaPlus } from "react-icons/fa";

const TablaGestionCategorias = ({ categorias, handleOpenSubcategorias }) => {
  return (
    <div className="w-full">
      <div className="overflow-x-auto">
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
              <tr
                key={categoria.id_categorias_bien}
                className="hover:bg-gray-50"
              >
                <td className="px-4 py-2 text-sm text-gray-600">
                  {categoria.id_categorias_bien}
                </td>
                <td className="px-4 py-2 text-sm text-gray-600">
                  {categoria.descripcion_categoria}
                </td>
                <td className="px-4 py-2 text-sm text-gray-600">
                  <ul>
                    {categoria.subcategorias.map((subcategoria) => (
                      <li
                        key={subcategoria.id_subcategoria_bien}
                        className="text-gray-600"
                      >
                        {subcategoria.descripcion} (Identificador:{" "}
                        {subcategoria.identificador})
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-4 py-2 text-sm text-gray-600">
                  <div className="relative group">
                    <button
                      className="p-2 bg-green-500 text-white rounded-full"
                      title="Agregar subcategorías"
                      onClick={() =>
                        handleOpenSubcategorias(categoria.id_categorias_bien)
                      }
                    >
                      <FaPlus />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablaGestionCategorias;
