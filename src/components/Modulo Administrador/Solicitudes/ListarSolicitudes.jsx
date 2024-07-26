import React, { useState, useEffect } from 'react';
import { FaBan, FaEye, FaCheck, FaEdit, FaFilePdf } from 'react-icons/fa';
import API_URL from '../../../Config';


const ListarSolicitudes = () => {
    const [solicitudes, setSolicitudes] = useState([]);
    const [filteredSolicitudes, setFilteredSolicitudes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
  
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
  
  
    return (
      <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-light">Solicitudes de Viajes</h1>
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
                      <td className="px-4 py-2 text-sm text-gray-600 flex space-x-2">
                        <button 
                        className="p-2 bg-yellow-500 text-white rounded-full"
                        title="Ver"
                        >
                            <FaEye />
                        </button>
                        {solicitud.estado_movilizacion === 'Pendiente' && (
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
                        <button
                        className="p-2 bg-red-500 text-white rounded-full"
                        title="Exportar PDF"
                        onClick={() => handlePDF(solicitud.id_orden_movilizacion)}
                        >
                            <FaFilePdf />
                        </button>
                        )}
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
      </div>
    );
  };
  
  export default ListarSolicitudes;