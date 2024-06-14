import React, { useState, useEffect } from 'react';
import API_URL from '../../Config';

const GestionEmpleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [filteredEmpleados, setFilteredEmpleados] = useState([]);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
      fetchEmpleados(storedUser.usuario.id_usuario);
    }
  }, []);

  const fetchEmpleados = async (id_usuario) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/Empleados/lista-empleados/${id_usuario}/`, {
        headers: {
          'Authorization': `${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setEmpleados(data);
        setFilteredEmpleados(data);
      } else {
        console.error('Error fetching empleados:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching empleados:', error);
    }
  };

  const handleSearch = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchTerm(event.target.value);

    const filtered = empleados.filter((empleado) => {
      const fullName = `${empleado.nombres.toLowerCase()} ${empleado.apellidos.toLowerCase()}`;
      const cedula = empleado.cedula.toLowerCase();
      return (
        fullName.includes(searchValue) ||
        cedula.includes(searchValue)
      );
    });

    setFilteredEmpleados(filtered);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleClear = () => {
    setSearchTerm('');
    setFilteredEmpleados(empleados);
    setCurrentPage(1); // Reset to first page on clear
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleAddEmpleado = async (empleadoData) => {
    // Realizar solicitud POST al backend para agregar el nuevo empleado
    // Una vez completada la operación, cerrar el modal y actualizar la lista de empleados
    handleCloseModal();
    fetchEmpleados(user.usuario.id_usuario);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEmpleados.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEmpleados.length / itemsPerPage);

  const handleClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="flex-grow flex flex-col items-center p-4">
      <h1 className="text-2xl font-light mb-4">Hola {user?.usuario?.rol}</h1>
      <div className="w-full flex mb-4 items-center">
        <input
          type="text"
          placeholder="Buscar por nombres, apellidos o cédula"
          value={searchTerm}
          onChange={handleSearch}
          className="p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-3/4"
          style={{ minWidth: '200px' }}
        />
        <button
          className="p-2 bg-blue-500 text-white hover:bg-blue-600 focus:outline-none"
          onClick={handleClear}
          style={{ minWidth: '80px', borderRadius: '0 0.375rem 0.375rem 0' }}
        >
          Limpiar
        </button>
        <button
          className="ml-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
          onClick={handleOpenModal}
          style={{ minWidth: '200px' }}
        >
          Agregar Empleado
        </button>
      </div>
      <div className="overflow-x-auto w-full">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Nombres</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Apellidos</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Cédula</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Usuario</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Cargo</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Unidad</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Estación</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((empleado, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-600">{empleado.nombres}</td>
                <td className="px-4 py-2 text-sm text-gray-600">{empleado.apellidos}</td>
                <td className="px-4 py-2 text-sm text-gray-600">{empleado.cedula}</td>
                <td className="px-4 py-2 text-sm text-gray-600">{empleado.usuario}</td>
                <td className="px-4 py-2 text-sm text-gray-600">{empleado.cargo}</td>
                <td className="px-4 py-2 text-sm text-gray-600">{empleado.nombre_unidad}</td>
                <td className="px-4 py-2 text-sm text-gray-600">{empleado.nombre_estacion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handleClick(index + 1)}
            className={`mx-1 px-3 py-1 border rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
      {showModal && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-8 rounded shadow-lg w-96">
            {/* Aquí va el modal para agregar empleado */}
            {/* Puedes implementar el modal y el formulario aquí */}
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionEmpleados;
