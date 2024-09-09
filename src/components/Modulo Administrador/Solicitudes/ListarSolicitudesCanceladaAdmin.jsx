import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faBell } from '@fortawesome/free-solid-svg-icons';
import { Modal } from 'antd';
import API_URL from '../../../Config';
import MostrarSolicitudAdmin from './MostrarSolicitudDetalleAdmin';
import ListarSolicitudesPendientesAdmin from './ListarSolicitudesAdmin';
import ListarSolicitudesAceptadasAdmin from './ListarSolicitudesAceptadoAdmin';

const ListarSolicitudesCanceladasAdmin = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [filteredSolicitudes, setFilteredSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showMostrarSolicitud, setShowMostrarSolicitud] = useState(false);
  const [selectedSolicitudId, setSelectedSolicitudId] = useState(null);
  const [showAcceptedRequests, setShowAcceptedRequests] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showSelector, setShowSelector] = useState(true);
  const [showPendingRequests, setShowPendingRequests] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [motivosCancelados, setMotivosCancelados] = useState([]);
  const [selectedSolicitudIdForModal, setSelectedSolicitudIdForModal] = useState(null);

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  const fetchSolicitudes = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const idUsuario = storedUser.usuario.id_usuario;
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token no encontrado');

      const url = `${API_URL}/Informes/listar-solicitudes-canceladas-admin/`;
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

  const handleShowAcceptedRequests = () => {
    setShowAcceptedRequests(true);
  };

  const handleShowPendingRequests = () => {
    setShowPendingRequests(true);
    setShowMostrarSolicitud(false);
    setShowAcceptedRequests(false);
    setIsCreating(false);
  };

  const handleShowModal = async (id_solicitud) => {
    setSelectedSolicitudIdForModal(id_solicitud);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token no encontrado');

      const url = `${API_URL}/Informes/listar-motivos-cancelados/${id_solicitud}/`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Error al obtener motivos de cancelación');

      const data = await response.json();
      setMotivosCancelados(data.motivos_cancelados);
      setIsModalVisible(true);
    } catch (error) {
      console.error('Error:', error);
      // Aquí puedes manejar el error, por ejemplo, mostrando un mensaje al usuario
    }
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedSolicitudIdForModal(null);
    setMotivosCancelados([]);
  };

  if (showAcceptedRequests) {
    return <ListarSolicitudesAceptadasAdmin />;
  }

  if (showPendingRequests) {
    return <ListarSolicitudesPendientesAdmin />;
  }

  return (
    <div className="p-4">
      {showMostrarSolicitud && selectedSolicitudId && (
        <MostrarSolicitudAdmin id_solicitud={selectedSolicitudId} onClose={handleCloseMostrarSolicitud} />
      )}
      {!showMostrarSolicitud && !showAcceptedRequests && !showPendingRequests && (
        <>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-light">Gestión de Solicitudes</h1>
              <button
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 mr-2"
                onClick={handleShowPendingRequests}
              >
                Solicitudes Pendientes
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mr-2"
                onClick={handleShowAcceptedRequests}
                style={{ marginBottom: '16px' }}
              >
                Solicitudes Aceptadas
              </button>
            </div>
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-light mb-4">Solicitudes Canceladas del Usuario</h2>
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
                        className="p-2 bg-yellow-500 text-white rounded-full mr-2"
                        title="Ver Motivos de Cancelación"
                        onClick={() => handleShowModal(solicitud.id)}
                      >
                        <FontAwesomeIcon icon={faBell} />
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
      )}
      <Modal
        title="Motivos de Cancelación"
        visible={isModalVisible}
        onOk={handleCloseModal}
        onCancel={handleCloseModal}
        footer={[
          <button
            key="close"
            onClick={handleCloseModal}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Cerrar
          </button>
        ]}
      >
        {motivosCancelados.length > 0 ? (
          <ul>
            {motivosCancelados.map((motivo) => (
              <li key={motivo.id_motivo_cancelado}>{motivo.motivo_cancelado}</li>
            ))}
          </ul>
        ) : (
          <p>No se encontraron motivos de cancelación para esta solicitud.</p>
        )}
      </Modal>
    </div>
  );
};

export default ListarSolicitudesCanceladasAdmin;