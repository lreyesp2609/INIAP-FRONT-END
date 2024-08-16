import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { notification } from 'antd';
import API_URL from '../../../Config';

const EditarRutaMovilizacion = ({ onClose, idUsuario }) => {
  const navigate = useNavigate();
  const [provincias, setProvincias] = useState([]);
  const [ciudadesOrigen, setCiudadesOrigen] = useState([]);
  const [ciudadesDestino, setCiudadesDestino] = useState([]);

  const [selectedProvinciaOrigen, setSelectedProvinciaOrigen] = useState('');
  const [selectedCiudadOrigen, setSelectedCiudadOrigen] = useState('');
  const [selectedProvinciaDestino, setSelectedProvinciaDestino] = useState('');
  const [selectedCiudadDestino, setSelectedCiudadDestino] = useState('');

  const [rutaDescripcion, setRutaDescripcion] = useState('');
  const [rutaEstado, setRutaEstado] = useState('');

  const fetchProvinciasYCiudades = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        notification.error({ message: 'Token no encontrado' });
        return;
      }

      const response = await fetch(`${API_URL}/Informes/listar-provincias-ciudades/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProvincias(data.provincias_ciudades || []);
      } else {
        const errorData = await response.json();
        notification.error({ message: errorData.error || 'Error al obtener provincias y ciudades' });
      }
    } catch (error) {
      notification.error({ message: 'Error al obtener provincias y ciudades: ' + error.message });
    }
  };

  useEffect(() => {
    fetchProvinciasYCiudades();
  }, []);

  const handleProvinciaOrigenChange = (e) => {
    const provincia = e.target.value;
    setSelectedProvinciaOrigen(provincia);
    const selectedProvinciaData = provincias.find((p) => p.Provincia === provincia);
    setCiudadesOrigen(selectedProvinciaData ? selectedProvinciaData.Ciudades : []);
    setSelectedCiudadOrigen('');
  };

  const handleProvinciaDestinoChange = (e) => {
    const provincia = e.target.value;
    setSelectedProvinciaDestino(provincia);
    const selectedProvinciaData = provincias.find((p) => p.Provincia === provincia);
    setCiudadesDestino(selectedProvinciaData ? selectedProvinciaData.Ciudades : []);
    setSelectedCiudadDestino('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        notification.error({ message: 'Token no encontrado' });
        return;
      }

      const response = await fetch(`${API_URL}/CrearRuta/${idUsuario}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ruta_origen: selectedCiudadOrigen,
          ruta_destino: selectedCiudadDestino,
          ruta_descripcion: rutaDescripcion,
          ruta_estado: rutaEstado,
        }),
      });

      if (response.ok) {
        notification.success({ message: 'Ruta creada exitosamente' });
        onClose();
      } else {
        const errorData = await response.json();
        notification.error({ message: errorData.error || 'Error al crear la ruta' });
      }
    } catch (error) {
      notification.error({ message: 'Error al crear la ruta: ' + error.message });
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-2xl font-bold">Crear Ruta</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">Provincia de Origen</label>
          <select
            value={selectedProvinciaOrigen}
            onChange={handleProvinciaOrigenChange}
            className="block w-full p-2 border"
          >
            <option value="">Seleccione una provincia</option>
            {provincias.map((provincia) => (
              <option key={provincia.Provincia} value={provincia.Provincia}>
                {provincia.Provincia}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Ciudad de Origen</label>
          <select
            value={selectedCiudadOrigen}
            onChange={(e) => setSelectedCiudadOrigen(e.target.value)}
            className="block w-full p-2 border"
            disabled={!selectedProvinciaOrigen}
          >
            <option value="">Seleccione una ciudad</option>
            {ciudadesOrigen.map((ciudad) => (
              <option key={ciudad} value={ciudad}>
                {ciudad}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Provincia de Destino</label>
          <select
            value={selectedProvinciaDestino}
            onChange={handleProvinciaDestinoChange}
            className="block w-full p-2 border"
          >
            <option value="">Seleccione una provincia</option>
            {provincias.map((provincia) => (
              <option key={provincia.Provincia} value={provincia.Provincia}>
                {provincia.Provincia}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Ciudad de Destino</label>
          <select
            value={selectedCiudadDestino}
            onChange={(e) => setSelectedCiudadDestino(e.target.value)}
            className="block w-full p-2 border"
            disabled={!selectedProvinciaDestino}
          >
            <option value="">Seleccione una ciudad</option>
            {ciudadesDestino.map((ciudad) => (
              <option key={ciudad} value={ciudad}>
                {ciudad}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Descripción de la Ruta</label>
          <input
            type="text"
            value={rutaDescripcion}
            onChange={(e) => setRutaDescripcion(e.target.value)}
            className="block w-full p-2 border"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Estado de la Ruta</label>
          <input
            type="text"
            value={rutaEstado}
            onChange={(e) => setRutaEstado(e.target.value)}
            className="block w-full p-2 border"
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
          Guardar
        </button>
      </form>
    </div>
  );
};

export default EditarRutaMovilizacion;
