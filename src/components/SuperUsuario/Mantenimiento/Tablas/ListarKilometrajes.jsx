import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaCar } from "react-icons/fa";
import API_URL from "../../../../Config";

const ListarKilometrajes = ({ vehiculo, handleCancel }) => {
  const [kilometrajes, setKilometrajes] = useState([]);
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const vehiculoId = vehiculo.id_vehiculo;

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
          setKilometrajes(data);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchKilometraje();
  }, [userId, vehiculoId, token]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <button
        onClick={handleCancel}
        className="mb-6 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg flex items-center gap-2
                 hover:bg-slate-200 transition-colors duration-200 text-sm font-medium"
      >
        <FaArrowLeft className="text-sm" />
        Volver al vehículo
      </button>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-slate-100">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              {['Vehículo', 'Placa', 'Marca', 'Kilometraje', 'Fecha', 'Registrado por', 'Evento'].map((header, index) => (
                <th
                  key={index}
                  className="px-6 py-4 text-left text-sm font-medium text-slate-500 uppercase tracking-wider border-b border-slate-100"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {kilometrajes.map((kilometraje, index) => (
              <tr
                key={index}
                className="hover:bg-slate-50 transition-colors duration-150"
              >
                <td className="px-6 py-4 text-sm text-slate-800 font-medium">#{kilometraje.id_vehiculo}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{kilometraje.placa}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{kilometraje.marca}</td>
                <td className="px-6 py-4 text-sm text-slate-800 font-medium">{kilometraje.kilometraje.toLocaleString()} km</td>
                <td className="px-6 py-4 text-sm text-slate-500">{kilometraje.fecha_registro}</td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {kilometraje.registrado_por}
                </td>
                <td className="px-6 py-4">
                  <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-xs rounded-full">
                    {kilometraje.evento}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {kilometrajes.map((kilometraje, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-xl shadow-sm border border-slate-100"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="p-2 bg-slate-100 rounded-lg">
                <FaCar className="text-slate-600 text-lg" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-800">#{kilometraje.id_vehiculo}</h3>
                <p className="text-xs text-slate-500">{kilometraje.marca}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-slate-500">Placa</p>
                <p className="text-slate-800 font-medium">{kilometraje.placa}</p>
              </div>
              <div>
                <p className="text-slate-500">Kilometraje</p>
                <p className="text-slate-800 font-medium">{kilometraje.kilometraje.toLocaleString()} km</p>
              </div>
              <div>
                <p className="text-slate-500">Fecha</p>
                <p className="text-slate-800">{kilometraje.fecha_registro}</p>
              </div>
              <div>
                <p className="text-slate-500">Registrado por</p>
                <p className="text-slate-800">{kilometraje.registrado_por}</p>
              </div>
              <div>
                <p className="text-slate-500">Evento</p>
                <span className="inline-block px-2 py-1 bg-indigo-50 text-indigo-600 text-xs rounded-full">
                  {kilometraje.evento}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListarKilometrajes;