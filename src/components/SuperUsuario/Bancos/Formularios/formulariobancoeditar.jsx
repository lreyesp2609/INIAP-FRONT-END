import React from 'react';

const FormularioBancoEditar = ({ nombre_banco, onInputChange }) => {
  return (
    <form className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Nombre del Banco</label>
        <input
          type="text"
          name="nombre_banco"
          value={nombre_banco}
          onChange={onInputChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>
    </form>
  );
};

export default FormularioBancoEditar;
