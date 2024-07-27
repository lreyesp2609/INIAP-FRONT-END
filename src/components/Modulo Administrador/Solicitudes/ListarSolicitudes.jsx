import React, { useState, useEffect } from 'react';
import { FaBan, FaEye, FaCheck, FaFilePdf } from 'react-icons/fa';
import API_URL from '../../../Config';

const ListarSolicitudes = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [filteredSolicitudes, setFilteredSolicitudes] = useState([]);
  const [viewMode, setViewMode] = useState('pendientes');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  useEffect(() => {
    if (solicitudes.length > 0) {
      applyFilters();
    }
  }, [solicitudes, viewMode]);
  

  const fetchSolicitudes = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const idUsuario = storedUser.usuario.id_usuario;

      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token no encontrado');

      const response = await fetch(`${API_URL}/Informes/listar-solicitudes-todas/${idUsuario}/`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      if (!response.ok) throw new Error('Error al obtener solicitudes');

      const data = await response.json();
      setSolicitudes(data.solicitudes);
      setFilteredSolicitudes(data.solicitudes);
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
        solicitud['Codigo de Solicitud'].toLowerCase().includes(searchValue) ||
        solicitud['Fecha Solicitud'].toLowerCase().includes(searchValue) ||
        solicitud['Motivo'].toLowerCase().includes(searchValue) ||
        solicitud['Estado'].toLowerCase().includes(searchValue)
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

  const applyFilters = () => {
    let filtered = [];
    if (viewMode === 'pendientes') {
      filtered = solicitudes.filter(
        (solicitud) => solicitud.Estado === 'pendiente'
      );
    } else if (viewMode === 'aprobadas') {
      filtered = solicitudes.filter((solicitud) => solicitud.Estado === 'aprobado');
    } else if (viewMode === 'rechazadas') {
      filtered = solicitudes.filter((solicitud) => solicitud.Estado === 'denegado');
    } else if (viewMode === 'historial') {
      filtered = solicitudes.filter(
        (solicitud) => solicitud.Estado === 'denegado' || solicitud.Estado === 'aprobado'
      );
    }

    filtered.sort((b, a) => new Date(a.fecha_salida_solicitud + ' ' + a.hora_salida_solicitud) - new Date(b.fecha_salida_solicitud + ' ' + b.hora_salida_solicitud));
    setFilteredSolicitudes(filtered);
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Solicitudes de Viajes</h2>

        <div className="flex items-center">
          <label htmlFor="" className="mr-2">Ver:</label> 
          <select
            id="viewModeSelect"
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="pendientes">Solicitudes Pendientes</option>
            <option value="aprobadas">Solicitudes Aprobadas</option>
            <option value="rechazadas">Solicitudes Rechazadas</option>
            <option value="historial">Historial de Acciones</option>
          </select>
        </div>
      </div>
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
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="w-full bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Código de Solicitud</th>
              <th className="py-3 px-6 text-left">Fecha Solicitud</th>
              <th className="py-3 px-6 text-left">Motivo Movilización</th>
              <th className="py-3 px-6 text-left">Estado Solicitud</th>
              <th className="py-3 px-6 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {currentItems.length > 0 ? (
              currentItems.map((solicitud) => (
                <tr key={solicitud['Codigo de Solicitud']} className="border-b border-gray-300 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left whitespace-nowrap">{solicitud['Codigo de Solicitud']}</td>
                  <td className="py-3 px-6 text-left">{solicitud['Fecha Solicitud']}</td>
                  <td className="py-3 px-6 text-left">{solicitud['Motivo']}</td>
                  <td className="py-3 px-6 text-left">{solicitud['Estado']}</td>
                  <td className="px-4 py-2 text-sm text-gray-600 flex space-x-2">
                    <button 
                      className="p-2 bg-yellow-500 text-white rounded-full"
                      title="Ver"
                    >
                      <FaEye />
                    </button>
                    {solicitud.estado_movilizacion === 'Pendiente' && (
                      <>
                        <button 
                          className="p-2 bg-green-500 text-white rounded-full"
                          title="Aceptar"
                          onClick={() => handleAccept(solicitud.id_solicitud)}
                        >
                          <FaCheck />
                        </button>
                        <button 
                          className="p-2 bg-red-500 text-white rounded-full"
                          title="Rechazar"
                          onClick={() => handleReject(solicitud.id_solicitud)}
                        >
                          <FaBan />
                        </button>
                      </>
                    )}
                    {solicitud.estado_movilizacion === 'Aprobado' && (
                      <button
                        className="p-2 bg-red-500 text-white rounded-full"
                        title="Exportar PDF"
                        onClick={() => handlePDF(solicitud.id_solicitud)}
                      >
                        <FaFilePdf />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="py-3 px-6 text-center">No se encontraron solicitudes.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div>
      {filteredSolicitudes.length > 0 && (
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            disabled={currentPage === 1}
          >
            Anterior
          </button>
          <span>{`Página ${currentPage} de ${totalPages}`}</span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            disabled={currentPage === totalPages}
          >
            Siguiente
          </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListarSolicitudes;