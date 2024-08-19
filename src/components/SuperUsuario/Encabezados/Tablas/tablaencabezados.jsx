import React from "react";

const TablaEncabezados = ({ encabezados, onImageClick }) => {
  const renderImage = (imageData, alt) => {
    if (imageData) {
      const base64Data = imageData.startsWith('data:') 
        ? imageData 
        : `data:image/jpeg;base64,${imageData}`;

      return (
        <img
          src={base64Data}
          alt={alt}
          className="w-32 h-16 object-cover cursor-pointer"
          onClick={() => onImageClick(base64Data)} // Agrega onClick para abrir el modal
        />
      );
    }
    return "No disponible";
  };

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Encabezado Superior</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Encabezado Inferior</th>
            </tr>
          </thead>
          <tbody>
            {encabezados.map((encabezado) => (
              <tr key={encabezado.id_encabezado}>
                <td className="border px-4 py-2">
                  {renderImage(encabezado.encabezado_superior, "Encabezado Superior")}
                </td>
                <td className="border px-4 py-2">
                  {renderImage(encabezado.encabezado_inferior, "Encabezado Inferior")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablaEncabezados;
