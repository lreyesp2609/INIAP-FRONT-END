import React, { useState, useEffect } from "react";

const FormularioVehiculo = ({ formData, handleInputChange, categorias, subcategorias, handleCategoriaChange }) => {
  const [errors, setErrors] = useState({});
  const años = Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i); // Años desde el presente hasta 50 años atrás

  useEffect(() => {
    // Resetear los errores de subcategoría cuando cambia la categoría
    if (!formData.id_categoria_bien) {
      setErrors((prevErrors) => ({ ...prevErrors, id_subcategoria_bien: "" }));
    }
  }, [formData.id_categoria_bien]);

  // Función para validar Placa
  const handlePlacaChange = (event) => {
    const { value } = event.target;
    if (value === "" || /^[A-Za-z0-9]+$/.test(value)) {
      handleInputChange(event); // Llamar a la función para manejar el cambio de datos
      setErrors((prevErrors) => ({ ...prevErrors, placa: "" })); // Limpiar el error si es válido
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        placa: "La placa debe contener solo letras y números",
      }));
    }
  };

  // Función para validar Modelo
  const handleModeloChange = (event) => {
    const { value } = event.target;
    if (value === "" || /^[A-Za-z0-9]+$/.test(value)) {
      handleInputChange(event); // Llamar a la función para manejar el cambio de datos
      setErrors((prevErrors) => ({ ...prevErrors, modelo: "" })); // Limpiar el error si es válido
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        modelo: "El modelo debe contener solo letras y números",
      }));
    }
  };

  // Función para validar Marca
  const handleMarcaChange = (event) => {
    const { value } = event.target;
    if (value === "" || /^[A-Za-z\s]+$/.test(value)) {
      handleInputChange(event); // Llamar a la función para manejar el cambio de datos
      setErrors((prevErrors) => ({ ...prevErrors, marca: "" })); // Limpiar el error si es válido
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        marca: "La marca debe contener solo letras",
      }));
    }
  };

  // Función para validar Color Primario
  const handleColorPrimarioChange = (event) => {
    const { value } = event.target;
    if (value === "" || /^[A-Za-z\s]+$/.test(value)) {
      handleInputChange(event); // Llamar a la función para manejar el cambio de datos
      setErrors((prevErrors) => ({ ...prevErrors, color_primario: "" })); // Limpiar el error si es válido
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        color_primario: "El color primario debe contener solo letras",
      }));
    }
  };

  // Función para validar Color Secundario
  const handleColorSecundarioChange = (event) => {
    const { value } = event.target;
    if (value === "" || /^[A-Za-z\s]*$/.test(value)) {
      handleInputChange(event); // Llamar a la función para manejar el cambio de datos
      setErrors((prevErrors) => ({ ...prevErrors, color_secundario: "" })); // Limpiar el error si es válido
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        color_secundario: "El color secundario debe contener solo letras",
      }));
    }
  };

  // Función para validar Año de Fabricación
  const handleAnioFabricacionChange = (event) => {
    const { value } = event.target;
    if (value === "" || años.includes(parseInt(value))) {
      handleInputChange(event); // Llamar a la función para manejar el cambio de datos
      setErrors((prevErrors) => ({ ...prevErrors, anio_fabricacion: "" })); // Limpiar el error si es válido
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        anio_fabricacion: "El año de fabricación debe ser un año válido",
      }));
    }
  };

  // Función para validar Número de Motor
  const handleNumeroMotorChange = (event) => {
    const { value } = event.target;
    if (value === "" || /^[A-Za-z0-9]+$/.test(value)) {
      handleInputChange(event); // Llamar a la función para manejar el cambio de datos
      setErrors((prevErrors) => ({ ...prevErrors, numero_motor: "" })); // Limpiar el error si es válido
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        numero_motor: "El número de motor debe contener solo letras y números",
      }));
    }
  };

  // Función para validar Número de Chasis
  const handleNumeroChasisChange = (event) => {
    const { value } = event.target;
    if (value === "" || /^[A-Za-z0-9]+$/.test(value)) {
      handleInputChange(event); // Llamar a la función para manejar el cambio de datos
      setErrors((prevErrors) => ({ ...prevErrors, numero_chasis: "" })); // Limpiar el error si es válido
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        numero_chasis: "El número de chasis debe contener solo letras y números",
      }));
    }
  };

  // Función para validar Número de Matrícula
  const handleNumeroMatriculaChange = (event) => {
    const { value } = event.target;
    if (value === "" || /^\d+$/.test(value)) {
      handleInputChange(event); // Llamar a la función para manejar el cambio de datos
      setErrors((prevErrors) => ({ ...prevErrors, numero_matricula: "" })); // Limpiar el error si es válido
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        numero_matricula: "El número de matrícula debe contener solo números",
      }));
    }
  };

  return (
    <form id="vehicleForm" className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold mb-4">Datos del Vehículo</h3>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Categoría de Bienes
            </label>
            <select
              name="id_categoria_bien"
              value={formData.id_categoria_bien}
              onChange={handleCategoriaChange}
              className={`mt-1 p-2 border border-gray-300 rounded w-full ${
                errors.id_categoria_bien ? "border-red-500" : ""
              }`}
            >
              <option value="">Selecciona una Categoría</option>
              {categorias.map(categoria => (
                <option
                  key={categoria.id_categorias_bien}
                  value={categoria.id_categorias_bien}
                >
                  {categoria.descripcion_categoria}
                </option>
              ))}
            </select>
            {errors.id_categoria_bien && (
              <p className="text-red-500 text-sm">{errors.id_categoria_bien}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Subcategoría de Bienes
            </label>
            <select
              name="id_subcategoria_bien"
              value={formData.id_subcategoria_bien}
              onChange={handleInputChange}
              className={`mt-1 p-2 border border-gray-300 rounded w-full ${
                errors.id_subcategoria_bien ? "border-red-500" : ""
              }`}
              disabled={!formData.id_categoria_bien}
            >
              <option value="">Selecciona una Subcategoría</option>
              {subcategorias.map(subcategoria => (
                <option
                  key={subcategoria.id_subcategoria_bien}
                  value={subcategoria.id_subcategoria_bien}
                >
                  {subcategoria.descripcion}
                </option>
              ))}
            </select>
            {errors.id_subcategoria_bien && (
              <p className="text-red-500 text-sm">{errors.id_subcategoria_bien}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Placa
            </label>
            <input
              type="text"
              name="placa"
              value={formData.placa}
              onChange={handlePlacaChange}
              className={`mt-1 p-2 border border-gray-300 rounded w-full ${
                errors.placa ? "border-red-500" : ""
              }`}
            />
            {errors.placa && (
              <p className="text-red-500 text-sm">{errors.placa}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Modelo
            </label>
            <input
              type="text"
              name="modelo"
              value={formData.modelo}
              onChange={handleModeloChange}
              className={`mt-1 p-2 border border-gray-300 rounded w-full ${
                errors.modelo ? "border-red-500" : ""
              }`}
            />
            {errors.modelo && (
              <p className="text-red-500 text-sm">{errors.modelo}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Marca
            </label>
            <input
              type="text"
              name="marca"
              value={formData.marca}
              onChange={handleMarcaChange}
              className={`mt-1 p-2 border border-gray-300 rounded w-full ${
                errors.marca ? "border-red-500" : ""
              }`}
            />
            {errors.marca && (
              <p className="text-red-500 text-sm">{errors.marca}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Color Primario
            </label>
            <input
              type="text"
              name="color_primario"
              value={formData.color_primario}
              onChange={handleColorPrimarioChange}
              className={`mt-1 p-2 border border-gray-300 rounded w-full ${
                errors.color_primario ? "border-red-500" : ""
              }`}
            />
            {errors.color_primario && (
              <p className="text-red-500 text-sm">{errors.color_primario}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Color Secundario
            </label>
            <input
              type="text"
              name="color_secundario"
              value={formData.color_secundario}
              onChange={handleColorSecundarioChange}
              className={`mt-1 p-2 border border-gray-300 rounded w-full ${
                errors.color_secundario ? "border-red-500" : ""
              }`}
            />
            {errors.color_secundario && (
              <p className="text-red-500 text-sm">{errors.color_secundario}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Año de Fabricación
            </label>
            <select
              name="anio_fabricacion"
              value={formData.anio_fabricacion}
              onChange={handleAnioFabricacionChange}
              className={`mt-1 p-2 border border-gray-300 rounded w-full ${
                errors.anio_fabricacion ? "border-red-500" : ""
              }`}
            >
              <option value="">Selecciona un Año</option>
              {años.map(anio => (
                <option key={anio} value={anio}>
                  {anio}
                </option>
              ))}
            </select>
            {errors.anio_fabricacion && (
              <p className="text-red-500 text-sm">{errors.anio_fabricacion}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Número de Motor
            </label>
            <input
              type="text"
              name="numero_motor"
              value={formData.numero_motor}
              onChange={handleNumeroMotorChange}
              className={`mt-1 p-2 border border-gray-300 rounded w-full ${
                errors.numero_motor ? "border-red-500" : ""
              }`}
            />
            {errors.numero_motor && (
              <p className="text-red-500 text-sm">{errors.numero_motor}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Número de Chasis
            </label>
            <input
              type="text"
              name="numero_chasis"
              value={formData.numero_chasis}
              onChange={handleNumeroChasisChange}
              className={`mt-1 p-2 border border-gray-300 rounded w-full ${
                errors.numero_chasis ? "border-red-500" : ""
              }`}
            />
            {errors.numero_chasis && (
              <p className="text-red-500 text-sm">{errors.numero_chasis}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Número de Matrícula
            </label>
            <input
              type="text"
              name="numero_matricula"
              value={formData.numero_matricula}
              onChange={handleNumeroMatriculaChange}
              className={`mt-1 p-2 border border-gray-300 rounded w-full ${
                errors.numero_matricula ? "border-red-500" : ""
              }`}
            />
            {errors.numero_matricula && (
              <p className="text-red-500 text-sm">{errors.numero_matricula}</p>
            )}
          </div>
        </div>
      </div>
    </form>
  );
};

export default FormularioVehiculo;
