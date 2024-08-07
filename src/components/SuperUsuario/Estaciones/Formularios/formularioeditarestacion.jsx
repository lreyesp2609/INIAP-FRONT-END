import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTimes } from '@fortawesome/free-solid-svg-icons';

const FormularioEditarEstacion = ({ estacion, onSubmit, onCancel }) => {
  const [nombreEstacion, setNombreEstacion] = useState(estacion.nombre_estacion);
  const [ruc, setRuc] = useState(estacion.ruc);
  const [direccion, setDireccion] = useState(estacion.direccion);
  const [telefono, setTelefono] = useState(estacion.telefono);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      nombre_estacion: nombreEstacion,
      ruc,
      direccion,
      telefono
    });
  };

  return (
    <div className="p-4">
  <form onSubmit={handleSubmit} className="space-y-4">
    <h3 className="text-xl font-semibold mb-4">Datos de la Estación</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Nombre de la Estación</label>
        <input
          type="text"
          value={nombreEstacion}
          onChange={(e) => setNombreEstacion(e.target.value)}
          className="w-full bg-blue-100 text-black border border-blue-100 rounded py-2 px-4"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">RUC</label>
        <input
          type="text"
          value={ruc}
          onChange={(e) => setRuc(e.target.value)}
          className="w-full bg-blue-100 text-black border border-blue-100 rounded py-2 px-4"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Dirección</label>
        <input
          type="text"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          className="w-full bg-blue-100 text-black border border-blue-100 rounded py-2 px-4"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Teléfono</label>
        <input
          type="text"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          className="w-full bg-blue-100 text-black border border-blue-100 rounded py-2 px-4"
          required
        />
      </div>
    </div>
    <div className="mt-8 flex flex-col md:flex-row justify-end md:space-x-4 space-y-4 md:space-y-0">
      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 
        border-b-4 border-blue-300 hover:border-blue-700 rounded
        "
      >
       <FontAwesomeIcon icon={faSave} /> Guardar
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 
        px-4 border-b-4 border-red-400 hover:border-red-900 rounded"
      >
        <FontAwesomeIcon icon={faTimes} /> Cancelar
      </button>
    </div>
  </form>
</div>

  );
};

export default FormularioEditarEstacion;
