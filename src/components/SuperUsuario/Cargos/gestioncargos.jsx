import React, { useState, useEffect, useRef } from "react";
import API_URL from "../../../Config";
import AgregarCargo from "./agregarcargos";
import TablaGestionCargos from "./Tablas/tablagestioncargos";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const GestionCargos = ({ id_usuario, id_unidad, onClose }) => {
  const [cargos, setCargos] = useState([]);
  const [filteredCargos, setFilteredCargos] = useState([]);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isAdding, setIsAdding] = useState(false);
  const forceUpdate = useRef(0);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      fetchCargos(storedUser.usuario.id_usuario, id_unidad);
    }
  }, [id_unidad]);

  useEffect(() => {
    forceUpdate.current = forceUpdate.current + 1;
  }, [cargos]);

  const fetchCargos = async (id_usuario, id_unidad) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/Cargos/cargos-unidad/${id_usuario}/${id_unidad}/`,
        {
          headers: {
            Authorization: `${token}`,
          },
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
    <div className="p-4">
      {isAdding ? (
        <AgregarCargo onClose={handleCloseAddForm} user={user.usuario} id_unidad={id_unidad} />
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              Volver
            </button>
            <h1 className="text-2xl font-light">Gestión de Cargos</h1>
            <div className="flex space-x-4">
              <button
                onClick={handleAddCargo}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
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
          <TablaGestionCargos key={forceUpdate.current} cargos={currentItems} />
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
        </>
      )}
    </div>
  );
};

export default GestionCargos;
