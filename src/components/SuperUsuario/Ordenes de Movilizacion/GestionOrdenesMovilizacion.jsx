import React, { useState, useEffect } from 'react';
import API_URL from "../../../Config";
import { notification } from 'antd';
import CrearRutaMovilizacion from './CrearRutaMovilizacion'
import EditarRutaMovilizacion from './EditarRutaMovilizacion'
import EditarHorarioMovilizacion from './EditarHorarioMovilizacion'

const GestionOrdenMovilizacion = () => {
  const [error, setError] = useState(null);
  const [horario, setHorario] = useState({});
  const [rutas, setRutas] = useState([]);
  const [showCrearRuta, setShowCrearRuta] = useState(false);
  const [showEditarRuta, setShowEditarRuta] = useState(false);
  const [showEditarHorario, setShowEditarHorario] = useState(false);


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
      const response = await fetch(`${API_URL}/OrdenesMovilizacion/ver-horario/${idUsuario}/`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

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
      const response = await fetch(`${API_URL}/OrdenesMovilizacion/listar-rutas/${idUsuario}/`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

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

  const handleClickCrearRuta = () => {
    setShowCrearRuta(true);
  };

  const handleCloseCrearRuta = () => {
    setShowCrearRuta(false);
    useEffect(); 
  };

  if (showCrearRuta) {
    return <CrearRutaMovilizacion onClose={handleCloseCrearRuta} />;
  }

  const handleClickEditarRuta = () => {
    setShowEditarRuta(true);
  };

  const handleCloseEditarRuta = () => {
    setShowEditarRuta(false);
    useEffect(); 
  };

  if (showEditarRuta) {
    return <EditarRutaMovilizacion onClose={handleCloseEditarRuta} />;
  }

  const handleClickEditarHorario = () => {
    setShowEditarHorario(true);
  };

  const handleCloseEditarHorario = () => {
    setShowEditarHorario(false);
    fetchHorario();
    useEffect(); 
  };

  if (showEditarHorario) {
    return <EditarHorarioMovilizacion onClose={handleCloseEditarHorario} />;
  }

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
              Las Órdenes de Movilización se pueden realizar desde las <strong>{horario.hora_ida_minima}</strong> 
              hasta las <strong>{horario.hora_llegada_maxima}</strong>, 
              pueden tener una duración mínima de <strong>{horario.duracion_minima}</strong> 
              y durar máximo <strong>{horario.duracion_maxima}</strong>. {' '}
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
        <h3 className="text-xl font-semibold">Rutas Registradas</h3>
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
                <th className="px-4 py-2">Origen</th>
                <th className="px-4 py-2">Destino</th>
                <th className="px-4 py-2">Descripción</th>
                <th className="px-4 py-2">Estado</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rutas.map((ruta, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{ruta.ruta_origen}</td>
                  <td className="border px-4 py-2">{ruta.ruta_destino}</td>
                  <td className="border px-4 py-2">{ruta.ruta_descripcion}</td>
                  <td className="border px-4 py-2">{ruta.ruta_estado}</td>
                  <td className="border px-4 py-2">

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default GestionOrdenMovilizacion;
