import React, { useState } from "react";

const FormularioEmpleado = ({
  formData,
  handleInputChange,
  cargos = [],
  roles = [],
  unidades = [],
  licencias = [],
}) => {
  const [errors, setErrors] = useState({});
  const fechaActual = new Date().toISOString().split("T")[0];

  // Función para manejar el cambio en el campo de número de cédula
  const handleCedulaChange = (event) => {
    const { value } = event.target;
    if (/^\d*$/.test(value)) {
      handleInputChange(event); // Llamar a la función para manejar el cambio de datos
      setErrors((prevErrors) => ({ ...prevErrors, numero_cedula: "" })); // Limpiar el error si es válido
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        numero_cedula: "El número de cédula debe contener solo números",
      }));
    }
  };

  // Función para manejar el cambio en el campo de nombres
  const handleNombresChange = (event) => {
    const { value } = event.target;
    if (/^[a-zA-Z\s]*$/.test(value)) {
      handleInputChange(event); // Llamar a la función para manejar el cambio de datos
      setErrors((prevErrors) => ({ ...prevErrors, nombres: "" })); // Limpiar el error si es válido
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        nombres: "El nombre debe contener solo letras",
      }));
    }
  };

  // Función para manejar el cambio en el campo de apellidos
  const handleApellidosChange = (event) => {
    const { value } = event.target;
    if (/^[a-zA-Z\s]*$/.test(value)) {
      handleInputChange(event); // Llamar a la función para manejar el cambio de datos
      setErrors((prevErrors) => ({ ...prevErrors, apellidos: "" })); // Limpiar el error si es válido
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        apellidos: "Los apellidos deben contener solo letras",
      }));
    }
  };

  // Función para manejar el cambio en el campo de distintivo
  const handleDistintivoChange = (event) => {
    const { value } = event.target;
    if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s.]*$/.test(value)) {
      handleInputChange(event); // Llamar a la función para manejar el cambio de datos
      setErrors((prevErrors) => ({ ...prevErrors, distintivo: "" })); // Limpiar el error si es válido
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        distintivo:
          "El distintivo debe contener solo letras, tildes y espacios",
      }));
    }
  };

  // Función para manejar el cambio en el campo de fecha de nacimiento
  const handleFechaNacimientoChange = (event) => {
    const { value } = event.target;
    const fechaNacimiento = new Date(value);
    const edad = new Date().getFullYear() - fechaNacimiento.getFullYear();
    if (edad >= 18) {
      handleInputChange(event); // Llamar a la función para manejar el cambio de datos
      setErrors((prevErrors) => ({ ...prevErrors, fecha_nacimiento: "" })); // Limpiar el error si es válido
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        fecha_nacimiento: "El empleado debe ser mayor de 18 años",
      }));
    }
  };

  // Función para manejar el cambio en el campo de género
  const handleGeneroChange = (event) => {
    const { value } = event.target;
    if (["Masculino", "Femenino"].includes(value)) {
      handleInputChange(event); // Llamar a la función para manejar el cambio de datos
      setErrors((prevErrors) => ({ ...prevErrors, genero: "" })); // Limpiar el error si es válido
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        genero: "El género debe ser Masculino o Femenino",
      }));
    }
  };

  // Función para manejar el cambio en el campo de celular
  const handleCelularChange = (event) => {
    const { value } = event.target;
    // Acepta números, espacios y signos de + y - (para formatos internacionales)
    if (/^[\d\s\+]*$/.test(value)) {
      handleInputChange(event); // Llamar a la función para manejar el cambio de datos
      setErrors((prevErrors) => ({ ...prevErrors, celular: "" })); // Limpiar el error si es válido
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        celular:
          "El número de celular debe contener solo números, espacios y + ",
      }));
    }
  };
  // Función para manejar el cambio en el campo de dirección
  const handleDireccionChange = (event) => {
    const { value } = event.target;
    if (/^[a-zA-Z0-9\s,.\-áéíóúÁÉÍÓÚñÑ]*$/.test(value)) {
      handleInputChange(event); // Llamar a la función para manejar el cambio de datos
      setErrors((prevErrors) => ({ ...prevErrors, direccion: "" })); // Limpiar el error si es válido
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        direccion: "La dirección debe contener solo letras y números",
      }));
    }
  };

  // Función para manejar el cambio en el campo de unidad
  const handleUnidadChange = (event) => {
    const { value } = event.target;
    if (value) {
      handleInputChange(event); // Llamar a la función para manejar el cambio de datos
      setErrors((prevErrors) => ({ ...prevErrors, id_unidad: "" })); // Limpiar el error si es válido
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        id_unidad: "Unidad es obligatoria",
      }));
    }
  };

  // Función para manejar el cambio en el campo de cargo
  const handleCargoChange = (event) => {
    const { value } = event.target;
    if (value) {
      handleInputChange(event); // Llamar a la función para manejar el cambio de datos
      setErrors((prevErrors) => ({ ...prevErrors, id_cargo: "" })); // Limpiar el error si es válido
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        id_cargo: "Cargo es obligatorio",
      }));
    }
  };

  // Función para manejar el cambio en el campo de rol
  const handleRolChange = (event) => {
    const { value } = event.target;
    if (value) {
      handleInputChange(event); // Llamar a la función para manejar el cambio de datos
      setErrors((prevErrors) => ({ ...prevErrors, id_rol: "" })); // Limpiar el error si es válido
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        id_rol: "Rol es obligatorio",
      }));
    }
  };

  return (
    <form id="employeeForm" className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold mb-4">Datos del Usuario</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Número de Cédula
            </label>
            <input
              type="text"
              name="numero_cedula"
              value={formData.numero_cedula}
              onChange={handleCedulaChange}
              className={`w-full bg-blue-100 text-black border border-blue-100 rounded py-2 px-4 ${
                errors.numero_cedula ? "border-red-500" : ""
              }`}
            />
            {errors.numero_cedula && (
              <p className="text-red-500 text-sm">{errors.numero_cedula}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombres
            </label>
            <input
              type="text"
              name="nombres"
              value={formData.nombres}
              onChange={handleNombresChange}
              className={`w-full bg-blue-100 text-black border border-blue-100 rounded py-2 px-4 ${
                errors.nombres ? "border-red-500" : ""
              }`}
            />
            {errors.nombres && (
              <p className="text-red-500 text-sm">{errors.nombres}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Apellidos
            </label>
            <input
              type="text"
              name="apellidos"
              value={formData.apellidos}
              onChange={handleApellidosChange}
              className={`w-full bg-blue-100 text-black border border-blue-100 rounded py-2 px-4 ${
                errors.apellidos ? "border-red-500" : ""
              }`}
            />
            {errors.apellidos && (
              <p className="text-red-500 text-sm">{errors.apellidos}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Distintivo
            </label>
            <input
              type="text"
              name="distintivo"
              value={formData.distintivo}
              onChange={handleDistintivoChange}
              className={`w-full bg-blue-100 text-black border border-blue-100 rounded py-2 px-4 ${
                errors.distintivo ? "border-red-500" : ""
              }`}
            />
            {errors.distintivo && (
              <p className="text-red-500 text-sm">{errors.distintivo}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fecha de Nacimiento
            </label>
            <input
              type="date"
              name="fecha_nacimiento"
              value={formData.fecha_nacimiento}
              onChange={handleFechaNacimientoChange}
              className={`w-full bg-blue-100 text-black border border-blue-100 rounded py-2 px-4 ${
                errors.fecha_nacimiento ? "border-red-500" : ""
              }`}
            />
            {errors.fecha_nacimiento && (
              <p className="text-red-500 text-sm">{errors.fecha_nacimiento}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Género
            </label>
            <select
              name="genero"
              value={formData.genero}
              onChange={handleGeneroChange}
              className={`w-full bg-blue-100 text-black border border-blue-100 rounded py-2 px-4 ${
                errors.genero ? "border-red-500" : ""
              }`}
            >
              <option value="">Seleccionar Género</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
            </select>
            {errors.genero && (
              <p className="text-red-500 text-sm">{errors.genero}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Celular
            </label>
            <input
              type="text"
              name="celular"
              value={formData.celular}
              onChange={handleCelularChange}
              className={`w-full bg-blue-100 text-black border border-blue-100 rounded py-2 px-4 ${
                errors.celular ? "border-red-500" : ""
              }`}
            />
            {errors.celular && (
              <p className="text-red-500 text-sm">{errors.celular}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Dirección
            </label>
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleDireccionChange}
              className={`w-full bg-blue-100 text-black border border-blue-100 rounded py-2 px-4 ${
                errors.direccion ? "border-red-500" : ""
              }`}
            />
            {errors.direccion && (
              <p className="text-red-500 text-sm">{errors.direccion}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Correo Electrónico
            </label>
            <input
              type="email"
              name="correo_electronico"
              value={formData.correo_electronico}
              onChange={handleInputChange}
              className={`w-full bg-blue-100 text-black border border-blue-100 rounded py-2 px-4 ${
                errors.correo_electronico ? "border-red-500" : ""
              }`}
            />
            {errors.correo_electronico && (
              <p className="text-red-500 text-sm">
                {errors.correo_electronico}
              </p>
            )}
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-4">Datos de la Empresa</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Unidad
            </label>
            <select
              name="id_unidad"
              value={formData.id_unidad}
              onChange={handleUnidadChange}
              className={`w-full bg-blue-100 text-black border border-blue-100 rounded py-2 px-4 ${
                errors.id_unidad ? "border-red-500" : ""
              }`}
            >
              <option value="">Seleccionar Unidad</option>
              {unidades &&
                unidades.map((unidad) => (
                  <option key={unidad.id_unidad} value={unidad.id_unidad}>
                    {unidad.nombre_unidad}
                  </option>
                ))}
            </select>
            {errors.id_unidad && (
              <p className="text-red-500 text-sm">{errors.id_unidad}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cargo
            </label>
            <select
              name="id_cargo"
              value={formData.id_cargo}
              onChange={handleCargoChange}
              className={`w-full bg-blue-100 text-black border border-blue-100 rounded py-2 px-4 ${
                errors.id_cargo ? "border-red-500" : ""
              }`}
            >
              <option value="">Seleccionar Cargo</option>
              {cargos &&
                cargos.map((cargo) => (
                  <option key={cargo.id_cargo} value={cargo.id_cargo}>
                    {cargo.cargo}
                  </option>
                ))}
            </select>
            {errors.id_cargo && (
              <p className="text-red-500 text-sm">{errors.id_cargo}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fecha de Ingreso
            </label>
            <input
              type="date"
              name="fecha_ingreso"
              value={fechaActual} // Asignar la fecha actual
              className="w-full bg-blue-100 text-black border border-blue-100 rounded py-2 px-4"
              readOnly // Hacer el campo de solo lectura
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Rol
            </label>
            <select
              name="id_rol"
              value={formData.id_rol}
              onChange={handleRolChange}
              className={`w-full bg-blue-100 text-black border border-blue-100 rounded py-2 px-4 ${
                errors.id_rol ? "border-red-500" : ""
              }`}
            >
              <option value="">Seleccionar Rol</option>
              {roles &&
                roles.map((rol) => (
                  <option key={rol.id_rol} value={rol.id_rol}>
                    {rol.rol}
                  </option>
                ))}
            </select>
            {errors.id_rol && (
              <p className="text-red-500 text-sm">{errors.id_rol}</p>
            )}
          </div>
        </div>
      </div>
    </form>
  );
};

export default FormularioEmpleado;
