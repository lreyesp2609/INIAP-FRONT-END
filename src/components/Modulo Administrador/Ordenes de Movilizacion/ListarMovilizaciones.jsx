import React, { useState, useEffect } from 'react';
import { FaBan, FaEye, FaCheck, FaEdit, FaFilePdf } from 'react-icons/fa';
import API_URL from '../../../Config';
import VerSolicitudMovilizacion from './VerSolicitudMovilizacion';
import AprobarSolicitudesModal from './AprobarSolicitudMovilizacion';
import RechazarSolicitudesModal from './RechazarSolicitudMovilizacion';
import EditarSolicitudMovilizacion from './EditarMotivoSolicitud';

const ListarMovilizaciones = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [conductores, setConductores] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [motivos, setMotivos] = useState([]);
  const [showVer, setShowVer] = useState(false);
  const [showAprobarModal, setShowAprobarModal] = useState(false);
  const [showRechazarModal, setShowRechazarModal] = useState(false);
  const [showEditarModal, setShowEditarModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedMotivoId, setSelectedMotivoId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSolicitudes, setFilteredSolicitudes] = useState([]);
  const [viewMode, setViewMode] = useState('pendientes');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const userId = storedUser?.usuario?.id_usuario;  

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const idUsuario = storedUser?.usuario?.id_usuario;
  
    if (idUsuario) {
      fetchSolicitudes();
      fetchConductores();
      fetchVehiculos();
      fetchMotivos(idUsuario);
    }
  }, []);
  
  useEffect(() => {
    if (solicitudes.length > 0) {
      applyFilters();
    }
  }, [solicitudes, viewMode]);
  

  const applyFilters = () => {
    let filtered = [];
    if (viewMode === 'pendientes') {
      filtered = solicitudes.filter(
        (solicitud) => solicitud.estado_movilizacion === 'Pendiente' && solicitud.habilitado === 1
      );
    } else if (viewMode === 'aprobadas') {
      filtered = solicitudes.filter((solicitud) => solicitud.estado_movilizacion === 'Aprobado');
    } else if (viewMode === 'rechazadas') {
      filtered = solicitudes.filter((solicitud) => solicitud.estado_movilizacion === 'Denegado');
    } else if (viewMode === 'historial') {
      filtered = solicitudes.filter(
        (solicitud) => solicitud.estado_movilizacion === 'Denegado' || solicitud.estado_movilizacion === 'Aprobado'
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

      const response = await fetch(`${API_URL}/OrdenesMovilizacion/listar-todas-orden/${idUsuario}/`, {
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
      setMotivosLoaded(true);
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Error al obtener motivos',
      });
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
        getVehiculoPlaca(solicitud.id_vehiculo).toLowerCase().includes(searchValue) ||
        getConductorName(solicitud.id_conductor).toLowerCase().includes(searchValue)
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

  const getConductorName = (id) => {
    const conductor = conductores.find((conductor) => conductor.id_empleado === id);
    return conductor ? `${conductor.nombres} ${conductor.apellidos}` : 'Desconocido';
  };
  
  const getVehiculoPlaca = (id) => {
    if (!Array.isArray(vehiculos)) return 'Desconocido';
    const vehiculo = vehiculos.find((vehiculo) => vehiculo.id_vehiculo === id);
    return vehiculo ? vehiculo.placa : 'Desconocido';
  };

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


  const getMotivos = (idOrden) => {
    return motivos.find((m) => m.id_orden_movilizacion === idOrden) || {};
  };  
  

  const handleAccept = (idOrden) => {
    setSelectedOrderId(idOrden);
    fetchMotivos(userId);
    setShowAprobarModal(true);
  };
  
  const handleReject = (idOrden) => {
    setSelectedOrderId(idOrden);
    fetchMotivos(userId);
    setShowRechazarModal(true);
  };
  
  const handleConfirmAprobar = async (motivo) => {
    setShowAprobarModal(false);
    fetchSolicitudes();
    await fetchSolicitudes();
    await fetchMotivos(userId);
  };
  
  const handleConfirmRechazar = async (motivo) => {
    setShowRechazarModal(false);
    fetchSolicitudes();
    await fetchSolicitudes();
    await fetchMotivos(userId);
  };

  const handleEdit = (ordenId, motivoId) => {
    setSelectedOrderId(ordenId);
    setSelectedMotivoId(motivoId);
    fetchMotivos(userId);
    setShowEditarModal(true);
  };

  const handleCloseEditarModal = () => {
    setShowEditarModal(false);
    setSelectedOrderId(null);
    fetchMotivos(userId);
    fetchSolicitudes();
  };

  const handleCancelModal = () => {
    setShowAprobarModal(false);
    setShowRechazarModal(false);
    fetchMotivos(userId);
    setShowEditarModal(false);
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Lista de Movilizaciones</h2>
        
        <div className="flex items-center">
          <label htmlFor="viewModeSelect" className="mr-2">Ver:</label>
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
            {(viewMode !== 'pendientes') && (
                <>
                  <th className="py-3 px-6 text-left">Fecha</th>
                  <th className="py-3 px-6 text-left">Administrador</th>
                  <th className="py-3 px-6 text-left">Observación</th>
                </>
              )}
              <th className="py-3 px-6 text-left">Estado</th>
              <th className="py-3 px-6 text-left">Origen - Destino</th>
              <th className="py-3 px-6 text-left">Motivo</th>
              <th className="py-3 px-6 text-left">Fecha y hora de salida</th>
              <th className="py-3 px-6 text-left">Funcionario</th>
              <th className="py-3 px-6 text-left">Conductor</th>
              <th className="py-3 px-6 text-left">Placa de Vehículo</th>
              <th className="py-3 px-6 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {filteredSolicitudes.length > 0 ? (
              filteredSolicitudes.map((solicitud, index) => {
            
                const motivosOrden = getMotivos(solicitud.id_orden_movilizacion);
                return (
                  <tr key={index} className="border-b border-gray-300 hover:bg-gray-100">
                    {(viewMode !== 'pendientes') && (
                      <>
                        <td className="py-3 px-6 text-left">{motivosOrden.fecha}</td>
                        <td className="py-3 px-6 text-left">{getConductorName(motivosOrden.id_empleado)}</td>
                        <td className="py-3 px-6 text-left">{motivosOrden.motivo}</td>
                      </>
                    )}
                    <td className="py-3 px-6 text-left">{solicitud.estado_movilizacion}</td>
                    <td className="py-3 px-6 text-left">{solicitud.lugar_origen_destino_movilizacion}</td>
                    <td className="py-3 px-6 text-left">{solicitud.motivo_movilizacion}</td>
                    <td className="py-3 px-6 text-left">{`${solicitud.fecha_viaje} ${solicitud.hora_ida}`}</td>
                    <td className="py-3 px-6 text-left">{getConductorName(solicitud.id_empleado)}</td>
                    <td className="py-3 px-6 text-left">{getConductorName(solicitud.id_conductor)}</td>
                    <td className="py-3 px-6 text-left">{getVehiculoPlaca(solicitud.id_vehiculo)}</td>
                    <td className="px-4 py-2 text-sm text-gray-600 flex space-x-2">
                      <button 
                      className="p-2 bg-yellow-500 text-white rounded-full"
                      title="Ver"
                      onClick={() => handleVerClick(solicitud.id_orden_movilizacion)}
                      >
                        <FaEye />
                      </button>
                      {solicitud.estado_movilizacion === 'Pendiente' && solicitud.habilitado === 1 && (
                        <>
                          <button 
                          className="p-2 bg-green-500 text-white rounded-full"
                          title="Aceptar"
                          onClick={() => handleAccept(solicitud.id_orden_movilizacion)}
                          >
                            <FaCheck />
                          </button>
                          <button 
                          className="p-2 bg-red-500 text-white rounded-full"
                          title="Rechazar"
                          onClick={() => handleReject(solicitud.id_orden_movilizacion)}
                          >
                            <FaBan />
                          </button>
                        </>
                      )}
                      {solicitud.estado_movilizacion === 'Aprobado' && (
                        <>
                          <button
                          className="p-2 bg-blue-500 text-white rounded-full"
                          title="Editar Motivo"
                          onClick={() => handleEdit(solicitud.id_orden_movilizacion, motivosOrden.id_motivo_orden)}
                          >
                            <FaEdit />
                          </button>
                          <button
                          className="p-2 bg-red-500 text-white rounded-full"
                          title="Exportar PDF"
                          onClick={() => handlePDF(solicitud.id_orden_movilizacion)}
                          >
                            <FaFilePdf />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })
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
  
      <AprobarSolicitudesModal
        ordenId={selectedOrderId}
        userId={userId}
        visible={showAprobarModal}
        onAprobar={handleConfirmAprobar}
        onClose={handleCancelModal}
      />
      <RechazarSolicitudesModal
        ordenId={selectedOrderId}
        userId={userId}
        visible={showRechazarModal}
        onRechazar={handleConfirmRechazar}
        onClose={handleCancelModal}
      />

      <EditarSolicitudMovilizacion
        ordenId={selectedOrderId}
        userId={userId}
        motivoId={selectedMotivoId}
        visible={showEditarModal}
        onClose={handleCloseEditarModal}
        onEditar={fetchSolicitudes}
      />

    </div>
  );
  
};

export default ListarMovilizaciones;
