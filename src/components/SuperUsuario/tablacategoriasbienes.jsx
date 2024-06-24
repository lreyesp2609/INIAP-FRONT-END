import React from "react";

const TablaGestionCategorias = ({ categorias }) => {
  return (
    <div className="w-full">
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">ID Categoría</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Descripción</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Subcategorías</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((categoria) => (
              <tr key={categoria.id_categorias_bien} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-600">{categoria.id_categorias_bien}</td>
                <td className="px-4 py-2 text-sm text-gray-600">{categoria.descripcion_categoria}</td>
                <td className="px-4 py-2 text-sm text-gray-600">
                  <ul>
                    {categoria.subcategorias.map((subcategoria) => (
                      <li key={subcategoria.id_subcategoria_bien} className="text-gray-600">
                        {subcategoria.descripcion} (ID: {subcategoria.identificador})
                      </li>
                    ))}
                  </ul>
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
            <p className="text-sm text-gray-700"><strong>Subcategorías:</strong></p>
            <ul className="pl-4">
              {categoria.subcategorias.map((subcategoria) => (
                <li key={subcategoria.id_subcategoria_bien} className="text-gray-600">
                  {subcategoria.descripcion} (ID: {subcategoria.identificador})
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TablaGestionCategorias;
