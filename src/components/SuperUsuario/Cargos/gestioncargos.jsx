import React, { useState, useEffect, useRef } from "react";
import API_URL from "../../../Config";
import AgregarCargo from "./agregarcargos";
import TablaGestionCargos from "./Tablas/tablagestioncargos";
import EditarCargo from "./EditarCargo"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faArrowLeft } from "@fortawesome/free-solid-svg-icons";


const GestionCargos = () => {
  const [cargos, setCargos] = useState([]);
  const [filteredCargos, setFilteredCargos] = useState([]);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isAdding, setIsAdding] = useState(false);
  const forceUpdate = useRef(0);
  const [cargoToEdit, setCargoToEdit] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      fetchCargos(storedUser.usuario.id_usuario);
    }
  },[]);


  const fetchCargos = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }

    try {
      const formData = new FormData();
      const response = await fetch(
        `${API_URL}/Cargos/cargosall/`,
        {
          method: "POST",
          headers: {
            Authorization: `${token}`,
          },
          body: formData,
        }
      );
      if (response.ok) {
        const data = await response.json();
        setCargos(data);
        setFilteredCargos(data);
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

    const filtered = cargos.filter((cargo) => {
      return cargo.cargo.toLowerCase().includes(searchValue);
    });

    setFilteredCargos(filtered);
    setCurrentPage(1);
  };

  const handleClear = () => {
    setSearchTerm("");
    setFilteredCargos(cargos);
    setCurrentPage(1);
  };

  const handleAddCargo = () => {
    setIsAdding(true);
  };

  const handleCloseAddForm = () => {
    setIsAdding(false);
    fetchCargos(user.usuario.id_usuario, id_unidad);
  };

  const handleEditCargos = (cargo) => {
    setCargoToEdit(cargo);
    setIsEditing(true);
  };
  const handleCancelEdit = () => {
    setIsEditing(false);
    setCargoToEdit(null);
  };
  const handleActualizacion = () => {
    fetchCargos(userId);
    setIsEditing(false);
  };
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCargos.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCargos.length / itemsPerPage);

  const handleClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (!user) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="p-4 mt-16"> {/* Ajusta 'mt-16' según la altura del navbar */}
    {isAdding ? (
      <AgregarCargo onClose={handleCloseAddForm} user={user.usuario} />
    ) : isEditing ? (
      <EditarCargo
        cargo={cargoToEdit}
        onCancel={handleCancelEdit}
        onActualizacion={handleActualizacion}
      />
    ) : (
      <>
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <h1 className="text-2xl font-light text-center md:text-left mb-4 md:mb-0">Gestión de Cargos</h1>
          <div className="flex space-x-2 md:space-x-4">
            <button
              onClick={handleAddCargo}
              className="bg-green-700 hover:bg-green-600 text-white font-bold py-2 px-4 border-b-4 border-green-900 hover:border-green-300 rounded w-full md:w-auto text-center"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Agregar Cargo
            </button>
          </div>
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Buscar cargo"
            value={searchTerm}
            onChange={handleSearch}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <TablaGestionCargos
          key={forceUpdate.current}
          cargos={currentItems}
          onEditCargos={handleEditCargos}
        />
        <div className="flex flex-col md:flex-row justify-between items-center mt-4 space-y-2 md:space-y-0">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 border-b-4 border-gray-600 hover:border-gray-500 rounded w-full md:w-auto"
          >
            Anterior
          </button>
          <span className="text-center md:text-left">{`Página ${currentPage} de ${totalPages}`}</span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 border-b-4 border-gray-600 hover:border-gray-500 rounded w-full md:w-auto"
          >
            Siguiente
          </button>
        </div>
      </>
    )}
  </div>
  

  );
};

export default GestionCargos;
