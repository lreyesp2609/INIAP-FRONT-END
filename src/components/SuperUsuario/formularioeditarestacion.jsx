import React, { useState } from 'react';

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
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre de la Estación</label>
          <input
            type="text"
            value={nombreEstacion}
            onChange={(e) => setNombreEstacion(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">RUC</label>
          <input
            type="text"
            value={ruc}
            onChange={(e) => setRuc(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Dirección</label>
          <input
            type="text"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Teléfono</label>
          <input
            type="text"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Guardar
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormularioEditarEstacion;
