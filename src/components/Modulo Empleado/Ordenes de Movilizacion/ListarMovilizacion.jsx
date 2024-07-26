import React, { useState, useEffect } from 'react';
import API_URL from '../../../Config';
import { FaEdit, FaBan, FaEye } from 'react-icons/fa';
import SolicitarMovilizacion from './SolicitarMovilizacion';
import EditarSolicitudMovilizacion from './EditarSolicitudMovilizacion';
import VerSolicitudMovilizacion from './VerSolicitudMovilizacion';
import CancelarSolicitudMovilizacionModal from './CancelarSolicitudMovilizacion';
import HabilitarSolicitudMovilizacionModal from './HabilitarSolicitudMovilizacion';

const ListarMovilizacion = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [filteredSolicitudes, setFilteredSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showSolicitar, setShowSolicitar] = useState(false);
  const [showEditar, setShowEditar] = useState(false);
  const [showVer, setShowVer] = useState(false);
  const [conductores, setConductores] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [motivos, setMotivos] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [viewMode, setViewMode] = useState('pendientes');
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [habilitarModalVisible, setHabilitarModalVisible] = useState(false);
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const userId = storedUser?.usuario?.id_usuario;  

  useEffect(() => {
    fetchSolicitudes();
    fetchConductores();
    fetchVehiculos();
    fetchMotivos();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [solicitudes, viewMode, motivos]);

  const applyFilters = () => {
    let filtered = [];
    if (viewMode === 'pendientes') {
      filtered = solicitudes.filter(
        (solicitud) => solicitud.estado_movilizacion === 'Pendiente' && solicitud.habilitado === 1
      );
    } else if (viewMode === 'canceladas') {
      filtered = solicitudes.filter((solicitud) => solicitud.habilitado === 0);
    } else if (viewMode === 'historial') {
      filtered = solicitudes;
    } else if (viewMode === 'historialMovilizaciones') {
      filtered = solicitudes.filter(
        (solicitud) => solicitud.estado_movilizacion === 'Aprobado' || solicitud.estado_movilizacion === 'Finalizado'
      );
    }

    filtered.sort((b, a) => new Date(a.fecha_viaje + ' ' + a.hora_ida) - new Date(b.fecha_viaje + ' ' + b.hora_ida));
    setFilteredSolicitudes(filtered);
  };

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
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const fetchConductores = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const idUsuario = storedUser?.usuario?.id_usuario;
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/Empleados/lista-empleados/${idUsuario}/`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Error al obtener conductores');
      }
      const data = await response.json();
      setConductores(data);
    } catch (error) {
      setError('Error al obtener conductores');
      console.error('Error fetching conductores:', error);
    }
  };

  const fetchVehiculos = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const idUsuario = storedUser?.usuario?.id_usuario;
  
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/Vehiculos/vehiculos/${idUsuario}/`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Error al obtener vehículos');
      }
      const { vehiculos } = await response.json();
      if (!Array.isArray(vehiculos)) {
        throw new Error('Datos de vehículos no válidos');
      }
      setVehiculos(vehiculos);
    } catch (error) {
      setError('Error al obtener vehículos');
      console.error('Error fetching vehiculos:', error);
    }
  };

  const fetchMotivos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/OrdenesMovilizacion/listar-motivos/${userId}/`, {
        headers: {
          Authorization: `${token}`,
        },
      });

      if (!response.ok) throw new Error('Error al obtener motivos');

      const motivosData = await response.json();
      if (!Array.isArray(motivosData)) {
        throw new Error('Datos de motivos no válidos');
      }
      setMotivos(motivosData);
    } catch (error) {
      setError('Error al obtener motivos');
      console.error('Error fetching motivos:', error);
    }
  };

  const handleSearch = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchTerm(event.target.value);

    const filtered = solicitudes.filter(
      (solicitud) =>
        solicitud.lugar_origen_destino_movilizacion.toLowerCase().includes(searchValue) ||
        solicitud.motivo_movilizacion.toLowerCase().includes(searchValue) || 
        vehiculos.placa.toLowerCase().includes(searchValue) || 
        conductores.nombres.toLowerCase().includes(searchValue)  || 
        conductores.apellidos.toLowerCase().includes(searchValue)

    );

    setFilteredSolicitudes(filtered);
    setCurrentPage(1);
  };

  const handleClear = () => {
    setSearchTerm('');
    applyFilters();
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSolicitudes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSolicitudes.length / itemsPerPage);

  const handleClickSolicitarMovilizacion = () => {
    setShowSolicitar(true);
  };

  const handleCloseSolicitarMovilizacion = () => {
    setShowSolicitar(false);
    fetchSolicitudes(); 
  };

  const getConductorName = (id) => {
    const conductor = conductores.find((conductor) => conductor.id_empleado === id);
    return conductor ? `${conductor.nombres} ${conductor.apellidos}` : 'Desconocido';
  };
  
  const getVehiculoPlaca = (id) => {
    if (!Array.isArray(vehiculos)) return 'Desconocido';
    const vehiculo = vehiculos.find((vehiculo) => vehiculo.id_vehiculo === id);
    return vehiculo ? vehiculo.placa : 'Desconocido';
  };

  const getMotivoByOrderId = (ordenId) => {
    const motivo = motivos.find(m => m.id_orden_movilizacion === ordenId);
    return motivo ? motivo.motivo : 'No disponible';
  };
  
  if (showSolicitar) {
    return <SolicitarMovilizacion onClose={handleCloseSolicitarMovilizacion} />;
  }

  const handleVerClick = (ordenId) => {
    setSelectedOrderId(ordenId);
    setShowVer(true);
  };

  const handleCloseVer = () => {
    setShowVer(false);
    fetchSolicitudes(); 
  };

  if (showVer) {
    return <VerSolicitudMovilizacion orderId={selectedOrderId} onClose={handleCloseVer} />;
  }

  const handleEditClick = (ordenId) => {
    setSelectedOrderId(ordenId);
    setShowEditar(true);
  };


  const handleCloseEditarMovilizacion = () => {
    setShowEditar(false);
    fetchSolicitudes(); 
  };

  if (showEditar) {
    return <EditarSolicitudMovilizacion orderId={selectedOrderId} onClose={handleCloseEditarMovilizacion} />;
  }


  const openCancelModal = (ordenId) => {
    setSelectedOrderId(ordenId);
    setCancelModalVisible(true);
  };

  const openHabilitarModal = (ordenId) => {
    setSelectedOrderId(ordenId);
    setHabilitarModalVisible(true);
  };

  const closeCancelModal = () => {
    setCancelModalVisible(false);
  };

  const closeHabilitarModal = () => {
    setHabilitarModalVisible(false);
  };

  const handleCancelarOrden = () => {
    fetchSolicitudes();
  };

  const handleHabilitarOrden = () => {
    fetchSolicitudes();
  };


  const handleShowPending = () => {
    setViewMode('pendientes');
  };

  const handleShowCancelled = () => {
    setViewMode('canceladas');
  };

  const handleShowHistorial = () => {
    setViewMode('historial');
  };

  const handleShowHistorialMovilizaciones = () => {
    setViewMode('historialMovilizaciones');
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Lista de Solicitudes de Movilización</h2>
        
        <div className="flex items-center">
          <label htmlFor="viewModeSelect" className="mr-2">Ver:</label>
          <select
            id="viewModeSelect"
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="pendientes">Solicitudes Pendientes</option>
            <option value="canceladas">Solicitudes Canceladas</option>
            <option value="historial">Historial de Solicitudes</option>
            <option value="historialMovilizaciones">Historial de Movilizaciones</option>
          </select>

        </div>
        
        <div className="flex items-center">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={handleClickSolicitarMovilizacion}
            >
              Solicitar Movilización
            </button>
          </div>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="mb-4">
        <div className="flex">
          <input
            type="text"
            placeholder="Buscar"
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
              <th className="py-3 px-6 text-left">Origen - Destino</th>
              <th className="py-3 px-6 text-left">Motivo</th>
              <th className="py-3 px-6 text-left">Estado</th>
              <th className="py-3 px-6 text-left">Fecha y hora de salida</th>
              <th className="py-3 px-6 text-left">Duración</th>
              <th className="py-3 px-6 text-left">Conductor</th>
              <th className="py-3 px-6 text-left">Placa de Vehículo</th>
              <th className="py-3 px-6 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {currentItems.length > 0 ? (
              currentItems.map((solicitud, index) => (
                <tr key={index} className="border-b border-gray-300 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left whitespace-nowrap">{solicitud.lugar_origen_destino_movilizacion}</td>
                  <td className="py-3 px-6 text-left">{solicitud.motivo_movilizacion}</td>
                  <td className="py-3 px-6 text-left">{solicitud.estado_movilizacion}</td>
                  <td className="py-3 px-6 text-left">{`${solicitud.fecha_viaje} ${solicitud.hora_ida}`}</td>
                  <td className="py-3 px-6 text-left">{solicitud.duracion_movilizacion}</td>
                  <td className="py-3 px-6 text-left">{getConductorName(solicitud.id_conductor)}</td>
                  <td className="py-3 px-6 text-left">{getVehiculoPlaca(solicitud.id_vehiculo)}</td>
                  <td className="px-4 py-2 text-sm text-gray-600 flex space-x-2">
                  {solicitud.estado_movilizacion === 'Pendiente' && (
                    <>
                      <button
                        className="p-2 bg-blue-500 text-white rounded-full"
                        title="Editar Solicitud de Movilización"
                        onClick={() => handleEditClick(solicitud.id_orden_movilizacion)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="p-2 bg-green-500 text-white rounded-full"
                        title="Ver Solicitud de Movilización"
                        onClick={() => handleVerClick(solicitud.id_orden_movilizacion)}
                      >
                        <FaEye />
                      </button>
                      <button
                        className="p-2 bg-red-500 text-white rounded-full"
                        title="Cancelar Solicitud de Movilización"
                        onClick={() => openCancelModal(solicitud.id_orden_movilizacion)}
                        disabled={solicitud.habilitado === 0}
                      >
                        <FaBan />
                      </button>
                    </>
                  )}
                  {solicitud.estado_movilizacion === 'Cancelado' && (
                    <button
                      className="p-2 bg-green-500 text-white rounded-full"
                      title="Habilitar Solicitud de Movilización"
                      onClick={() => openHabilitarModal(solicitud.id_orden_movilizacion)}
                      disabled={solicitud.habilitado === 1}
                    >
                      Habilitar
                    </button>
                  )}
                  {(solicitud.estado_movilizacion === 'Aprobado' || solicitud.estado_movilizacion === 'Finalizado' || solicitud.estado_movilizacion === 'Denegado') && (
                    <div className="flex flex-col items-start">
                      <button
                        className="p-2 bg-green-500 text-white rounded-full"
                        title="Ver Solicitud de Movilización"
                        onClick={() => handleVerClick(solicitud.id_orden_movilizacion)}
                      >
                        <FaEye />
                      </button>
                      <span className="mt-2 text-gray-600">{getMotivoByOrderId(solicitud.id_orden_movilizacion)}</span>
                    </div>
                  )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-3 px-6 text-center">No se encontraron solicitudes.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div >
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
      <CancelarSolicitudMovilizacionModal
        ordenId={selectedOrderId}
        userId={userId}
        onCancel={handleCancelarOrden}
        visible={cancelModalVisible}
        onClose={closeCancelModal}
      />
      <HabilitarSolicitudMovilizacionModal
        ordenId={selectedOrderId}
        userId={userId}
        onHabilitar={handleHabilitarOrden}
        visible={habilitarModalVisible}
        onClose={closeHabilitarModal}
      />
    </div>
  );
};

export default ListarMovilizacion;
