import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTrash } from '@fortawesome/free-solid-svg-icons';
import MostrarSolicitud from './MostrarSolicitudDetalle';
import ListarSolicitudesCanceladas from './ListarSolicitudesCancelada';
import ListarSolicitudesPendientes from './ListaSolicitude';
import CrearSolicitud from './CrearSolicitud';
import API_URL from '../../../Config';

const ListarSolicitudesAceptadas = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [filteredSolicitudes, setFilteredSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showMostrarSolicitud, setShowMostrarSolicitud] = useState(false);
  const [selectedSolicitudId, setSelectedSolicitudId] = useState(null);
  const [showCancelledRequests, setShowCancelledRequests] = useState(false);
  const [showPendingRequests, setShowPendingRequests] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [solicitudToCancel, setSolicitudToCancel] = useState(null);

  const fetchSolicitudes = useCallback(async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const idUsuario = storedUser.usuario.id_usuario;
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token no encontrado');

      const url = `${API_URL}/Informes/listar-solicitudes-aceptadas/${idUsuario}/`;
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

  const handleCancelarSolicitud = useCallback(async (id_solicitud) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token no encontrado');

      const url = `${API_URL}/Informes/actualizar-solicitud/${id_solicitud}/`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estado_solicitud: 'cancelado' })
      });

      if (!response.ok) throw new Error('Error al cancelar la solicitud');

      const data = await response.json();
      console.log(data.mensaje);

      // Actualizar la lista de solicitudes
      fetchSolicitudes();
    } catch (error) {
      console.error('Error:', error);
    }
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

  const handleCreateSolicitud = () => {
    setIsCreating(true);
    setShowMostrarSolicitud(false);
    setShowCancelledRequests(false);
    setShowPendingRequests(false);
  };

  const handleCloseCreateSolicitud = () => {
    setIsCreating(false);
    fetchSolicitudes();
  };

  const handleConfirmCancel = (id_solicitud) => {
    console.log(`Confirmar cancelación para solicitud ID: ${id_solicitud}`); // Agregado para depuración
    setSolicitudToCancel(id_solicitud);
    setShowConfirmModal(true);
  };

  const handleCancelConfirmed = async () => {
    await handleCancelarSolicitud(solicitudToCancel);
    setShowConfirmModal(false);
    setSolicitudToCancel(null);
  };

  if (isCreating) {
    return <CrearSolicitud onClose={handleCloseCreateSolicitud} />;
  }

  if (showCancelledRequests) {
    return <ListarSolicitudesCanceladas />;
  }

  if (showPendingRequests) {
    return <ListarSolicitudesPendientes />;
  }

  return (
    <div className="p-4">
      {showMostrarSolicitud && selectedSolicitudId && (
        <MostrarSolicitud id_solicitud={selectedSolicitudId} onClose={handleCloseMostrarSolicitud} />
      )}
      {!showMostrarSolicitud && !showCancelledRequests && !showPendingRequests && !isCreating && (
        <>
          <div className="mb-4">
            <h2 className="text-xl font-light mb-4">Solicitudes Aceptadas del Usuario</h2>
            <div className="flex space-x-2">
              <button
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                onClick={handleShowPendingRequests}
                style={{ marginBottom: '16px' }}
              >
                Solicitudes Pendientes
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={handleShowCancelledRequests}
                style={{ marginBottom: '16px' }}
              >
                Solicitudes Canceladas
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={handleCreateSolicitud}
                style={{ marginBottom: '16px' }}
              >
                Crear Solicitud
              </button>
            </div>
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
                        title="Ver Solicitud de Movilización"
                        onClick={() => handleVer(solicitud.id)}
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <button
                        className="p-2 bg-red-500 text-white rounded-full mr-2"
                        title="Cancelar Solicitud de Movilización"
                        onClick={() => handleConfirmCancel(solicitud.id)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
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
          {showConfirmModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg">
                <h2 className="text-xl mb-4">¿Está seguro de cancelar esta solicitud?</h2>
                <p className="mb-4">Una vez realizada esta acción no se podrá revertir.</p>
                <div className="flex justify-end">
                  <button
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded mr-2"
                    onClick={() => setShowConfirmModal(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded"
                    onClick={handleCancelConfirmed}
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ListarSolicitudesAceptadas;
