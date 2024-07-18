import React, { useState, useEffect } from 'react';
import { FaBan, FaEye, FaCheck } from 'react-icons/fa';
import API_URL from '../../../Config';
import VerSolicitudMovilizacion from './VerSolicitudMovilizacion';
import AprobarSolicitudesModal from './AprobarSolicitudMovilizacion';
import RechazarSolicitudesModal from './RechazarSolicitudMovilizacion';

const ListarMovilizaciones = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [conductores, setConductores] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [showVer, setShowVer] = useState(false);
  const [showAprobarModal, setShowAprobarModal] = useState(false);
  const [showRechazarModal, setShowRechazarModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
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
    fetchSolicitudes();
    fetchConductores();
    fetchVehiculos();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [solicitudes, viewMode]);

  const applyFilters = () => {
    let filtered = [];
    if (viewMode === 'pendientes') {
      filtered = solicitudes.filter(
        (solicitud) => solicitud.estado_movilizacion === 'En Espera' && solicitud.habilitado === 1
      );
    } else if (viewMode === 'aprobadas') {
      filtered = solicitudes.filter((solicitud) => solicitud.estado_movilizacion === 'Aprobado');
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

  const handleSearch = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchTerm(event.target.value);
  
    const filtered = solicitudes.filter((solicitud) => {
      const lugarOrigenDestino = solicitud.lugar_origen_destino_movilizacion?.toLowerCase() || '';
      const motivo = solicitud.motivo_movilizacion?.toLowerCase() || '';
      const placa = vehiculos.find(vehiculo => vehiculo.id_vehiculo === solicitud.id_vehiculo)?.placa?.toLowerCase() || '';
      const conductorNombre = conductores.find(conductor => conductor.id_empleado === solicitud.id_empleado)?.nombres?.toLowerCase() || '';
      const conductorApellido = conductores.find(conductor => conductor.id_empleado === solicitud.id_empleado)?.apellidos?.toLowerCase() || '';
  
      return (
        lugarOrigenDestino.includes(searchValue) ||
        motivo.includes(searchValue) ||
        placa.includes(searchValue) ||
        conductorNombre.includes(searchValue) ||
        conductorApellido.includes(searchValue)
      );
    });
  
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

  const handleAccept = (idOrden) => {
    setSelectedOrderId(idOrden);
    setShowAprobarModal(true);
  };
  
  const handleReject = (idOrden) => {
    setSelectedOrderId(idOrden);
    setShowRechazarModal(true);
  };
  
  const handleConfirmAprobar = async (motivo) => {
    // Lógica para aprobar la solicitud con el motivo
    console.log(`Solicitud ${selectedOrderId} aceptada con motivo: ${motivo}`);
    setShowAprobarModal(false);
    fetchSolicitudes();
  };
  
  const handleConfirmRechazar = async (motivo) => {
    // Lógica para rechazar la solicitud con el motivo
    console.log(`Solicitud ${selectedOrderId} rechazada con motivo: ${motivo}`);
    setShowRechazarModal(false);
    fetchSolicitudes();
  };
  
  const handleCancelModal = () => {
    setShowAprobarModal(false);
    setShowRechazarModal(false);
  };

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-2xl font-bold text-center mb-4">Lista de Movilizaciones</h2>

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
              <th className="py-3 px-6 text-left">Funcionario</th>
              <th className="py-3 px-6 text-left">Fecha y hora de salida</th>
              <th className="py-3 px-6 text-left">Duración</th>
              <th className="py-3 px-6 text-left">Conductor</th>
              <th className="py-3 px-6 text-left">Placa de Vehículo</th>
              <th className="py-3 px-6 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {solicitudes.map((solicitud, index) => (
              <tr key={index} className="border-b border-gray-300 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">{solicitud.lugar_origen_destino_movilizacion}</td>
                <td className="py-3 px-6 text-left">{solicitud.motivo_movilizacion}</td>
                <td className="py-3 px-6 text-left">{solicitud.estado_movilizacion}</td>
                <td className="py-3 px-6 text-left">{getConductorName(solicitud.id_empleado)}</td>
                <td className="py-3 px-6 text-left">{solicitud.fecha_hora_emision}</td>
                <td className="py-3 px-6 text-left">{solicitud.duracion_movilizacion}</td>
                <td className="py-3 px-6 text-left">{getConductorName(solicitud.id_conductor)}</td>
                <td className="py-3 px-6 text-left">{getVehiculoPlaca(solicitud.id_vehiculo)}</td>
                <td className="px-4 py-2 text-sm text-gray-600 flex space-x-2">
                  <button
                    className="p-2 bg-green-500 text-white rounded-full"
                    title="Aceptar"
                    onClick={() => handleAccept(solicitud.id_orden_movilizacion)}
                  >
                    <FaCheck />
                  </button>
                  <button
                    className="p-2 bg-yellow-500 text-white rounded-full"
                    title="Ver"
                    onClick={() => handleVerClick(solicitud.id_orden_movilizacion)}
                  >
                    <FaEye />
                  </button>
                  <button
                    className="p-2 bg-red-500 text-white rounded-full"
                    title="Rechazar"
                    onClick={() => handleReject(solicitud.id_orden_movilizacion)}
                  >
                    <FaBan />
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

    </div>
  );
};

export default ListarMovilizaciones;
