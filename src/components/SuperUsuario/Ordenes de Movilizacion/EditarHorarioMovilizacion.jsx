import React, { useState } from 'react';
import API_URL from '../../../Config';
import { notification, Button, Input } from 'antd';

const EditarHorarioMovilizacion = ({ onClose }) => {
  const [horaIdaMinima, setHoraIdaMinima] = useState('');
  const [horaLlegadaMaxima, setHoraLlegadaMaxima] = useState('');
  const [duracionMinima, setDuracionMinima] = useState('');
  const [duracionMaxima, setDuracionMaxima] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      notification.error({
        message: 'Error',
        description: 'Token no proporcionado',
      });
      setLoading(false);
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem('user'));
    const idUsuario = storedUser?.usuario?.id_usuario;

    const formData = new FormData();
    formData.append('hora_ida_minima', horaIdaMinima);
    formData.append('hora_llegada_maxima', horaLlegadaMaxima);
    formData.append('duracion_minima', parseInt(duracionMinima));
    formData.append('duracion_maxima', parseInt(duracionMaxima));

    try {
      const response = await fetch(`${API_URL}/OrdenesMovilizacion/editar-horario/${idUsuario}/`, {
        method: 'POST',
        headers: {
          Authorization: `${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        notification.success({
          message: 'Éxito',
          description: data.message,
        });
        onClose();
      } else {
        const errorData = await response.json();
        notification.error({
          message: 'Error',
          description: errorData.error,
        });
      }
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Error al enviar el formulario',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-2xl font-bold">Crear Horario</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Hora Ida Mínima:</label>
          <Input
            type="time"
            value={horaIdaMinima}
            onChange={(e) => setHoraIdaMinima(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1">Hora Llegada Máxima:</label>
          <Input
            type="time"
            value={horaLlegadaMaxima}
            onChange={(e) => setHoraLlegadaMaxima(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1">Duración Mínima (minutos):</label>
          <Input
            type="number"
            value={duracionMinima}
            onChange={(e) => setDuracionMinima(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1">Duración Máxima (minutos):</label>
          <Input
            type="number"
            value={duracionMaxima}
            onChange={(e) => setDuracionMaxima(e.target.value)}
            required
          />
        </div>
        <div className="flex justify-end">
          <Button type="primary" htmlType="submit" loading={loading}>
            Guardar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditarHorarioMovilizacion;
