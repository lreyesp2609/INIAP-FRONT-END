import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEye, faEdit } from '@fortawesome/free-solid-svg-icons';
import CrearSolicitud from './CrearSolicitud';
import ListarSolicitudesAceptadas from './ListarSolicitudesAceptado';
import ListarSolicitudesCanceladas from './ListarSolicitudesCancelada';
import API_URL from '../../../Config';

const ListarSolicitudesPendientes = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [filteredSolicitudes, setFilteredSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedOption, setSelectedOption] = useState('pendientes');

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  const fetchSolicitudes = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const idUsuario = storedUser.usuario.id_usuario;
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token no encontrado');

      const url = `${API_URL}/Informes/listar-solicitudes/${idUsuario}/`;
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

  const handleCreateSolicitud = () => {
    setIsCreating(true);
  };

  const handleCloseCreateSolicitud = () => {
    setIsCreating(false);
    fetchSolicitudes(); // Volver a cargar las solicitudes después de crear una nueva
  };

  const renderComponent = () => {
    switch (selectedOption) {
      case 'pendientes':
        return (
          <>
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-light">Solicitudes Pendientes del Usuario</h1>
            </div>
            <div className="mb-4">
              <div className="flex">
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
                        <button className="text-yellow-500 hover:text-yellow-700 mr-2">
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button className="text-blue-500 hover:text-blue-700 mr-2">
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                        <button className="text-red-500 hover:text-red-700 mr-2">
                          <FontAwesomeIcon icon={faTrashAlt} />
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
        );
      case 'aceptadas':
        return <ListarSolicitudesAceptadas />;
      case 'canceladas':
        return <ListarSolicitudesCanceladas />;
      default:
        return <ListarSolicitudesPendientes />;
    }
  };

  return (
    <div className="p-4">
      {isCreating ? (
        <CrearSolicitud onClose={handleCloseCreateSolicitud} />
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-light">Gestion de Solicitudes</h1>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={handleCreateSolicitud}
            >
              Crear Solicitud
            </button>
          </div>
          <div className="mb-4">
            <label htmlFor="solicitudes-dropdown" className="mr-2">Mostrar solicitudes:</label>
            <select
              id="solicitudes-dropdown"
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
              className="p-2 border border-gray-300 rounded"
            >
              <option value="pendientes">Pendientes</option>
              <option value="aceptadas">Aceptadas</option>
              <option value="canceladas">Canceladas</option>
            </select>
          </div>
          {renderComponent()}
        </>
      )}
    </div>
  );
};

export default ListarSolicitudesPendientes;
