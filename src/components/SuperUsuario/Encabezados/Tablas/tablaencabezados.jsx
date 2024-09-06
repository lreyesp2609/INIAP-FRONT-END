import React, { useState } from "react";

const TablaEncabezados = ({ encabezados }) => {
  const [selectedImage, setSelectedImage] = useState(null);

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
          onClick={() => setSelectedImage(base64Data)}
        />
      );
    }
    return "No disponible";
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Encabezado Superior
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Encabezado Inferior
              </th>
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

      {selectedImage && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={handleCloseModal}
        >
          <img
            src={selectedImage}
            alt="Zoomed"
            style={{ maxWidth: "90vw", maxHeight: "90vh" }}
          />
        </div>
      )}
    </div>
  );
};

export default TablaEncabezados;
