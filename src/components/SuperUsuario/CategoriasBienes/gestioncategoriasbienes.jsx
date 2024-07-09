import React, { useState, useEffect, useRef } from "react";
import API_URL from "../../../Config";
import AgregarCategoriasBienes from "./agregarcategoriasbienes";
import TablaGestionCategorias from "./Tablas/tablacategoriasbienes";
import AgregarSubCategoriasBienes from "./agregarsubcategorias";
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
  const [categoryIdToAdd, setCategoryIdToAdd] = useState(null);
  const [showSubcategorias, setShowSubcategorias] = useState(false);
  const forceUpdate = useRef(0);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      fetchCategorias(storedUser.usuario.id_usuario);
    }
  }, []);

  useEffect(() => {
    forceUpdate.current = forceUpdate.current + 1;
  }, [categorias]);

  const fetchCategorias = async (id_usuario) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/CategoriasBienes/categorias-bienes/${id_usuario}/`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
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
      const descripcion_categoria =
        categoria.descripcion_categoria.toLowerCase();
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

  const handleAddCategoria = (categoriaId) => {
    setCategoryIdToAdd(categoriaId);
    setIsAdding(true);
  };

  const handleOpenSubcategorias = (categoriaId) => {
    setCategoryIdToAdd(categoriaId);
    setShowSubcategorias(true);
  };

  const handleCloseSubcategorias = () => {
    setShowSubcategorias(false);
    fetchCategorias(user.usuario.id_usuario); // Actualiza la lista de categorías y subcategorías
  };

  const handleCloseAddForm = () => {
    setIsAdding(false);
    setCategoryIdToAdd(null);
    fetchCategorias(user.usuario.id_usuario);
  };

  const updateSubcategorias = (newSubcategoria) => {
    setCategorias((prevCategorias) =>
      prevCategorias.map((categoria) =>
        categoria.id_categorias_bien === newSubcategoria.id_categorias_bien
          ? {
              ...categoria,
              subcategorias: [...categoria.subcategorias, newSubcategoria],
            }
          : categoria
      )
    );
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCategorias.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredCategorias.length / itemsPerPage);

  const handleClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (!user) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="p-4">
      {isAdding ? (
        <AgregarCategoriasBienes
          onClose={handleCloseAddForm}
          user={user.usuario}
          categoryId={categoryIdToAdd}
        />
      ) : showSubcategorias ? (
        <AgregarSubCategoriasBienes
          onClose={handleCloseSubcategorias}
          user={user.usuario}
          categoryId={categoryIdToAdd}
          updateSubcategorias={updateSubcategorias}
        />
      ) : (
        <>
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-4 md:space-y-0 md:space-x-4">
            <h1 className="text-2xl font-light">Gestión de Categorías de Bienes</h1>
            <div className="flex space-x-4">
              <button
                onClick={() => setIsAdding(true)}
                className="
                bg-green-700 hover:bg-green-600 text-white font-bold py-2 px-4 border-b-4 border-green-900 hover:border-green-300 rounded"
              >
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Agregar Categoría de Bienes
              </button>
            </div>
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Descripción de la categoría"
              value={searchTerm}
              onChange={handleSearch}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <TablaGestionCategorias
            key={forceUpdate.current}
            categorias={currentItems}
            handleAddCategoria={handleAddCategoria}
            handleOpenSubcategorias={handleOpenSubcategorias}
            subcategorias={categorias.flatMap(c => c.subcategorias)}
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

export default GestionCategorias;
