import React, { useState, useEffect } from 'react';
import API_URL from '../../../Config';

const CrearInformes = ({ idSolicitud, onClose }) => {
  const [informeData, setInformeData] = useState(null);
  const [formData, setFormData] = useState({
    fecha_informe: '',
    fecha_salida_informe: '',
    hora_salida_informe: '',
    fecha_llegada_informe: '',
    hora_llegada_informe: '',
    evento: '',
    observacion: '',
    transportes: [],
    productos: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInformeData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token no encontrado');

        const response = await fetch(`${API_URL}/Informes/datos-informe/${idSolicitud}/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Error al obtener datos del informe');

        const data = await response.json();
        setInformeData(data.informe);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchInformeData();
  }, [idSolicitud]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleTransporteChange = (index, field, value) => {
    const newTransportes = [...formData.transportes];
    newTransportes[index] = { ...newTransportes[index], [field]: value };
    setFormData(prevState => ({
      ...prevState,
      transportes: newTransportes
    }));
  };

  const addTransporte = () => {
    setFormData(prevState => ({
      ...prevState,
      transportes: [...prevState.transportes, {
        tipo_transporte_info: '',
        nombre_transporte_info: '',
        ruta_info: '',
        fecha_salida_info: '',
        hora_salida_info: '',
        fecha_llegada_info: '',
        hora_llegada_info: ''
      }]
    }));
  };

  const handleProductoChange = (index, value) => {
    const newProductos = [...formData.productos];
    newProductos[index] = { descripcion: value };
    setFormData(prevState => ({
      ...prevState,
      productos: newProductos
    }));
  };

  const addProducto = () => {
    setFormData(prevState => ({
      ...prevState,
      productos: [...prevState.productos, { descripcion: '' }]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token no encontrado');

      const response = await fetch(`${API_URL}/Informes/crear-informe/${idSolicitud}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Error al crear el informe');

      const data = await response.json();
      alert('Informe creado exitosamente');
      onClose();
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) return <div className="text-center">Cargando...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Crear Informe</h2>
      <div className="bg-gray-100 p-4 mb-4 rounded">
        <h3 className="text-xl font-semibold mb-2">Datos de la Solicitud</h3>
        <p><strong>Código de Solicitud:</strong> {informeData['Codigo de Solicitud']}</p>
        <p><strong>Fecha Actual:</strong> {informeData['Fecha Actual']}</p>
        <p><strong>Nombre Completo:</strong> {informeData['Nombre Completo']}</p>
        <p><strong>Cargo:</strong> {informeData['Cargo']}</p>
        <p><strong>Lugar de Servicio:</strong> {informeData['Lugar de Servicio']}</p>
        <p><strong>Nombre de Unidad:</strong> {informeData['Nombre de Unidad']}</p>
        <p><strong>Listado de Empleados:</strong> {informeData['Listado de Empleados']}</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Fecha Informe:</label>
          <input
            type="date"
            name="fecha_informe"
            value={formData.fecha_informe}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Fecha Salida:</label>
          <input
            type="date"
            name="fecha_salida_informe"
            value={formData.fecha_salida_informe}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Hora Salida:</label>
          <input
            type="time"
            name="hora_salida_informe"
            value={formData.hora_salida_informe}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Fecha Llegada:</label>
          <input
            type="date"
            name="fecha_llegada_informe"
            value={formData.fecha_llegada_informe}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Hora Llegada:</label>
          <input
            type="time"
            name="hora_llegada_informe"
            value={formData.hora_llegada_informe}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Evento:</label>
          <textarea
            name="evento"
            value={formData.evento}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            rows="3"
          />
        </div>
        <div>
          <label className="block mb-1">Observación:</label>
          <textarea
            name="observacion"
            value={formData.observacion}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            rows="3"
          />
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Transportes</h3>
          {formData.transportes.map((transporte, index) => (
            <div key={index} className="mb-4 p-4 border rounded">
              <input
                type="text"
                placeholder="Tipo de Transporte"
                value={transporte.tipo_transporte_info}
                onChange={(e) => handleTransporteChange(index, 'tipo_transporte_info', e.target.value)}
                className="w-full p-2 border rounded mb-2"
              />
              <input
                type="text"
                placeholder="Nombre del Transporte"
                value={transporte.nombre_transporte_info}
                onChange={(e) => handleTransporteChange(index, 'nombre_transporte_info', e.target.value)}
                className="w-full p-2 border rounded mb-2"
              />
              <input
                type="text"
                placeholder="Ruta"
                value={transporte.ruta_info}
                onChange={(e) => handleTransporteChange(index, 'ruta_info', e.target.value)}
                className="w-full p-2 border rounded mb-2"
              />
              <input
                type="date"
                placeholder="Fecha de Salida"
                value={transporte.fecha_salida_info}
                onChange={(e) => handleTransporteChange(index, 'fecha_salida_info', e.target.value)}
                className="w-full p-2 border rounded mb-2"
              />
              <input
                type="time"
                placeholder="Hora de Salida"
                value={transporte.hora_salida_info}
                onChange={(e) => handleTransporteChange(index, 'hora_salida_info', e.target.value)}
                className="w-full p-2 border rounded mb-2"
              />
              <input
                type="date"
                placeholder="Fecha de Llegada"
                value={transporte.fecha_llegada_info}
                onChange={(e) => handleTransporteChange(index, 'fecha_llegada_info', e.target.value)}
                className="w-full p-2 border rounded mb-2"
              />
              <input
                type="time"
                placeholder="Hora de Llegada"
                value={transporte.hora_llegada_info}
                onChange={(e) => handleTransporteChange(index, 'hora_llegada_info', e.target.value)}
                className="w-full p-2 border rounded mb-2"
              />
            </div>
          ))}
          <button type="button" onClick={addTransporte} className="bg-blue-500 text-white p-2 rounded">
            Agregar Transporte
          </button>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Productos Alcanzados</h3>
          {formData.productos.map((producto, index) => (
            <div key={index} className="mb-2">
              <input
                type="text"
                placeholder="Descripción del Producto"
                value={producto.descripcion}
                onChange={(e) => handleProductoChange(index, e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          ))}
          <button type="button" onClick={addProducto} className="bg-blue-500 text-white p-2 rounded">
            Agregar Producto
          </button>
        </div>
        <div className="flex justify-end space-x-2">
          <button type="button" onClick={onClose} className="bg-gray-300 text-black p-2 rounded">
            Cancelar
          </button>
          <button type="submit" className="bg-green-500 text-white p-2 rounded">
            Crear Informe
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrearInformes;