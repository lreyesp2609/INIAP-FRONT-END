import React, { useState, useEffect } from "react";
import API_URL from "../../../Config";
import TablaEncabezados from "./Tablas/tablaencabezados";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal";
import AgregarEncabezado from "./agregarencabezados";

const GestionEncabezados = () => {
  const [encabezados, setEncabezados] = useState([]);
  const [filteredEncabezados, setFilteredEncabezados] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isAdding, setIsAdding] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState(null);

  useEffect(() => {
    if (token) {
      fetchEncabezados();
    }
  }, [token]);

  const fetchEncabezados = async () => {
    if (!token) return;

    try {
      const response = await fetch(
        `${API_URL}/Encabezados/obtener_encabezado/`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        if (data && typeof data === "object") {
          const encabezadosArray = [data];
          setEncabezados(encabezadosArray);
          setFilteredEncabezados(encabezadosArray);
        } else {
          setErrorMessage("Datos recibidos no son válidos.");
          console.error("Datos recibidos no son un objeto válido:", data);
        }
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || "Error al obtener encabezados");
        console.error("Error al obtener encabezados:", response.statusText);
      }
    } catch (error) {
      setErrorMessage("Error de red al obtener encabezados");
      console.error("Error al obtener encabezados:", error);
    }
  };

  const handleAddEncabezado = () => {
    setIsAdding(true);
  };

  const handleCloseForm = () => {
    setIsAdding(false);
  };

  const handleEncabezadoAdded = async () => {
    await fetchEncabezados();
    setIsAdding(false);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    const filtered = encabezados.filter((encabezado) =>
      encabezado.id_encabezado.toString().includes(event.target.value)
    );
    setFilteredEncabezados(filtered);
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = Array.isArray(filteredEncabezados)
    ? filteredEncabezados.slice(indexOfFirstItem, indexOfLastItem)
    : [];
  const totalPages = Array.isArray(filteredEncabezados)
    ? Math.ceil(filteredEncabezados.length / itemsPerPage)
    : 0;

  const openModal = (image) => {
    setModalImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalImage(null);
  };

  return (
    <div className="p-4">
      {isAdding ? (
        <div className="bg-white p-4 border rounded shadow-lg">
          <AgregarEncabezado
            onClose={handleCloseForm}
            onEncabezadoAdded={handleEncabezadoAdded}
          />
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-4 md:space-y-0 md:space-x-4">
            <div>
              <h1 className="text-2xl font-light">Gestión de Encabezados</h1>
            </div>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <button
                onClick={handleAddEncabezado}
                className="bg-green-700 hover:bg-green-600 text-white font-bold py-2 px-4 border-b-4 border-green-900 hover:border-green-300 rounded"
              >
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Agregar Encabezado
              </button>
            </div>
          </div>
          <div className="mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Buscar por ID de encabezado"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          {errorMessage && (
            <div className="text-red-500 mb-4">{errorMessage}</div>
          )}
          <TablaEncabezados
            encabezados={currentItems}
            onImageClick={openModal} // Pasamos la función para abrir el modal
          />
          <div className="mt-4 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 border-b-4 border-gray-600 hover:border-gray-500 rounded"
              disabled={currentPage === 1}
            >
              Anterior
            </button>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 border-b-4 border-gray-600 hover:border-gray-500 rounded"
              disabled={currentPage === totalPages}
            >
              Siguiente
            </button>
          </div>
          <Modal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            ariaHideApp={false}
            contentLabel="Imagen ampliada"
            className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50"
          >
            <div className="bg-white p-4 rounded shadow-lg max-w-xs mx-auto">
              <img
                src={modalImage}
                alt="Encabezado ampliado"
                className="w-full h-auto object-contain"
              />
              <button
                onClick={closeModal}
                className="mt-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                Cerrar
              </button>
            </div>
          </Modal>
        </>
      )}
    </div>
  );
};

export default GestionEncabezados;
