import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../Config';

const ListarMovilizacion = ({ idUsuario }) => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSolicitudes = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token no encontrado');
        return;
      }

      try {
        let url = `${API_URL}/OrdenesMovilizacion/listar-orden/${idUsuario}/`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Error al obtener las solicitudes');
        }

        const data = await response.json();
        setSolicitudes(data);
        setTotalPages(Math.ceil(data.length / 10)); // Calcular el número total de páginas
        setError(null); // Limpiar cualquier error previo
      } catch (error) {
        setError(error.message);
      }
    };

    fetchSolicitudes();
  }, [idUsuario, page, searchTerm]);

  const handleSolicitarMovilizacion = () => {
    navigate('/SolicitarMovilizacion');
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1); // Resetear la página a 1 al realizar una búsqueda
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Lista de Solicitudes de Movilización</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por número, motivo o estado"
          className="w-full border border-gray-300 p-2 rounded"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <div className="overflow-x-auto mb-4">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Secuencial de Orden</th>
              <th className="px-4 py-2 border-b">Fecha Viaje</th>
              <th className="px-4 py-2 border-b">Hora Ida</th>
              <th className="px-4 py-2 border-b">Hora Regreso</th>
            </tr>
          </thead>
          <tbody>
            {solicitudes.length > 0 ? (
              solicitudes.map((solicitud, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 border-b">{solicitud.secuencial_orden_movilizacion}</td>
                  <td className="px-4 py-2 border-b">{solicitud.fecha_viaje}</td>
                  <td className="px-4 py-2 border-b">{solicitud.hora_ida}</td>
                  <td className="px-4 py-2 border-b">{solicitud.hora_regreso}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-4 py-2 border-b text-center">No se encontraron solicitudes.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mb-4">
        <button
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          onClick={handlePreviousPage}
          disabled={page === 1}
        >
          Anterior
        </button>
        <span>Página {page} de {totalPages}</span>
        <button
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          onClick={handleNextPage}
          disabled={page === totalPages}
        >
          Siguiente
        </button>
      </div>
      <div className="flex justify-center">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={handleSolicitarMovilizacion}
        >
          Solicitar Movilización
        </button>
      </div>
    </div>
  );
};

export default ListarMovilizacion;
