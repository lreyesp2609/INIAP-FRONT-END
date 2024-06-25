import React, { useState, useEffect } from "react";
import API_URL from "../../Config";
import AgregarCategoriasBienes from "./agregarcategoriasbienes";
import TablaGestionCategorias from "./tablacategoriasbienes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const GestionCategorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [filteredCategorias, setFilteredCategorias] = useState([]);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      fetchCategorias(storedUser.usuario.id_usuario);
    }
  }, []);

  const fetchCategorias = async (id_usuario) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/CategoriasBienes/categorias-bienes/${id_usuario}/`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setCategorias(data);
        setFilteredCategorias(data);
      } else {
        console.error("Error al obtener categorías:", response.statusText);
      }
    } catch (error) {
      console.error("Error al obtener categorías:", error);
    }
  };

  const handleSearch = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchTerm(event.target.value);

    const filtered = categorias.filter((categoria) => {
      const descripcion_categoria = categoria.descripcion_categoria.toLowerCase();
      return descripcion_categoria.includes(searchValue);
    });

    setFilteredCategorias(filtered);
    setCurrentPage(1);
  };

  const handleClear = () => {
    setSearchTerm("");
    setFilteredCategorias(categorias);
    setCurrentPage(1);
  };

  const handleAddCategoria = async () => {
    setIsAdding(true);
  };
  
  const handleCloseAddForm = () => {
    setIsAdding(false);
    fetchCategorias(user.usuario.id_usuario);
  };
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCategorias.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCategorias.length / itemsPerPage);

  const handleClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="flex-grow flex flex-col items-center p-4">
      <h1 className="text-2xl font-light mb-4">Gestión de Categorías de Bienes</h1>
      {isAdding ? (
        <AgregarCategoriasBienes onClose={handleCloseAddForm} user={user.usuario} />
      ) : (
        <>
          <div className="w-full flex flex-wrap md:flex-nowrap mb-4 items-center">
            <div className="flex w-full md:w-3/4">
              <input
                type="text"
                placeholder="Descripción de la categoría"
                value={searchTerm}
                onChange={handleSearch}
                className="p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
              <button
                className="p-2 text-white focus:outline-none bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
                onClick={handleClear}
                style={{
                  minWidth: "80px",
                  borderRadius: "0 0.375rem 0.375rem 0",
                }}
              >
                Limpiar
              </button>
            </div>
            <button
              className="mt-2 md:mt-0 md:ml-2 p-2 focus:outline-none w-full bg-green-700 hover:bg-green-600 
                text-white font-bold py-2 px-4 border-b-4 border-green-900
                hover:border-green-700 rounded"
              onClick={handleAddCategoria}
              style={{ minWidth: "200px" }}
            >
              <FontAwesomeIcon icon={faPlus} /> Agregar Categoría de Bienes
            </button>
          </div>
          <TablaGestionCategorias categorias={currentItems} />
          <div className="flex justify-center mt-4">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => handleClick(index + 1)}
                className={`mx-1 px-3 py-1 border rounded ${
                  currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-white text-blue-500"
                }`}
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

export default GestionCategorias;
