import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa"; // Icono para el botón de retroceder
import API_URL from "../../../../Config";

const ListarKilometrajes = ({ vehiculo, handleCancel }) => {
  const [kilometrajes, setKilometrajes] = useState([]);
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const vehiculoId = vehiculo.id_vehiculo;

  // Función para obtener kilometraje
  useEffect(() => {
    const fetchKilometraje = async () => {
      try {
        const response = await fetch(`${API_URL}/Mantenimientos/vehiculos_kilometraje/${userId}/${vehiculoId}/`, {
          method: 'GET',
          headers: {
            'Authorization': `${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setKilometrajes(data); // Asignar los kilometrajes a la variable de estado
        } else {
          console.error('Error al obtener el kilometraje');
        }
      } catch (error) {
        console.error('Hubo un problema con la solicitud:', error);
      }
    };

    fetchKilometraje();
  }, [userId, vehiculoId, token]);

  return (
    <div className="w-full p-4">
      <button 
        onClick={handleCancel} 
        className="mb-4 px-4 py-2 bg-gray-600 text-white rounded-lg flex items-center">
        <FaArrowLeft className="mr-2" />
        Volver
      </button>
      <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full bg-white border border-gray-200 table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">ID Vehículo</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Placa</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Marca</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Kilometraje</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Fecha Registro</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Evento</th>
            </tr>
          </thead>
          <tbody>
            {kilometrajes.map((kilometraje, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-600">{kilometraje.id_vehiculo}</td>
                <td className="px-4 py-2 text-sm text-gray-600">{kilometraje.placa}</td>
                <td className="px-4 py-2 text-sm text-gray-600">{kilometraje.marca}</td>
                <td className="px-4 py-2 text-sm text-gray-600">{kilometraje.kilometraje}</td>
                <td className="px-4 py-2 text-sm text-gray-600">{kilometraje.fecha_registro}</td>
                <td className="px-4 py-2 text-sm text-gray-600">{kilometraje.evento}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="block md:hidden">
        {kilometrajes.map((kilometraje, index) => (
          <div key={index} className="bg-white shadow-md rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-700"><strong>ID Vehículo:</strong> {kilometraje.id_vehiculo}</p>
            <p className="text-sm text-gray-700"><strong>Placa:</strong> {kilometraje.placa}</p>
            <p className="text-sm text-gray-700"><strong>Marca:</strong> {kilometraje.marca}</p>
            <p className="text-sm text-gray-700"><strong>Kilometraje:</strong> {kilometraje.kilometraje}</p>
            <p className="text-sm text-gray-700"><strong>Fecha Registro:</strong> {kilometraje.fecha_registro}</p>
            <p className="text-sm text-gray-700"><strong>Evento:</strong> {kilometraje.evento}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListarKilometrajes;
