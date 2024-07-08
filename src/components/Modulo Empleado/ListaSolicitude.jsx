import React, { useState, useEffect } from 'react';

const ListarSolicitudes = ({ idEmpleado }) => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/Informes/listar-solicitudes/${idEmpleado}/`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setSolicitudes(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchSolicitudes();
  }, [idEmpleado]);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Solicitudes del Empleado {idEmpleado}</h2>
      <table>
        <thead>
          <tr>
            <th>ID Solicitud</th>
            <th>Número Solicitud</th>
            <th>Fecha Solicitud</th>
            <th>Motivo Movilización</th>
            <th>Estado Solicitud</th>
          </tr>
        </thead>
        <tbody>
          {solicitudes.map((solicitud) => (
            <tr key={solicitud.id_solicitud}>
              <td>{solicitud.id_solicitud}</td>
              <td>{solicitud.numero_solicitud}</td>
              <td>{solicitud.fecha_solicitud}</td>
              <td>{solicitud.motivo_movilizacion}</td>
              <td>{solicitud.estado_solicitud}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListarSolicitudes;
