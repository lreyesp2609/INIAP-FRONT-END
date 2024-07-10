import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../Config';

const ListarMovilizacion = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [filteredSolicitudes, setFilteredSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const navigate = useNavigate();

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  const fetchSolicitudes = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const idUsuario = storedUser?.usuario?.id_usuario;

      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token no encontrado');
      if (!idUsuario) throw new Error('ID de usuario no encontrado');

      const response = await fetch(`${API_URL}/OrdenesMovilizacion/listar-orden/${idUsuario}/`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      if (!response.ok) throw new Error('Error al obtener solicitudes');

      const data = await response.json();
      setSolicitudes(data);
      setFilteredSolicitudes(data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchTerm(event.target.value);

    const filtered = solicitudes.filter(
      (solicitud) =>
        solicitud.secuencial_orden_movilizacion.toLowerCase().includes(searchValue) ||
        solicitud.motivo_movilizacion.toLowerCase().includes(searchValue) ||
        solicitud.estado_movilizacion.toLowerCase().includes(searchValue)
    );

    setFilteredSolicitudes(filtered);
    setCurrentPage(1);
  };

  const handleClear = () => {
    setSearchTerm('');
    setFilteredSolicitudes(solicitudes);
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSolicitudes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSolicitudes.length / itemsPerPage);

  const handleClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSolicitarMovilizacion = () => {
    navigate('/solicitar-movilizacion');
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-center">Lista de Solicitudes de Movilización</h2>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={handleSolicitarMovilizacion}
        >
          Solicitar Movilización
        </button>
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="mb-4">
        <div className="flex">
          <input
            type="text"
            placeholder="Buscar por número, motivo o estado"
            value={searchTerm}
            onChange={handleSearch}
            className="w-full p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600"
            onClick={handleClear}
            style={{ minWidth: '80px' }}
          >
            Limpiar
          </button>
        </div>
      </div>
      <div className="overflow-x-auto mb-4">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="w-full bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Secuencial de Orden</th>
              <th className="py-3 px-6 text-left">Fecha Viaje</th>
              <th className="py-3 px-6 text-left">Hora Ida</th>
              <th className="py-3 px-6 text-left">Hora Regreso</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {currentItems.length > 0 ? (
              currentItems.map((solicitud, index) => (
                <tr key={index} className="border-b border-gray-300 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left whitespace-nowrap">{solicitud.secuencial_orden_movilizacion}</td>
                  <td className="py-3 px-6 text-left">{solicitud.fecha_viaje}</td>
                  <td className="py-3 px-6 text-left">{solicitud.hora_ida}</td>
                  <td className="py-3 px-6 text-left">{solicitud.hora_regreso}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-3 px-6 text-center">No se encontraron solicitudes.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        >
          Anterior
        </button>
        <span>{`Página ${currentPage} de ${totalPages}`}</span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default ListarMovilizacion;
