import React, { useState, useEffect } from 'react';

const FormularioUnidad = ({formData,Estaciones=[] , nombre_unidad, onInputChange }) => {

  return (
    <form className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Nombre de la Unidad</label>
        <input
          type="text"
          name="nombre_unidad"
          value={nombre_unidad}
          onChange={onInputChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      <div>
       
       <label className="block text-sm font-medium text-gray-700">
          Seleccione la estación a la que pertenece
        </label>
        <select
          name="id_estacion"
          value={formData.id_estacion}
          onChange={onInputChange}
          className="w-full bg-blue-100 text-black border border-blue-100 rounded py-2 px-4"
        >
          <option value="">Seleccionar Estación</option>
          {Estaciones.map((estacion) => (
            <option key={estacion.id_estacion} value={estacion.id_estacion}>
              {estacion.nombre_estacion}
            </option>
          ))}
        </select>
        </div>
      </div>
    </form>
  );
};

export default FormularioUnidad;
