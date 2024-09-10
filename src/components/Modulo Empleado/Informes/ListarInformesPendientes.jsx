import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileEdit } from '@fortawesome/free-solid-svg-icons';
import API_URL from '../../../Config';
import CrearInformes from './CrearInforme';
import InformesSemiTerminados from './ListarInformesSemiTerminado'; // Importar el nuevo componente

const InformesPendientes = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [filteredSolicitudes, setFilteredSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);
  const [view, setView] = useState('pendientes'); // Estado para manejar la vista actual

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

  if (view === 'semi-terminados') {
    return <InformesSemiTerminados />;
  }

  return (
    <div className="p-4 mt-16">
    {!isCreating ? (
      <>
        {/* Sección de selección y búsqueda */}
        <div className="mb-4">
          <div className="flex flex-col md:flex-row md:items-center mb-4">
            <h2 className="text-xl font-medium flex-1 text-center md:text-left mb-2 md:mb-0">
              Gestión de Informes
            </h2>
            <div className="flex flex-col md:flex-row items-center md:items-center mb-2 md:mb-0">
              <label htmlFor="view-select" className="mr-2 text-lg font-light">Ver:</label>
              <select
                id="view-select"
                value={view}
                onChange={handleViewChange}
                className="p-2 border border-gray-300 rounded"
              >
                <option value="semi-terminados">Informes</option>
                <option value="pendientes">Solicitudes con Informes Pendientes</option>
              </select>
            </div>
          </div>
          <div className="mb-4">
            <div className="flex flex-col md:flex-row">
              <input
                type="text"
                placeholder="Buscar por nombres, apellidos o cédula"
                value={searchTerm}
                onChange={handleSearch}
                className="w-full p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                className="
                  bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 border-b-4 border-blue-300 
                  hover:border-blue-700 rounded
                  mt-2 md:mt-0 md:ml-2"
                onClick={handleClear}
                style={{ minWidth: "80px" }}
              >
                Limpiar
              </button>
            </div>
          </div>
        </div>
  
        {/* Tabla de datos como tarjetas en vista móvil */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
  
        <div className="md:hidden">
          {currentItems.map((solicitud) => (
            <div key={solicitud['Codigo de Solicitud']} className="bg-white p-4 rounded-lg shadow-lg mb-4">
              <h3 className="text-lg font-medium mb-2">Código de Solicitud: {solicitud['Codigo de Solicitud']}</h3>
              <p><strong>Fecha Solicitud:</strong> {solicitud['Fecha Solicitud']}</p>
              <p><strong>Motivo Movilización:</strong> {solicitud['Motivo']}</p>
              <p><strong>Estado Solicitud:</strong> {solicitud['Estado']}</p>
              <div className="mt-4">
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full"
                  title="Crear Informe"
                  onClick={() => handleCreateSolicitud(solicitud.id)}
                >
                  <FontAwesomeIcon icon={faFileEdit} />
                </button>
              </div>
            </div>
          ))}
        </div>
  
        {/* Paginación */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-4 space-y-4 md:space-y-0">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="
              bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 border-b-4 border-gray-600 
              hover:border-gray-500 rounded w-full md:w-auto"
          >
            Anterior
          </button>
          <span className="text-center md:text-left">{`Página ${currentPage} de ${totalPages}`}</span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 border-b-4 border-gray-600 
              hover:border-gray-500 rounded w-full md:w-auto"
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

export default InformesPendientes;
