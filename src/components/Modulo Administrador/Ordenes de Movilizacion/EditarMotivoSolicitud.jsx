import React, { useState, useEffect } from 'react';
import { Modal, Input, Select, notification } from 'antd';
import API_URL from '../../../Config';

const { Option } = Select;

const EditarSolicitudMovilizacion = ({ ordenId, userId, motivoId, visible, onClose, onEditar }) => {
  const [estado, setEstado] = useState('');
  const [motivo, setMotivo] = useState('');
  const [secuencial, setSecuencial] = useState('');
  const [motivos, setMotivos] = useState([]);
  const [motivosLoaded, setMotivosLoaded] = useState(false);
  const [orden, setOrden] = useState({});

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
      setOrden(data);
      setEstado(data.estado_movilizacion);
      setSecuencial(data.secuencial_orden_movilizacion);
  
      const motivoActual = motivos.find(motivo => motivo.id_motivo_orden === motivoId);
      if (motivoActual) {
        const motivoSinPrefijo = motivoActual.motivo.replace(/^Aprobado: |^Denegado: /, '');
        setMotivo(motivoSinPrefijo);
      } else {
        setMotivo('');
      }
    } catch (error) {
      notification.error({
        message: 'Error',
        description: error.message,
      });
    }
  };

  const handleOk = async () => {
    console.log('Estado:', estado);
    console.log('Motivo:', motivo);
    console.log('Secuencial:', secuencial);
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
      
      // Añadir prefijo adecuado al motivo antes de enviar
      const motivoConPrefijo = `${estado}: ${motivo}`;
      formData.append('motivo', motivoConPrefijo);
      formData.append('id_motivo', motivoId);

      if (estado === 'Aprobado') {
        if (orden.estado_movilizacion === 'Denegado') {
          formData.append('secuencial', '0000');
        } else if (orden.secuencial_orden_movilizacion !== secuencial) {
          formData.append('secuencial', secuencial);
        }
      } else if (estado === 'Denegado') {
        formData.append('secuencial', '0000');
      }

      console.log('FormData to send:', formData);

      const response = await fetch(`${API_URL}/OrdenesMovilizacion/editar-motivo/${userId}/${ordenId}/${motivoId}/`, {
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
