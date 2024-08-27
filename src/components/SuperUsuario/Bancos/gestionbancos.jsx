import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import TablaBancos from "./Tablas/tablabancos";
import AgregarBanco from "./agregarbancos";
import EditarBanco from "./editarbancos"; // Asegúrate de importar el componente de edición
import API_URL from "../../../Config";

const GestionBancos = () => {
  const [bancos, setBancos] = useState([]);
  const [filteredBancos, setFilteredBancos] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Estado para la edición
  const [currentBanco, setCurrentBanco] = useState(null); // Banco que se está editando
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchBancos();
  }, []);

  const fetchBancos = async () => {
    try {
      const response = await fetch(`${API_URL}/Informes/listar-bancos/`);
      if (response.ok) {
        const data = await response.json();
        setBancos(data.bancos);
        setFilteredBancos(data.bancos);
        setError(null);
      } else {
        const errorMessage = await response.text();
        throw new Error(`Error al obtener bancos: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error al obtener bancos:", error.message);
      setError(error.message);
    }
  };

  const handleSearch = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchTerm(event.target.value);

    const filtered = bancos.filter((banco) =>
      banco.nombre_banco.toLowerCase().includes(searchValue)
    );

    setFilteredBancos(filtered);
    setCurrentPage(1);
  };

  const handleClear = () => {
    setSearchTerm("");
    setFilteredBancos(bancos);
    setCurrentPage(1);
  };

  const handleBancoAdded = () => {
    fetchBancos();
    setIsAdding(false); // Asegúrate de cerrar el formulario al agregar el banco
  };

  const handleBancoEdited = () => {
    fetchBancos();
    setIsEditing(false); // Asegúrate de cerrar el formulario de edición
  };

  const handleEditBanco = (banco) => {
    setCurrentBanco(banco);
    setIsEditing(true);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBancos.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBancos.length / itemsPerPage);

  return (
    <div className="p-4">
      {!isAdding && !isEditing && (
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-light">Gestionar Bancos</h1>
          <button
            onClick={() => setIsAdding(true)}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Agregar Banco
          </button>
        </div>
      )}
      {isAdding ? (
        <AgregarBanco
          onClose={() => setIsAdding(false)}
          onBancoAdded={handleBancoAdded}
        />
      ) : isEditing && currentBanco ? (
        <EditarBanco
          banco={currentBanco}
          onClose={() => setIsEditing(false)}
          onBancoUpdated={handleBancoEdited}
        />
      ) : (
        <>
          <div className="mb-4 flex">
            <input
              type="text"
              placeholder="Buscar banco"
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
          <TablaBancos bancos={currentItems} onEditBanco={handleEditBanco} />
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Anterior
            </button>
            <span>{`Página ${currentPage} de ${totalPages}`}</span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
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

export default GestionBancos;
