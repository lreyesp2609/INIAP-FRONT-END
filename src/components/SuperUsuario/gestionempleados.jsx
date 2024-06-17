import React, { useState, useEffect } from 'react';
import API_URL from '../../Config';
import EditarEmpleados from './editarusuario';
import TablaEmpleados from './tablaempleados';

const GestionEmpleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [filteredEmpleados, setFilteredEmpleados] = useState([]);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);
  const [cargos, setCargos] = useState([]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
      fetchEmpleados(storedUser.usuario.id_usuario);
      fetchCargos();
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
        const formattedData = data.map(empleado => ({
          ...empleado,
          numero_cedula: empleado.cedula,
          fecha_nacimiento: empleado.fecha_nacimiento,
          celular: empleado.celular || '',
          direccion: empleado.direccion || '', 
          correo_electronico: empleado.correo_electronico || '',
          cargo: empleado.cargo|| '',
          fecha_ingreso: empleado.fecha_ingreso || '',
          habilitado: empleado.habilitado || '',  
          usuario: empleado.usuario || ''
        }));        
        setEmpleados(formattedData);
        setFilteredEmpleados(formattedData);
      } else {
        console.error('Error fetching empleados:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching empleados:', error);
    }
  };
  const fetchCargos = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }
  
    try {
      const response = await fetch(`${API_URL}/Estaciones/cargos/`, {
        headers: {
          'Authorization': `${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Cargos data:", data);
        setCargos(data);
      } else {
        console.error('Error fetching cargos:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching cargos:', error);
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
    setCurrentPage(1);
  };

  const handleClear = () => {
    setSearchTerm('');
    setFilteredEmpleados(empleados);
    setCurrentPage(1);
  };

  const handleEditEmpleado = (empleado) => {
    setSelectedEmpleado(empleado);
  };

  const handleCloseEditForm = () => {
    setSelectedEmpleado(null);
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
      {selectedEmpleado ? (
        <EditarEmpleados
          onClose={handleCloseEditForm}
          employeeData={selectedEmpleado}
          cargos={cargos}
          user={user}
        />
      ) : (
        <>
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
              onClick={() => {}}
              style={{ minWidth: '200px' }}
            >
              Agregar Empleado
            </button>
          </div>
          <TablaEmpleados empleados={currentItems} handleEditEmpleado={handleEditEmpleado} />
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
        </>
      )}
    </div>
  );
};

export default GestionEmpleados;
