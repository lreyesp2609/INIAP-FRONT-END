import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEye } from '@fortawesome/free-solid-svg-icons';
import CrearInforme from './CrearInforme';
import API_URL from '../../Config';

const ListarSolicitudes = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [filteredSolicitudes, setFilteredSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false); // Estado para mostrar/ocultar el modal

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  const fetchSolicitudes = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const idUsuario = storedUser.usuario.id_usuario;

      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token no encontrado');

      const response = await fetch(`${API_URL}/Informes/listar-solicitudes/${idUsuario}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
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

  const handleSearch = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchTerm(event.target.value);

    const filtered = solicitudes.filter(
      (solicitud) =>
        solicitud.numero_solicitud.toLowerCase().includes(searchValue) ||
        solicitud.motivo_movilizacion.toLowerCase().includes(searchValue) ||
        solicitud.estado_solicitud.toLowerCase().includes(searchValue)
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

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-light">Solicitudes del Usuario</h1>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={toggleModal} // Abre el modal al hacer clic en este botón
        >
          Crear Solicitud
        </button>
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
              <th className="py-3 px-6 text-left">ID Solicitud</th>
              <th className="py-3 px-6 text-left">Número Solicitud</th>
              <th className="py-3 px-6 text-left">Fecha Solicitud</th>
              <th className="py-3 px-6 text-left">Motivo Movilización</th>
              <th className="py-3 px-6 text-left">Estado Solicitud</th>
              <th className="py-3 px-6 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {currentItems.map((solicitud) => (
              <tr key={solicitud.id_solicitud} className="border-b border-gray-300 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">{solicitud.id_solicitud}</td>
                <td className="py-3 px-6 text-left">{solicitud.numero_solicitud}</td>
                <td className="py-3 px-6 text-left">{solicitud.fecha_solicitud}</td>
                <td className="py-3 px-6 text-left">{solicitud.motivo_movilizacion}</td>
                <td className="py-3 px-6 text-left">{solicitud.estado_solicitud}</td>
                <td className="py-3 px-6 text-left">
                  <button className="text-blue-500 hover:text-blue-700 mr-2">
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                  <button className="text-red-500 hover:text-red-700">
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
        >
          Anterior
        </button>
        <span>{`Página ${currentPage} de ${totalPages}`}</span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        >
          Siguiente
        </button>
      </div>

      {/* Modal para crear informe */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full sm:w-96">
            <CrearInforme
              idUsuario={1} // Aquí debes pasar el ID del usuario actual según tu lógica
              onClose={toggleModal} // Función para cerrar el modal
              fetchSolicitudes={fetchSolicitudes} // Función para actualizar la lista de solicitudes
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ListarSolicitudes;
