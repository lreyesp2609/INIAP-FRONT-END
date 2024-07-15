import React from "react";

const FormularioEditarEmpleado = ({
  formData,
  handleInputChange,
  cargos = [],
  roles = [],
  estaciones = [],
  unidades = [],
  licencias = [],
}) => {
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
          name="cedula"
          value={formData.cedula}
          onChange={handleInputChange}
          className="w-full bg-blue-100 text-black border border-blue-100 rounded py-2 px-4"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Nombres
        </label>
        <input
          type="text"
          name="nombres"
          value={formData.nombres}
          onChange={handleInputChange}
          className="w-full bg-blue-100 text-black border border-blue-100 rounded py-2 px-4"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Apellidos
        </label>
        <input
          type="text"
          name="apellidos"
          value={formData.apellidos}
          onChange={handleInputChange}
          className="w-full bg-blue-100 text-black border border-blue-100 rounded py-2 px-4"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Distintivo
        </label>
        <input
          type="text"
          name="distintivo"
          value={formData.distintivo}
          onChange={handleInputChange}
          className="w-full bg-blue-100 text-black border border-blue-100 rounded py-2 px-4"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Fecha de Nacimiento
        </label>
        <input
          type="date"
          name="fecha_nacimiento"
          value={formData.fecha_nacimiento}
          onChange={handleInputChange}
          className="w-full bg-blue-100 text-black border border-blue-100 rounded py-2 px-4"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Género
        </label>
        <select
          name="genero"
          value={formData.genero}
          onChange={handleInputChange}
          className="w-full bg-blue-100 text-black border border-blue-100 rounded py-2 px-4"
        >
          <option value="Masculino">Masculino</option>
          <option value="Femenino">Femenino</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Celular
        </label>
        <input
          type="text"
          name="celular"
          value={formData.celular}
          onChange={handleInputChange}
          className="w-full bg-blue-100 text-black border border-blue-100 rounded py-2 px-4"
        />
      </div>
      <div className="col-span-1 md:col-span-2 lg:col-span-3">
        <label className="block text-sm font-medium text-gray-700">
          Dirección
        </label>
        <input
          type="text"
          name="direccion"
          value={formData.direccion}
          onChange={handleInputChange}
          className="w-full bg-blue-100 text-black border border-blue-100 rounded py-2 px-4"
        />
      </div>
      <div className="col-span-1 md:col-span-2 lg:col-span-3">
        <label className="block text-sm font-medium text-gray-700">
          Correo Electrónico
        </label>
        <input
          type="email"
          name="correo_electronico"
          value={formData.correo_electronico}
          onChange={handleInputChange}
          className="w-full bg-blue-100 text-black border border-blue-100 rounded py-2 px-4"
        />
      </div>
    </div>
  </div>
  <div>
    <h3 className="text-xl font-semibold mb-4">Datos de la Empresa</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Estación
        </label>
        <select
          name="estacion"
          value={formData.estacion}
          onChange={handleInputChange}
          className="w-full bg-blue-100 text-black border border-blue-100 rounded py-2 px-4"
        >
          {estaciones &&
            estaciones.map((estacion) => (
              <option
                key={estacion.id_estacion}
                value={estacion.id_estacion}
              >
                {estacion.nombre_estacion}
              </option>
            ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Unidad
        </label>
        <select
          name="unidad"
          value={formData.unidad}
          onChange={handleInputChange}
          className="w-full bg-blue-100 text-black border border-blue-100 rounded py-2 px-4"
        >
          <option value="">Seleccionar Unidad</option>
          {unidades &&
            unidades.map((unidad) => (
              <option key={unidad.id_unidad} value={unidad.id_unidad}>
                {unidad.nombre_unidad}
              </option>
            ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Cargo
        </label>
        <select
          name="id_cargo"
          value={formData.id_cargo}
          onChange={handleInputChange}
          className="w-full bg-blue-100 text-black border border-blue-100 rounded py-2 px-4"
        >
          <option value="">Seleccionar Cargo</option>
          {cargos &&
            cargos.map((cargo) => (
              <option key={cargo.id_cargo} value={cargo.id_cargo}>
                {cargo.cargo}
              </option>
            ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Fecha de Ingreso
        </label>
        <input
          type="date"
          name="fecha_ingreso"
          value={formData.fecha_ingreso}
          onChange={handleInputChange}
          className="w-full bg-blue-100 text-black border border-blue-100 rounded py-2 px-4"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Habilitado
        </label>
        <select
          name="habilitado"
          value={formData.habilitado}
          onChange={handleInputChange}
          className="w-full bg-blue-100 text-black border border-blue-100 rounded py-2 px-4"
        >
          <option value={true}>Habilitado</option>
          <option value={false}>No Habilitado</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Usuario
        </label>
        <input
          type="text"
          name="usuario"
          value={formData.usuario}
          onChange={handleInputChange}
          className="w-full bg-blue-100 text-black border border-blue-100 rounded py-2 px-4"
        />
        
      </div>
      <div >
        
      <label className="block text-sm font-medium text-gray-700">
              Tipo de Licencia
            </label>
            <select
              name="licencia"
              value={formData.id_licencia}
              onChange={handleInputChange}
              className="w-full bg-blue-100 text-black border border-blue-100 rounded py-2 px-4"
            >
              <option value="">Seleccione licencia</option>
              {licencias &&
              licencias.map((licencia) => (
                <option key={licencia.id_tipo_licencia} value={licencia.id_tipo_licencia}>
                  {licencia.tipo_licencia}
                </option>
              ))}
            </select>
        </div>
        <div >
        <label className="block text-sm font-medium text-gray-700">
          Rol
        </label>
        <select
          name="id_rol"
          value={formData.id_rol}
          onChange={handleInputChange}
          className="w-full bg-blue-100 text-black border border-blue-100 rounded py-2 px-4"
        >
          {roles &&
            roles.map((rol) => (
              <option key={rol.id_rol} value={rol.id_rol}>
                {rol.rol}
              </option>
            ))}
        </select>
       
      </div>
    </div>
  </div>
</form>

  );
};

export default FormularioEditarEmpleado;
