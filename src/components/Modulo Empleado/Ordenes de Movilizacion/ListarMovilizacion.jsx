import React, { useState, useEffect } from 'react';
import API_URL from '../../../Config';
import { FaEdit, FaBan, FaEye } from 'react-icons/fa';
import SolicitarMovilizacion from './SolicitarMovilizacion';
import EditarSolicitudMovilizacion from './EditarSolicitudMovilizacion';

const ListarMovilizacion = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [filteredSolicitudes, setFilteredSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showSolicitar, setShowSolicitar] = useState(false);
  const [conductores, setConductores] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [showCancelled, setShowCancelled] = useState(false);
  const [showEditar, setShowEditar] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);



  useEffect(() => {
    if (solicitudes.length > 0) {
      const initialFiltered = solicitudes.filter(
        (solicitud) => solicitud.estado_movilizacion === "En Espera" && solicitud.habilitado === 1
      );
      setFilteredSolicitudes(initialFiltered);
    }
  }, [solicitudes]);

  useEffect(() => {
    fetchSolicitudes();
    fetchConductores();
    fetchVehiculos();
  }, []);

  const handleShowCancelled = () => {
    setShowCancelled(!showCancelled);
    const filtered = showCancelled
      ? solicitudes.filter(
          (solicitud) => solicitud.estado_movilizacion === "En Espera" && solicitud.habilitado === 1
        )
      : solicitudes.filter((solicitud) => solicitud.habilitado === 0);
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
      setFilteredSolicitudes(data);
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

    const filtered = solicitudes.filter(
      (solicitud) =>
        solicitud.lugar_origen_destino_movilizacion.toLowerCase().includes(searchValue) ||
        solicitud.motivo_movilizacion.toLowerCase().includes(searchValue)
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
  
  if (showSolicitar) {
    return <SolicitarMovilizacion onClose={handleCloseSolicitarMovilizacion} />;
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

  const handleCancelClick = async (ordenId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token no encontrado');
      }
  
      const response = await fetch(`${API_URL}/OrdenesMovilizacion/cancelar-orden/${ordenId}/`, {
        method: 'PUT',
        headers: {
          Authorization: `${token}`, 
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al cancelar orden de movilización');
      }
  
      const data = await response.json();
      console.log(data.mensaje); 
  
      fetchSolicitudes(); 
    } catch (error) {
      console.error('Error al cancelar orden:', error.message);
      setError(error.message);
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-center">Lista de Solicitudes de Movilización</h2>
        <button
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 ml-4"
          onClick={handleShowCancelled}
        >
          {showCancelled ? "Ocultar Canceladas" : "Ver Solicitudes Canceladas"}
        </button>

        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={handleClickSolicitarMovilizacion}
        >
          Solicitar Movilización
        </button>
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="mb-4">
        <div className="flex">
          <input
            type="text"
            placeholder="Buscar por origen-destino, motivo o fecha"
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
                    >
                      <FaEye />
                    </button>
                    <button
                      className="p-2 bg-red-500 text-white rounded-full"
                      title="Cancelar Solicitud de Movilización"
                      onClick={() => handleCancelClick(solicitud.id_orden_movilizacion)}
                    >
                      <FaBan />
                    </button>
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
    </div>
  );
};

export default ListarMovilizacion;
