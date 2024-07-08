import React, { useState, useEffect } from 'react';
import API_URL from "../.././Config";

const ListarSolicitudes = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const idUsuario = storedUser.usuario.id_usuario;

        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token no encontrado');

        const response = await fetch(`${API_URL}/Informes/listar-solicitudes/${idUsuario}/`);
        if (!response.ok) throw new Error('Error al obtener solicitudes');

        const data = await response.json();
        setSolicitudes(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchSolicitudes();
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Solicitudes del Usuario</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="w-full bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">ID Solicitud</th>
              <th className="py-3 px-6 text-left">Número Solicitud</th>
              <th className="py-3 px-6 text-left">Fecha Solicitud</th>
              <th className="py-3 px-6 text-left">Motivo Movilización</th>
              <th className="py-3 px-6 text-left">Estado Solicitud</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {solicitudes.map((solicitud) => (
              <tr key={solicitud.id_solicitud} className="border-b border-gray-300 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">{solicitud.id_solicitud}</td>
                <td className="py-3 px-6 text-left">{solicitud.numero_solicitud}</td>
                <td className="py-3 px-6 text-left">{solicitud.fecha_solicitud}</td>
                <td className="py-3 px-6 text-left">{solicitud.motivo_movilizacion}</td>
                <td className="py-3 px-6 text-left">{solicitud.estado_solicitud}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListarSolicitudes;
