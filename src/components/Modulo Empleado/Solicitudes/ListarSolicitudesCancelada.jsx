import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faBell } from '@fortawesome/free-solid-svg-icons';
import { Modal, Button } from 'antd';
import MostrarSolicitud from './MostrarSolicitudDetalle';
import ListarSolicitudesAceptadas from './ListarSolicitudesAceptado';
import CrearSolicitud from './CrearSolicitud';
import ListarSolicitudesPendientes from './ListaSolicitude';
import API_URL from '../../../Config';

const ListarSolicitudesCanceladas = () => {
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
  const [view, setView] = useState('canceladas'); // Estado para manejar la vista actual  


  useEffect(() => {
    fetchSolicitudes();
  }, []);

  const fetchSolicitudes = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const idUsuario = storedUser.usuario.id_usuario;
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token no encontrado');

      const url = `${API_URL}/Informes/listar-solicitudes-canceladas/${idUsuario}/`;
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

  const handleCreateSolicitud = () => {
    setIsCreating(true);
    setShowMostrarSolicitud(false);
    setShowAcceptedRequests(false);
    setShowPendingRequests(false);
    setShowSelector(false);
  };

  const handleCloseCreateSolicitud = () => {
    setIsCreating(false);
    fetchSolicitudes();
    setShowSelector(true);
  };

  const handleShowPendingRequests = () => {
    setShowPendingRequests(true);
    setShowMostrarSolicitud(false);
    setShowAcceptedRequests(false);
    setIsCreating(false);
  };

  const handleShowMotivoCancelado = async (id_solicitud) => {
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
      // Optionally, you can show an error message to the user
    }
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setMotivosCancelados([]);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSolicitudes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSolicitudes.length / itemsPerPage);

  if (isCreating) {
    return <CrearSolicitud onClose={handleCloseCreateSolicitud} />;
  }


  if (view === 'aceptadas') {
    return <ListarSolicitudesAceptadas />;
  }

  if (view === 'pendientes') {
    return <ListarSolicitudesPendientes />;
  }

  const handleViewChange = (event) => {
    setView(event.target.value);
  };

  return (
    <div className="p-4 mt-16">
  {showMostrarSolicitud && selectedSolicitudId && (
    <MostrarSolicitud id_solicitud={selectedSolicitudId} onClose={handleCloseMostrarSolicitud} />
  )}
  {!showMostrarSolicitud && !showAcceptedRequests && !showPendingRequests && (
    <>
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <h1 className="text-2xl font-light">Gestión de Solicitudes</h1>
        <button
          className="mt-2 md:mt-0 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 border-b-4 border-blue-300 
                      hover:border-blue-700 rounded"
          onClick={handleCreateSolicitud}
        >
          Crear Solicitud
        </button>
      </div>

      <div className="mb-4">
 
     
          <div className="mt-8 flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
            <button
              className="bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-2 px-4 border-b-4 border-yellow-700 hover:border-yellow-300 rounded"
              onClick={handleShowPendingRequests}
            >
              Solicitudes Pendientes
            </button>
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 border-b-4 border-green-400 hover:border-green-900 rounded"
              onClick={handleShowAcceptedRequests}
            >
              Solicitudes Aceptadas
            </button>
          </div>
          
        </div>

          <div className="mb-4">
          <h2 className="text-xl font-light mb-4">Solicitudes Canceladas del Usuario</h2>
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
       
  
      
      {/* Vista en computadoras como tabla */}
      <div className="hidden md:block overflow-x-auto">
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
                    title="Ver Motivo de Cancelación"
                    onClick={() => handleShowMotivoCancelado(solicitud.id)}
                  >
                    <FontAwesomeIcon icon={faBell} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vista móvil como tarjetas */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {currentItems.map((solicitud) => (
          <div key={solicitud['Codigo de Solicitud']} className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Código: {solicitud['Codigo de Solicitud']}</h3>
            <p className="text-sm text-gray-600 mb-1">Fecha: {solicitud['Fecha Solicitud']}</p>
            <p className="text-sm text-gray-600 mb-1">Motivo: {solicitud['Motivo']}</p>
            <p className="text-sm text-gray-600 mb-4">Estado: {solicitud['Estado']}</p>
            <div className="flex space-x-2">
              <button
                className="p-2 bg-blue-500 text-white rounded-full"
                title="Ver Solicitud"
                onClick={() => handleVer(solicitud.id)}
              >
                <FontAwesomeIcon icon={faEye} />
              </button>
              <button
                className="p-2 bg-yellow-500 text-white rounded-full"
                title="Ver Motivo de Cancelación"
                onClick={() => handleShowMotivoCancelado(solicitud.id)}
              >
                <FontAwesomeIcon icon={faBell} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mt-4 space-y-4 md:space-y-0">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="
          bg-gray-500 hover:bg-gray-700 
          text-white font-bold py-2 px-4 
          border-b-4 border-gray-600 hover:border-gray-500 rounded"
        >
          Anterior
        </button>
        <span className="text-center md:text-left">{`Página ${currentPage} de ${totalPages}`}</span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          className="bg-gray-500 hover:bg-gray-700 
          text-white font-bold py-2 px-4 
          border-b-4 border-gray-600 
          hover:border-gray-500 rounded"
        >
          Siguiente
        </button>
      </div>
    </>
  )}

  <Modal
    title="Motivo de cancelación"
    visible={isModalVisible}
    onOk={handleModalClose}
    onCancel={handleModalClose}
        placeholder="Ingrese el motivo de cancelación"
    footer={[
      <Button key="close" onClick={handleModalClose}>
        Cerrar
      </Button>
    ]}
  >
    {motivosCancelados.map((motivo) => (
      <p key={motivo.id_motivo_cancelado}>{motivo.motivo_cancelado}</p>
    ))}
  </Modal>
</div>

  );
};

export default ListarSolicitudesCanceladas;