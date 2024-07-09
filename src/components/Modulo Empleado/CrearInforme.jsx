import React, { useState } from 'react';
import API_URL from '../../Config';

const CrearInforme = ({ idUsuario, onClose, fetchSolicitudes }) => {
  const [formValues, setFormValues] = useState({
    motivo_movilizacion: '',
    fecha_salida_solicitud: '',
    hora_salida_solicitud: '',
    fecha_llegada_solicitud: '',
    hora_llegada_solicitud: '',
    descripcion_actividades: '',
    listado_empleado: '',
    fecha_salida_informe: '',
    hora_salida_informe: '',
    fecha_llegada_informe: '',
    hora_llegada_informe: '',
    evento: '',
    observacion: '',
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Token no encontrado');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/Informes/crear-solicitud-informe/${idUsuario}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formValues),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al crear el informe');
      }

      // Limpiar campos después de enviar la solicitud exitosamente
      setFormValues({
        motivo_movilizacion: '',
        fecha_salida_solicitud: '',
        hora_salida_solicitud: '',
        fecha_llegada_solicitud: '',
        hora_llegada_solicitud: '',
        descripcion_actividades: '',
        listado_empleado: '',
        fecha_salida_informe: '',
        hora_salida_informe: '',
        fecha_llegada_informe: '',
        hora_llegada_informe: '',
        evento: '',
        observacion: '',
      });
      setError(null);

      // Actualizar la lista de solicitudes
      fetchSolicitudes();

      // Cerrar el formulario
      onClose();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-4 sm:p-6 rounded-lg w-full sm:max-w-2xl overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">Crear Informe</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">
              Motivo de Movilización:
              <input
                type="text"
                name="motivo_movilizacion"
                className="w-full border border-gray-300 p-2 rounded mt-1"
                value={formValues.motivo_movilizacion}
                onChange={handleChange}
                required
              />
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label>
                Fecha Salida Solicitud:
                <input
                  type="date"
                  name="fecha_salida_solicitud"
                  className="w-full border border-gray-300 p-2 rounded mt-1"
                  value={formValues.fecha_salida_solicitud}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Hora Salida Solicitud:
                <input
                  type="time"
                  name="hora_salida_solicitud"
                  className="w-full border border-gray-300 p-2 rounded mt-1"
                  value={formValues.hora_salida_solicitud}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Fecha Llegada Solicitud:
                <input
                  type="date"
                  name="fecha_llegada_solicitud"
                  className="w-full border border-gray-300 p-2 rounded mt-1"
                  value={formValues.fecha_llegada_solicitud}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Hora Llegada Solicitud:
                <input
                  type="time"
                  name="hora_llegada_solicitud"
                  className="w-full border border-gray-300 p-2 rounded mt-1"
                  value={formValues.hora_llegada_solicitud}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>
            <label className="block mb-2">
              Descripción de Actividades:
              <textarea
                name="descripcion_actividades"
                className="w-full border border-gray-300 p-2 rounded mt-1"
                rows="3"
                value={formValues.descripcion_actividades}
                onChange={handleChange}
              ></textarea>
            </label>
            <label className="block mb-2">
              Listado de Empleado:
              <textarea
                name="listado_empleado"
                className="w-full border border-gray-300 p-2 rounded mt-1"
                rows="2"
                value={formValues.listado_empleado}
                onChange={handleChange}
              ></textarea>
            </label>
          </div>
          <div>
            <div className="grid grid-cols-2 gap-4">
              <label>
                Fecha Salida Informe:
                <input
                  type="date"
                  name="fecha_salida_informe"
                  className="w-full border border-gray-300 p-2 rounded mt-1"
                  value={formValues.fecha_salida_informe}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Hora Salida Informe:
                <input
                  type="time"
                  name="hora_salida_informe"
                  className="w-full border border-gray-300 p-2 rounded mt-1"
                  value={formValues.hora_salida_informe}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Fecha Llegada Informe:
                <input
                  type="date"
                  name="fecha_llegada_informe"
                  className="w-full border border-gray-300 p-2 rounded mt-1"
                  value={formValues.fecha_llegada_informe}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Hora Llegada Informe:
                <input
                  type="time"
                  name="hora_llegada_informe"
                  className="w-full border border-gray-300 p-2 rounded mt-1"
                  value={formValues.hora_llegada_informe}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>
            <label className="block mb-2">
              Evento:
              <textarea
                name="evento"
                className="w-full border border-gray-300 p-2 rounded mt-1"
                rows="3"
                value={formValues.evento}
                onChange={handleChange}
              ></textarea>
            </label>
            <label className="block mb-2">
              Observación:
              <textarea
                name="observacion"
                className="w-full border border-gray-300 p-2 rounded mt-1"
                rows="3"
                value={formValues.observacion}
                onChange={handleChange}
              ></textarea>
            </label>
          </div>
          <div className="col-span-2 flex justify-end mt-4">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded mr-2 hover:bg-gray-400"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Crear Informe
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CrearInforme;
