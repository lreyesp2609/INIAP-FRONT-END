import React, { useState, useEffect } from 'react';
import API_URL from "../../../Config";
import { notification } from 'antd';
import { FaBan, FaCheck, FaEdit} from 'react-icons/fa';
import CrearRutaMovilizacion from './CrearRutaMovilizacion';
import EditarRutaMovilizacion from './EditarRutaMovilizacion';
import EditarHorarioMovilizacion from './EditarHorarioMovilizacion';
import ModalDeshabilitarRuta from './ModalDeshabilitarRuta';
import ModalHabilitarRuta from './ModalHabilitarRuta';

const GestionOrdenMovilizacion = () => {
  const [error, setError] = useState(null);
  const [horario, setHorario] = useState({});
  const [rutas, setRutas] = useState([]);
  const [showCrearRuta, setShowCrearRuta] = useState(false);
  const [showEditarRuta, setShowEditarRuta] = useState(false);
  const [showEditarHorario, setShowEditarHorario] = useState(false);
  const [deshabilitarModalVisible, setDeshabilitarModalVisible] = useState(false);
  const [habilitarModalVisible, setHabilitarModalVisible] = useState(false);
  const [selectedRuta, setSelectedRuta] = useState(null);
  const [selectedRutaDescripcion, setSelectedRutaDescripcion] = useState('');


  const storedUser = JSON.parse(localStorage.getItem('user'));
  const idUsuario = storedUser?.usuario?.id_usuario;

  useEffect(() => {
    fetchHorario();
    fetchRutas();
  }, [idUsuario]);

  const fetchHorario = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      notification.error({
        message: 'Error',
        description: 'Token no proporcionado',
      });
      return;
    }

    try {
      const response = await fetch(`${API_URL}/OrdenesMovilizacion/ver-horario/${idUsuario}/`, {
        headers: {
          Authorization: `${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setHorario(data.horario);
      } else {
        const errorData = await response.json();
        setError(errorData.error);
        notification.error({
          message: 'Error',
          description: errorData.error,
        });
      }
    } catch (error) {
      setError(error.toString());
      notification.error({
        message: 'Error',
        description: 'Error al obtener el horario',
      });
    }
  };

  const fetchRutas = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      notification.error({
        message: 'Error',
        description: 'Token no proporcionado',
      });
      return;
    }

    try {
      const response = await fetch(`${API_URL}/OrdenesMovilizacion/listar-rutas/${idUsuario}/`, {
        headers: {
          Authorization: `${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRutas(data.rutas);
      } else {
        const errorData = await response.json();
        setError(errorData.error);
        notification.error({
          message: 'Error',
          description: errorData.error,
        });
      }
    } catch (error) {
      setError(error.toString());
      notification.error({
        message: 'Error',
        description: 'Error al obtener las rutas',
      });
    }
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hourInt = parseInt(hours, 10);
    const ampm = hourInt >= 12 ? 'pm' : 'am';
    const formattedHour = hourInt % 12 || 12;
    return `${formattedHour}:${minutes}${ampm}`;
  };

  const formatDuration = (minutes) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs}:${mins.toString().padStart(2, '0')}hrs`;
  };

  const handleClickCrearRuta = () => {
    setShowCrearRuta(true);
  };

  const handleCloseCrearRuta = () => {
    setShowCrearRuta(false);
    fetchRutas();
  };

  if (showCrearRuta) {
    return <CrearRutaMovilizacion onClose={handleCloseCrearRuta} Userid={idUsuario} />;
  }

  const handleClickEditarRuta = (idRuta) => {
    setSelectedRuta(idRuta);
    setShowEditarRuta(true);
  };
  

  const handleCloseEditarRuta = () => {
    setShowEditarRuta(false);
    fetchRutas();
  };

  if (showEditarRuta) {
    return <EditarRutaMovilizacion onClose={handleCloseEditarRuta} Userid={idUsuario} idRuta={selectedRuta} />;
  }
  
  const handleClickEditarHorario = () => {
    setShowEditarHorario(true);
  };

  const handleCloseEditarHorario = () => {
    setShowEditarHorario(false);
    fetchHorario();
  };

  if (showEditarHorario) {
    return <EditarHorarioMovilizacion onClose={handleCloseEditarHorario} Userid={idUsuario}  />;
  }

  const handleDeshabilitarRuta = (ruta, descripcion) => {
    setSelectedRuta(ruta);
    setSelectedRutaDescripcion(descripcion)
    setDeshabilitarModalVisible(true);
  };

  const handleHabilitarRuta = (ruta, descripcion) => {
    setSelectedRuta(ruta);
    setSelectedRutaDescripcion(descripcion)
    setHabilitarModalVisible(true);
  };

  const handleCloseModalDeshabilitar = () => {
    setDeshabilitarModalVisible(false);
    fetchRutas();
  };

  const handleCloseModalHabilitar = () => {
    setHabilitarModalVisible(false);
    fetchRutas();
  };

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-2xl font-bold">Gestión Órdenes de Movilización</h2>

      <div className="mt-4">
        <h3 className="text-xl font-semibold">Horario de Movilización</h3>
        {Object.keys(horario).length === 0 ? (
          <p>Horario no asignado. {' '}
            <span
              className="text-blue-500 cursor-pointer hover:underline"
              onClick={handleClickEditarHorario}
            >
              Asignar Horario
            </span>
          </p>
        ) : (
          <div>
            <p>
              Las Órdenes de Movilización se pueden realizar desde las{' '}
              <strong>{formatTime(horario.hora_ida_minima)}</strong> hasta las{' '}
              <strong>{formatTime(horario.hora_llegada_maxima)}</strong>, pueden
              tener una duración mínima de <strong>{formatDuration(horario.duracion_minima)}</strong> y durar
              máximo <strong>{formatDuration(horario.duracion_maxima)}</strong>.{' '}
              <span
                className="text-blue-500 cursor-pointer hover:underline"
                onClick={handleClickEditarHorario}
              >
                Editar Horario
              </span>
            </p>
          </div>
        )}
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Rutas Registradas</h3>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 border-b-4 border-blue-300 
                  hover:border-blue-700 rounded
                  mt-2 md:mt-0 md:ml-2"
            onClick={handleClickCrearRuta}
          >
            Agregar Ruta
          </button>
        </div>

        {rutas.length === 0 ? (
          <p>
            Rutas no registradas.{' '}
            <span
              className="text-blue-500 cursor-pointer hover:underline"
              onClick={handleClickCrearRuta}
            >
              Agregar Ruta
            </span>
          </p>
        ) : (
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">Descripción</th>
                <th className="px-4 py-2">Origen</th>
                <th className="px-4 py-2">Destino</th>
                <th className="px-4 py-2">Estado</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rutas.map((ruta, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{ruta.ruta_descripcion}</td>
                  <td className="border px-4 py-2">{ruta.ruta_origen}</td>
                  <td className="border px-4 py-2">{ruta.ruta_destino}</td>
                  <td className="border px-4 py-2">
                    {ruta.ruta_estado === 1 ? 'Disponible' : 'No Disponible'}
                  </td>
                  <td className="border px-4 py-2 text-sm text-gray-600 flex space-x-2">
                  <button
                      className="p-2 bg-blue-500 text-white rounded-full"
                      title="Editar Ruta"
                      onClick={() => handleClickEditarRuta(ruta.id_ruta_movilizacion)}
                      >
                        <FaEdit />
                      </button>
                    {ruta.ruta_estado === 1 ? (
                        <button 
                        className="p-2 bg-red-500 text-white rounded-full"
                        title="Deshabilitar"
                        onClick={() => handleDeshabilitarRuta(ruta.id_ruta_movilizacion, ruta.ruta_descripcion)}
                        >
                          <FaBan />
                        </button>
                    ) : (
                      <button 
                      className="p-2 bg-green-500 text-white rounded-full"
                      title="Habilitar"
                      onClick={() => handleHabilitarRuta(ruta.id_ruta_movilizacion, ruta.ruta_descripcion)}
                      >
                        <FaCheck />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ModalDeshabilitarRuta
        ruta={selectedRuta}
        descripcion={selectedRutaDescripcion}
        visible={deshabilitarModalVisible}
        onClose={handleCloseModalDeshabilitar}
      />

      <ModalHabilitarRuta
        ruta={selectedRuta}
        descripcion={selectedRutaDescripcion}
        visible={habilitarModalVisible}
        onClose={handleCloseModalHabilitar}
      />
    </div>
  );
};

export default GestionOrdenMovilizacion;
