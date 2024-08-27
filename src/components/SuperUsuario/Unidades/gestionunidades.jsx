import React, { useState, useEffect } from "react";
import API_URL from "../../../Config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import TablaUnidades from "./Tablas/tablaunidades";
import GestionCargos from "../Cargos/gestioncargos";
import AgregarUnidad from "./agregarunidad";

const GestionUnidadesPorEstacion = () => {
  const [unidades, setUnidades] = useState([]);
  const [filteredUnidades, setFilteredUnidades] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedUnidad, setSelectedUnidad] = useState(null);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const id_usuario = JSON.parse(atob(token.split(".")[1])).id_usuario;
      setUserId(id_usuario);
      fetchUnidades(id_usuario);
    }
  }, []);



  useEffect(() => {
    fetchUnidades();
  });

  const fetchUnidades = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token no encontrado");
      }

      const formData = new FormData();

      const response = await fetch(`${API_URL}/Unidades/unidades/`, {
        method: "POST",
        headers: {
          Authorization: `${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setUnidades(data);
        setFilteredUnidades(data);
        setError(null);
      } else {
        const errorMessage = await response.text();
        throw new Error(`Error al obtener unidades: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error al obtener unidades:", error.message);
      setError(error.message);
    }
  };

  const handleSearch = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchTerm(event.target.value);

    const filtered = unidades.filter((unidad) =>
      unidad.nombre.toLowerCase().includes(searchValue)
    );

    setFilteredUnidades(filtered);
    setCurrentPage(1);
  };

  const handleClear = () => {
    setSearchTerm("");
    setFilteredUnidades(unidades);
    setCurrentPage(1);
  };

  const handleAddUnidad = () => {
    fetchUnidades(userId);
    setIsAdding(true);
  };

  const handleUnidadAdded = () => {
    setIsAdding(false);
    fetchUnidades();
  };

  const handleAddCargos = (unidad) => {
    setSelectedUnidad(unidad);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUnidades.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUnidades.length / itemsPerPage);

  const handleClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

 

  if (selectedUnidad) {
    return (
      <GestionCargos
        id_usuario={id_usuario}
        id_unidad={selectedUnidad.id_unidad}
        onClose={() => setSelectedUnidad(null)}
      />
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
       
        <h1 className="text-2xl font-light">Gestionar Unidades</h1>
        <button
          onClick={handleAddUnidad}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Agregar Unidad
        </button>
      </div>
      <div className="mb-4 flex">
        <input
          type="text"
          placeholder="Buscar unidad"
          value={searchTerm}
          onChange={handleSearch}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <button
          onClick={handleClear}
          className="ml-2 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        >
          Limpiar
        </button>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <TablaUnidades unidades={currentItems} onAddCargos={handleAddCargos} />
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
    </div>
  );
};

export default GestionUnidadesPorEstacion;
