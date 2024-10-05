import React, { useState, useEffect } from "react";
import API_URL from "../../../Config";
import AgregarEmpleados from "./agregarempleado";
import TablaEmpleados from "./Tablas/tablaempleadoshabilitados";
import EditarUsuario from "./editarusuario";
import HabilitarEmpleado from "./habilitarempleado";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEye } from "@fortawesome/free-solid-svg-icons";

const GestionEmpleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [filteredEmpleados, setFilteredEmpleados] = useState([]);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);
  const [cargos, setCargos] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isHabilitarEmpleadoVisible, setIsHabilitarEmpleadoVisible] =
    useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      fetchEmpleados(storedUser.usuario.id_usuario);
      fetchCargos();
    }
  }, []);

  const fetchEmpleados = async (id_usuario) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(
        `${API_URL}/Empleados/lista-empleados/${id_usuario}/`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        const formattedData = data.map((empleado) => ({
          ...empleado,
          numero_cedula: empleado.cedula,
          fecha_nacimiento: empleado.fecha_nacimiento,
          celular: empleado.celular || "",
          direccion: empleado.direccion || "",
          correo_electronico: empleado.correo_electronico || "",
          cargo: empleado.cargo || "",
          fecha_ingreso: empleado.fecha_ingreso || "",
          habilitado: empleado.habilitado || "",
          usuario: empleado.usuario || "",
          distintivo: empleado.distintivo || "",
        }));
        setEmpleados(formattedData);
        setFilteredEmpleados(formattedData);
      } else {
        console.error("Error al obtener empleados:", response.statusText);
      }
    } catch (error) {
      console.error("Error al obtener empleados:", error);
    }
  };

  const refreshEmpleados = () => {
    if (user) {
      fetchEmpleados(user.usuario.id_usuario);
    }
  };

  const fetchCargos = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/Cargos/cargoseditar/`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setCargos(data);
      } else {
        console.error("Error al obtener cargos:", response.statusText);
      }
    } catch (error) {
      console.error("Error al obtener cargos:", error);
    }
  };

  const handleSearch = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchTerm(event.target.value);

    const filtered = empleados.filter((empleado) => {
      const fullName = `${empleado.nombres.toLowerCase()} ${empleado.apellidos.toLowerCase()}`;
      const cedula = empleado.cedula.toLowerCase();
      return fullName.includes(searchValue) || cedula.includes(searchValue);
    });

    setFilteredEmpleados(filtered);
    setCurrentPage(1);
  };

  const handleClear = () => {
    setSearchTerm("");
    setFilteredEmpleados(empleados);
    setCurrentPage(1);
  };

  const handleEditEmpleado = async (empleado) => {
    setSelectedEmpleado(empleado);

    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/Empleados/detalle-empleado/${user.usuario.id_usuario}/${empleado.id_empleado}/`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setSelectedEmpleado({
          ...empleado,
          ...data,
        });
      } else {
        console.error(
          "Error al obtener detalle de empleado:",
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error al obtener detalle de empleado:", error);
    }
  };

  const handleCloseEditForm = () => {
    setSelectedEmpleado(null);
  };

  const handleAddEmpleado = () => {
    setIsAdding(true);
  };

  const handleCloseAddForm = () => {
    setIsAdding(false);
  };

  const handleShowHabilitarEmpleado = () => {
    setIsHabilitarEmpleadoVisible(true);
  };

  const handleCloseHabilitarEmpleado = () => {
    setIsHabilitarEmpleadoVisible(false);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEmpleados.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredEmpleados.length / itemsPerPage);

  const handleClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="p-4 mt-16">
      {selectedEmpleado ? (
        <EditarUsuario
          empleado={selectedEmpleado}
          onClose={handleCloseEditForm}
          user={user}
          fetchEmpleados={fetchEmpleados}
        />
      ) : isAdding ? (
        <AgregarEmpleados
          onClose={handleCloseAddForm}
          cargos={cargos}
          user={user}
          fetchEmpleados={fetchEmpleados}
          refreshEmpleados={refreshEmpleados}
        />
      ) : isHabilitarEmpleadoVisible && user ? (
        <HabilitarEmpleado
          user={user}
          fetchEmpleados={fetchEmpleados}
          onVolver={handleCloseHabilitarEmpleado}
        />
      ) : (
        <>
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-4 md:space-y-0 md:space-x-4">
            <h1 className="text-2xl font-light">Gestión de Empleados</h1>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <button
                onClick={handleShowHabilitarEmpleado}
                className="bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-2 px-4 border-b-4 
      border-yellow-700 hover:border-yellow-300 rounded"
              >
                <FontAwesomeIcon icon={faEye} className="mr-2" />
                Ver Empleados Deshabilitados
              </button>
              <button
                onClick={handleAddEmpleado}
                className="bg-green-700 hover:bg-green-600 text-white font-bold py-2 px-4 
      border-b-4 border-green-900 hover:border-green-300 rounded"
              >
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Agregar Empleado
              </button>
            </div>
          </div>
          <div className="mb-4">
            <div className="flex flex-col md:flex-row">
              <input
                type="text"
                placeholder="Buscar por nombres, apellidos o cédula"
                value={searchTerm}
                onChange={handleSearch}
                className="w-full p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                className="
                  bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 border-b-4 border-blue-300 
                  hover:border-blue-700 rounded
                  mt-2 md:mt-0 md:ml-2"
                onClick={handleClear}
                style={{ minWidth: "80px" }}
              >
                Limpiar
              </button>
            </div>
          </div>
          <TablaEmpleados
            empleados={currentItems}
            handleEditEmpleado={handleEditEmpleado}
            user={user}
            fetchEmpleados={fetchEmpleados}
          />
          <div className="flex flex-col md:flex-row justify-between items-center mt-4 space-y-4 md:space-y-0">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="
    bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 border-b-4 border-gray-600 hover:border-gray-500 rounded"
            >
              Anterior
            </button>
            <span className="text-center md:text-left">{`Página ${currentPage} de ${totalPages}`}</span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 border-b-4 border-gray-600 hover:border-gray-500 rounded"
            >
              Siguiente
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default GestionEmpleados;
