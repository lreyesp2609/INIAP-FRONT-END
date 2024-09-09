import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTrash, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { Modal, notification } from 'antd';
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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [solicitudToCancel, setSolicitudToCancel] = useState(null);
  const [motivoCancelacion, setMotivoCancelacion] = useState('');
  const [view, setView] = useState('aceptadas'); // Estado para manejar la vista actual  


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

  const handleCancelarSolicitud = useCallback(async (id_solicitud, motivo) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token no encontrado');

      // Primero, actualizar el estado de la solicitud
      const updateUrl = `${API_URL}/Informes/actualizar-solicitud/${id_solicitud}/`;
      const updateResponse = await fetch(updateUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estado_solicitud: 'cancelado' })
      });

      if (!updateResponse.ok) throw new Error('Error al cancelar la solicitud');

      // Luego, crear el motivo de cancelación
      const createMotivoUrl = `${API_URL}/Informes/crear-motivo-cancelado/${id_solicitud}/`;
      const createMotivoResponse = await fetch(createMotivoUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ motivo_cancelado: motivo })
      });

      if (!createMotivoResponse.ok) throw new Error('Error al crear el motivo de cancelación');

      const data = await createMotivoResponse.json();
      notification.success({
        message: 'Solicitud cancelada',
        description: data.mensaje,
      });

      // Actualizar la lista de solicitudes
      fetchSolicitudes();
    } catch (error) {
      notification.error({
        message: 'Error',
        description: error.message,
      });
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
    setSolicitudToCancel(id_solicitud);
    setIsModalVisible(true);
  };

  const handleCancelConfirmed = async () => {
    if (motivoCancelacion.trim() === '') {
      notification.warning({
        message: 'Advertencia',
        description: 'Por favor, ingrese un motivo de cancelación.',
      });
      return;
    }
    await handleCancelarSolicitud(solicitudToCancel, motivoCancelacion);
    setIsModalVisible(false);
    setSolicitudToCancel(null);
    setMotivoCancelacion('');
  };

  if (isCreating) {
    return <CrearSolicitud onClose={handleCloseCreateSolicitud} />;
  }


  if (view === 'pendientes') {
    return <ListarSolicitudesPendientes />;
  }

  if (view === 'canceladas') {
    return <ListarSolicitudesCanceladas />;
  }

  const handleViewChange = (event) => {
    setView(event.target.value);
  };

  return (
    <div className="p-4">
      {showMostrarSolicitud && selectedSolicitudId && (
        <MostrarSolicitud id_solicitud={selectedSolicitudId} onClose={handleCloseMostrarSolicitud} />
      )}
      {!showMostrarSolicitud && !showCancelledRequests && !showPendingRequests && !isCreating && (
        <>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium flex-1">Gestión de Solicitudes</h2>
              <div className="flex items-center flex-1 justify-center">
                <label htmlFor="view-select" className="mr-2 text-lg font-light">Ver:</label>
                <select
                  id="view-select"
                  value={view}
                  onChange={handleViewChange}
                  className="p-2 border border-gray-300 rounded"
                >
                  <option value="aceptadas">Solicitudes Aceptadas</option>
                  <option value="pendientes">Solicitudes Pendientes</option>
                  <option value="canceladas">Solicitudes Canceladas</option>
                </select>
              </div>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={handleCreateSolicitud}
              >
                Crear Solicitud
              </button>
            </div>
            <div className="flex mb-4 mt-4">
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
              >
                Limpiar
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
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
                      <button
                        className="p-2 bg-red-500 text-white rounded-full mr-2"
                        title="Cancelar Solicitud de Movilización"
                        onClick={() => handleConfirmCancel(solicitud.id)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                      <button
                        className="p-2 bg-gray-500 text-white rounded-full mr-2"
                        title="Generar PDF"
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
            <span>Página {currentPage} de {totalPages}</span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              disabled={currentPage === totalPages}
            >
              Siguiente
            </button>
          </div>
          <Modal
            title="Motivo de cancelación"
            visible={isModalVisible}
            onOk={handleCancelConfirmed}
            onCancel={() => {
              setIsModalVisible(false);
              setMotivoCancelacion('');
            }}
            okText="Confirmar"
            cancelText="Cancelar"
          >
            <p>¿Está seguro de cancelar esta solicitud? Una vez realizada esta acción no se podrá revertir.</p>
            <textarea
              className="w-full p-2 mt-4 border border-gray-300 rounded"
              rows="3"
              placeholder="Ingrese el motivo de cancelación"
              value={motivoCancelacion}
              onChange={(e) => setMotivoCancelacion(e.target.value)}
            ></textarea>
          </Modal>
        </>
      )}
    </div>
  );
};

export default ListarSolicitudesAceptadas;