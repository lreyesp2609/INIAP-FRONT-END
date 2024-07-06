import React, { useState, useEffect } from 'react';
import API_URL from '../../../Config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import TablaUnidades from './Tablas/tablaunidades';
import AgregarUnidad from './agregarunidad';

const GestionUnidadesPorEstacion = ({ id_estacion, onClose, id_usuario }) => {
  const [unidades, setUnidades] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('ID de estación recibido en useEffect:', id_estacion);
    fetchUnidades();
  }, [id_estacion]);

  const fetchUnidades = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token no encontrado');
      }

      const formData = new FormData();
      formData.append('estacion_id', id_estacion); // Aquí usamos id_estacion

      const response = await fetch(`${API_URL}/Unidades/unidades/`, {
        method: 'POST',
        headers: {
          Authorization: `${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setUnidades(data);
        setError(null); // Limpiar el error si la solicitud tiene éxito
      } else {
        const errorMessage = await response.text();
        throw new Error(`Error al obtener unidades: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error al obtener unidades:', error.message);
      setError(error.message); // Capturar y manejar el error
    }
  };

  const handleAddUnidad = () => {
    setIsAdding(true);
  };

  const handleUnidadAdded = () => {
    setIsAdding(false);
    fetchUnidades();
  };

  return (
    <div className="p-4">
      {isAdding ? (
        <AgregarUnidad
          id_estacion={id_estacion}
          onClose={() => setIsAdding(false)}
          onUnidadAdded={handleUnidadAdded}
          id_usuario={id_usuario}
        />
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              Volver
            </button>
            <h1 className="text-2xl font-light">Gestionar Unidades</h1>
            <button
              onClick={handleAddUnidad}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Agregar Unidad
            </button>
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <TablaUnidades unidades={unidades} />
        </>
      )}
    </div>
  );
};

export default GestionUnidadesPorEstacion;
