import React, { useState, useEffect } from "react";
import API_URL from "../../../Config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import TablaUnidades from "./Tablas/tablaunidades";
import GestionCargos from "../Cargos/gestioncargos";
import AgregarUnidad from "./agregarunidad";
import EditarUnidad from "./editarunidad";

const GestionUnidadesPorEstacion = () => {
  const [unidades, setUnidades] = useState([]);
  const [filteredUnidades, setFilteredUnidades] = useState([]);
  const [isAdding, setIsAdding] = useState(false); // Estado para manejar el componente AgregarUnidad
  const [selectedUnidad, setSelectedUnidad] = useState(null);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [userId, setUserId] = useState(null);
  const [unidadToEdit, setUnidadToEdit] = useState(null);
  const [isEditing, setIsEditing] = useState(false);


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const id_usuario = JSON.parse(atob(token.split(".")[1])).id_usuario;
      setUserId(id_usuario);
      fetchUnidades(id_usuario);
    }
  }, []);

  const fetchUnidades = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token no encontrado");
      }

      const formData = new FormData();

      const response = await fetch(`${API_URL}/Unidades/unidadesall/`, {
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
      unidad.nombre_unidad && unidad.nombre_unidad.toLowerCase().includes(searchValue)
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
    setIsAdding(true); // Activar el modo "Agregar Unidad"
  };

  const handleUnidadAdded = () => {
    setIsAdding(false); // Desactivar el modo "Agregar Unidad" después de agregar una unidad
    fetchUnidades(); // Refrescar la lista de unidades
  };
  const handleEditUnidad = (unidad) => {
    setUnidadToEdit(unidad);
    setIsEditing(true);
  };
  const handleCancelAddUnidad = () => {
    setIsAdding(false); // Desactivar el modo "Agregar Unidad" si se cancela
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
        id_usuario={userId}
        id_unidad={selectedUnidad.id_unidad}
        onClose={() => setSelectedUnidad(null)}
      />
    );
  }

  // Mostrar el componente AgregarUnidad si isAdding es true
  if (isAdding) {
    return <AgregarUnidad onUnidadAdded={handleUnidadAdded} onCancel={handleCancelAddUnidad} />;
  }
  
  const handleCancelEdit = () => {
    setIsEditing(false);
    setUnidadToEdit(null);
  };

  const handleActualizacion = () => {
    fetchUnidades(userId);
    setIsEditing(false);
  };
  return (
    <div className="p-4 mt-16">
  {isEditing ? (
    <EditarUnidad
      unidad={unidadToEdit}
      onCancel={handleCancelEdit}
      onActualizacion={handleActualizacion}
    />
  ) : (
    <>
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <h1 className="text-2xl font-light text-center md:text-left">Gestionar Unidades</h1>
        <button
          onClick={handleAddUnidad}
          className="mt-2 md:mt-0 bg-green-700 hover:bg-green-600 text-white font-bold py-2 px-4 border-b-4 border-green-900 hover:border-green-300 rounded"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Agregar Unidad
        </button>
      </div>
      <div className="mb-4 flex flex-col md:flex-row">
        <input
          type="text"
          placeholder="Buscar unidad"
          value={searchTerm}
          onChange={handleSearch}
          className="w-full p-2 border border-gray-300 rounded mb-2 md:mb-0 md:mr-2"
        />
        <button
          onClick={handleClear}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 border-b-4 border-blue-300 hover:border-blue-700 rounded"
        >
          Limpiar
        </button>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <TablaUnidades unidades={currentItems} onEditUnidad={handleEditUnidad} />
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 border-b-4 border-gray-600 hover:border-gray-500 rounded"
        >
          Anterior
        </button>
        <span className="text-center">{`Página ${currentPage} de ${totalPages}`}</span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
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

export default GestionUnidadesPorEstacion;
