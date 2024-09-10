import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import API_URL from '../../../Config';
import ListarSolicitudesCanceladasAdmin from './ListarSolicitudesCanceladaAdmin';
import ListarSolicitudesPendientesAdmin from './ListarSolicitudesAdmin';
import MostrarSolicitudAceptadoAdmin from './MostrarSolicitudDetalleAceptado';

const ListarSolicitudesAceptadasAdmin = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [filteredSolicitudes, setFilteredSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showMostrarSolicitud, setShowMostrarSolicitud] = useState(false);
  const [selectedSolicitudId, setSelectedSolicitudId] = useState(null);
  const [showCancelledRequests, setShowCancelledRequests] = useState(false); // Estado para solicitudes canceladas
  const [showPendingRequests, setShowPendingRequests] = useState(false); // Estado para solicitudes pendientes
  const [isCreating, setIsCreating] = useState(false); // Estado para crear solicitud

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  const fetchSolicitudes = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const idUsuario = storedUser.usuario.id_usuario;
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token no encontrado');

      const url = `${API_URL}/Informes/listar-solicitudes-aceptadas-admin/`;
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

  const handleVer = (id_solicitud) => {
    setSelectedSolicitudId(id_solicitud);
    setShowMostrarSolicitud(true);
  };

  const handleCloseMostrarSolicitud = () => {
    setShowMostrarSolicitud(false);
    setSelectedSolicitudId(null);
  };

  const handleShowCancelledRequests = () => {
    setShowCancelledRequests(true);
  };

  const handleShowPendingRequests = () => {
    setShowPendingRequests(true);
  };


  if (showCancelledRequests) {
    return <ListarSolicitudesCanceladasAdmin />;
  }

  if (showPendingRequests) {
    return <ListarSolicitudesPendientesAdmin />;
  }

  return (
    <div className="p-4 mt-16">
    {showMostrarSolicitud && selectedSolicitudId && (
      <MostrarSolicitudAceptadoAdmin
        id_solicitud={selectedSolicitudId}
        onClose={handleCloseMostrarSolicitud}
      />
    )}
    {!showMostrarSolicitud && !showCancelledRequests && !showPendingRequests && !isCreating && (
      <>
        <div className="mb-4">
          <h2 className="text-xl font-light mb-4">Solicitudes Aceptadas del Usuario</h2>
          
          <div className="mt-8 flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
            <button
              className="bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-2 px-4 border-b-4 border-yellow-700 hover:border-yellow-300 rounded"
              onClick={handleShowPendingRequests}
            >
              Solicitudes Pendientes
            </button>
            <button
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 border-b-4 border-red-400 hover:border-red-900 rounded"
              onClick={handleShowCancelledRequests}
            >
              Solicitudes Canceladas
            </button>
          </div>
        </div>
          <div className="mb-4">
          <div className="flex flex-col md:flex-row items-start md:items-center">
            <input
              type="text"
              placeholder="Buscar por nombres, apellidos o cédula"
              value={searchTerm}
              onChange={handleSearch}
              className="w-full p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              className="w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 border-b-4 border-blue-300 hover:border-blue-700 rounded mt-2 md:mt-0 md:ml-2"
              onClick={handleClear}
              style={{ minWidth: "80px" }}
            >
              Limpiar
            </button>
            </div>
          </div>
  
      <div className="overflow-x-auto md:hidden">
        {/* Vista en tarjetas para dispositivos móviles */}
        {currentItems.map((solicitud) => (
          <div key={solicitud['Codigo de Solicitud']} className="bg-white border border-gray-300 rounded-lg p-4 mb-4">
            <div className="font-bold mb-2">Código de Solicitud: {solicitud['Codigo de Solicitud']}</div>
            <div className="mb-2">Fecha Solicitud: {solicitud['Fecha Solicitud']}</div>
            <div className="mb-2">Motivo Movilización: {solicitud['Motivo']}</div>
            <div className="mb-2">Estado Solicitud: {solicitud['Estado']}</div>
            <div className="text-right">
              <button
                className="p-2 bg-blue-500 text-white rounded-full"
                title="Ver Solicitud de Movilización"
                onClick={() => handleVer(solicitud.id)}
              >
                <FontAwesomeIcon icon={faEye} />
              </button>
            </div>
          </div>
        ))}
      </div>
  
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
                    title="Ver Solicitud de Movilización"
                    onClick={() => handleVer(solicitud.id)}
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 space-y-4 sm:space-y-0">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="w-full sm:w-auto bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 border-b-4 border-gray-600 hover:border-gray-500 rounded"
          >
            Anterior
          </button>
          <span className="text-center">{`Página ${currentPage} de ${totalPages}`}</span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className="w-full sm:w-auto bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 border-b-4 border-gray-600 hover:border-gray-500 rounded"
          >
            Siguiente
          </button>
        </div>
      </>
    )}
  </div>
  
  
  );
};

export default ListarSolicitudesAceptadasAdmin;
