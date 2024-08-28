import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileEdit,faFilePdf } from '@fortawesome/free-solid-svg-icons';
import API_URL from '../../../Config';
import CrearInformes from './CrearInforme';
import InformesPendientes from './ListarInformesPendientes'; // Importar el componente InformesPendientes

const InformesSemiTerminados = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [filteredSolicitudes, setFilteredSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);
  const [view, setView] = useState('semi-terminados'); // Estado para manejar la vista actual

  const fetchSolicitudes = useCallback(async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const idUsuario = storedUser.usuario.id_usuario;
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token no encontrado');

      const url = `${API_URL}/Informes/listar-solicitudes-sin-informe/${idUsuario}/`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
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
  }, []);

  useEffect(() => {
    fetchSolicitudes();
  }, [fetchSolicitudes]);

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

  const handleCreateSolicitud = (id_solicitud) => {
    setSelectedSolicitud(id_solicitud);
    setIsCreating(true);
  };

  const handleCloseCreateSolicitud = () => {
    setIsCreating(false);
    setSelectedSolicitud(null);
    fetchSolicitudes();
  };

  const handleViewChange = (event) => {
    setView(event.target.value);
  };

  if (view === 'pendientes') {
    return <InformesPendientes />;
  }

  return (
    <div className="p-4">
      {!isCreating ? (
        <>
          <div className="mb-4">
            <h2 className="text-xl font-light mb-4">Informes Semi-Terminados</h2>
            <div className="flex mb-4">
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
            <div className="mb-4">
              <select
                value={view}
                onChange={handleViewChange}
                className="p-2 border border-gray-300 rounded"
              >
                <option value="semi-terminados">Informes Semi-Terminados</option>
                <option value="pendientes">Solicitudes con Informes Pendientes</option>
              </select>
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
                {currentItems.map((solicitud) => (
                  <tr key={solicitud['Codigo de Solicitud']} className="border-b border-gray-300 hover:bg-gray-100">
                    <td className="py-3 px-6 text-left whitespace-nowrap">{solicitud['Codigo de Solicitud']}</td>
                    <td className="py-3 px-6 text-left">{solicitud['Fecha Solicitud']}</td>
                    <td className="py-3 px-6 text-left">{solicitud['Motivo']}</td>
                    <td className="py-3 px-6 text-left">{solicitud['Estado']}</td>
                    <td className="py-3 px-6 text-left">
                      <button
                        className="p-2 bg-blue-500 text-white rounded-full mr-2"
                        title="Crear Informe"
                        onClick={() => handleCreateSolicitud(solicitud.id)}
                      >
                        <FontAwesomeIcon icon={faFileEdit} />
                      </button>
                      <button
                        className="p-2 bg-gray-500 text-white rounded-full mr-2"
                        title="Cancelar Solicitud de Movilización"
                      >
                        <FontAwesomeIcon icon={faFilePdf} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
        </>
      ) : (
        <CrearInformes idSolicitud={selectedSolicitud} onClose={handleCloseCreateSolicitud} />
      )}
    </div>
  );
};

export default InformesSemiTerminados;
