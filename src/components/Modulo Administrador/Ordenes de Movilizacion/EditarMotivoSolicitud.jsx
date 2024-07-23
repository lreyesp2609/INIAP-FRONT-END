import React, { useState, useEffect } from 'react';
import { Modal, Input, Select, notification } from 'antd';
import API_URL from '../../../Config';

const { Option } = Select;

const EditarSolicitudMovilizacion = ({ ordenId, userId, visible, onClose, onEditar }) => {
  const [estado, setEstado] = useState('');
  const [motivo, setMotivo] = useState('');
  const [secuencial, setSecuencial] = useState('');
  const [motivos, setMotivos] = useState([]);
  const [motivosLoaded, setMotivosLoaded] = useState(false);

  useEffect(() => {
    if (visible) {
      fetchMotivos();
    }
  }, [visible]);

  useEffect(() => {
    if (motivosLoaded && ordenId) {
      fetchOrdenDetails();
    }
  }, [motivosLoaded, ordenId]);

  const fetchMotivos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/OrdenesMovilizacion/listar-motivos/${userId}/`, {
        headers: {
          Authorization: `${token}`,
        },
      });

      if (!response.ok) throw new Error('Error al obtener motivos');

      const motivosData = await response.json();
      if (!Array.isArray(motivosData)) {
        throw new Error('Datos de motivos no válidos');
      }
      setMotivos(motivosData);
      setMotivosLoaded(true);
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Error al obtener motivos',
      });
      console.error('Error fetching motivos:', error);
    }
  };

  const fetchOrdenDetails = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      notification.error({
        message: 'Error',
        description: 'No estás autenticado',
      });
      return;
    }

    try {
      const response = await fetch(`${API_URL}/OrdenesMovilizacion/detalle-orden/${userId}/${ordenId}/`, {
        headers: {
          Authorization: `${token}`,
        },
      });

      if (!response.ok) throw new Error('Error al obtener detalles de la orden');

      const data = await response.json();
      setEstado(data.estado_movilizacion);
      setSecuencial(data.secuencial_orden_movilizacion);

      // Setear el motivo actual basado en la ID de orden
      const motivoActual = motivos.find(motivo => motivo.id_orden_movilizacion === ordenId);
      setMotivo(motivoActual ? motivoActual.motivo : '');
    } catch (error) {
      notification.error({
        message: 'Error',
        description: error.message,
      });
    }
  };

  const handleOk = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      notification.error({
        message: 'Error',
        description: 'No estás autenticado',
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('estado', estado);
      formData.append('motivo', motivo);
      formData.append('secuencial', secuencial);

      const response = await fetch(`${API_URL}/OrdenesMovilizacion/editar-motivo-orden/${userId}/${ordenId}/`, {
        method: 'POST',
        headers: {
          Authorization: `${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        notification.success({
          message: 'Éxito',
          description: 'Acción editada exitosamente',
        });
        onEditar();
        onClose();
      } else {
        const errorData = await response.json();
        notification.error({
          message: 'Error',
          description: errorData.error || 'Error al editar la orden',
        });
      }
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Error al editar la orden',
      });
    }
  };

  return (
    <Modal
      title="Editar Motivo"
      visible={visible}
      onOk={handleOk}
      onCancel={onClose}
      okText="Guardar"
      cancelText="Cancelar"
    >
      <Select value={estado} onChange={setEstado} style={{ width: '100%', marginBottom: '1rem' }}>
        <Option value="Aprobado">Aprobar</Option>
        <Option value="Denegado">Rechazar</Option>
      </Select>
      <Input.TextArea
        value={motivo}
        onChange={(e) => setMotivo(e.target.value)}
        placeholder="Motivo"
        rows={4}
        style={{ marginBottom: '1rem' }}
      />
      {estado === 'Aprobado' && (
        <Input
          value={secuencial}
          onChange={(e) => setSecuencial(e.target.value)}
          placeholder="Secuencial del Preimpreso"
          style={{ marginBottom: '1rem' }}
        />
      )}
    </Modal>
  );
};

export default EditarSolicitudMovilizacion;
