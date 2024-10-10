import React, { useState, useEffect } from 'react';
import { notification } from 'antd';
import API_URL from '../../../Config';

const CrearRutaMovilizacion = ({ onClose, Userid, idRuta }) => {
  const [provincias, setProvincias] = useState([]);
  const [ciudadesOrigen, setCiudadesOrigen] = useState([]);
  const [ciudadesDestino, setCiudadesDestino] = useState([]);
  const [rutaData, setRutaData] = useState(null);

  const [selectedProvinciaOrigen, setSelectedProvinciaOrigen] = useState('');
  const [selectedCiudadOrigen, setSelectedCiudadOrigen] = useState('');
  const [selectedProvinciaDestino, setSelectedProvinciaDestino] = useState('');
  const [selectedCiudadDestino, setSelectedCiudadDestino] = useState('');

  const [rutaDescripcion, setRutaDescripcion] = useState('');
  const [rutaEstado, setRutaEstado] = useState('');

  const obtenerProvinciaPorCiudad = (ciudad) => {
    for (const provincia of provincias) {
      if (provincia.Ciudades.includes(ciudad)) {
        return provincia.Provincia;
      }
    }
    return '';
  };

  const fetchProvinciasYCiudades = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        notification.error({ message: 'Token no encontrado' });
        return;
      }

      const response = await fetch(`${API_URL}/Informes/listar-provincias-ciudades/`, {
        headers: {
          Authorization: `${token}`,
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
    if (provincias.length > 0 && rutaData) {
      const provinciaOrigen = obtenerProvinciaPorCiudad(rutaData.ruta_origen);
      const provinciaDestino = obtenerProvinciaPorCiudad(rutaData.ruta_destino);
  
      setSelectedProvinciaOrigen(provinciaOrigen);
      setSelectedCiudadOrigen(rutaData.ruta_origen);
  
      setSelectedProvinciaDestino(provinciaDestino);
      setSelectedCiudadDestino(rutaData.ruta_destino);
  
      setRutaDescripcion(rutaData.ruta_descripcion);
      setRutaEstado(rutaData.ruta_estado.toString());
    }
  }, [provincias, rutaData]);
  
  useEffect(() => {
    if (selectedProvinciaOrigen) {
      const provinciaOrigen = provincias.find((p) => p.Provincia === selectedProvinciaOrigen);
      if (provinciaOrigen) {
        setCiudadesOrigen(provinciaOrigen.Ciudades);
      }
    }
  }, [selectedProvinciaOrigen, provincias]);

  useEffect(() => {
    if (selectedProvinciaDestino) {
      const provinciaDestino = provincias.find((p) => p.Provincia === selectedProvinciaDestino);
      if (provinciaDestino) {
        setCiudadesDestino(provinciaDestino.Ciudades);
      }
    }
  }, [selectedProvinciaDestino, provincias]);

  useEffect(() => {
    setRutaDescripcion(`${selectedCiudadOrigen} - ${selectedCiudadDestino}`);
  }, [selectedCiudadOrigen, selectedCiudadDestino]);

  useEffect(() => {
    if (selectedProvinciaDestino) {
      const provinciaDestino = provincias.find((p) => p.Provincia === selectedProvinciaDestino);
      if (provinciaDestino) {
        setCiudadesDestino(provinciaDestino.Ciudades);
      }
    }
  }, [selectedProvinciaDestino, provincias]);

  useEffect(() => {
    setRutaDescripcion(`${selectedCiudadOrigen} - ${selectedCiudadDestino}`);
  }, [selectedCiudadOrigen, selectedCiudadDestino]);

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


  // Función para obtener los datos de la ruta actual
  const fetchRutaActual = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        notification.error({ message: 'Token no encontrado' });
        return;
      }

      const response = await fetch(`${API_URL}/OrdenesMovilizacion/detalle-ruta/${Userid}/${idRuta}/`, {
        headers: {
          Authorization: `${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRutaData(data);
      } else {
        notification.error({ message: 'Error al obtener los datos de la ruta' });
      }
    } catch (error) {
      notification.error({ message: 'Error al obtener los datos de la ruta: ' + error.message });
    }
  };

  useEffect(() => {
    fetchProvinciasYCiudades();
    fetchRutaActual();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        notification.error({ message: 'Token no encontrado' });
        return;
      }

      const formData = new FormData();
      formData.append('ruta_origen', selectedCiudadOrigen);
      formData.append('ruta_destino', selectedCiudadDestino);
      formData.append('ruta_descripcion', rutaDescripcion);
      formData.append('ruta_estado', rutaEstado);

      const response = await fetch(`${API_URL}/OrdenesMovilizacion/editar-ruta/${Userid}/${idRuta}/`, {
        method: 'POST',
        headers: {
          Authorization: `${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        notification.success({ message: 'Ruta actualizada exitosamente' });
        onClose();
      } else {
        const errorData = await response.json();
        notification.error({ message: errorData.error || 'Error al actualizar la ruta' });
      }
    } catch (error) {
      notification.error({ message: 'Error al actualizar la ruta: ' + error.message });
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-2xl font-bold mb-4">Editar Ruta</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Seleccionar Origen</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
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
            <div>
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
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Seleccionar Destino</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
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
            <div>
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
          </div>
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
          <select
            value={rutaEstado}
            onChange={(e) => setRutaEstado(e.target.value)}
            className="block w-full p-2 border"
          >
            <option value="">Seleccione el estado</option>
            <option value="1">Disponible</option>
            <option value="0">No disponible</option>
          </select>
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Editar Ruta
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrearRutaMovilizacion;