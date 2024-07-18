import React, { useState } from 'react';
import API_URL from '../../../Config';
import { Modal, Input, notification } from 'antd';

const AprobarSolicitudMovilizacion = ({ ordenId, userId, visible, onClose, onAprobar }) => {
  const [motivo, setMotivo] = useState('');
  const [secuencial, setSecuencial] = useState('');

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
      formData.append('motivo', motivo);
      formData.append('secuencial_orden_movilizacion', secuencial)

      const response = await fetch(
        `${API_URL}/OrdenesMovilizacion/aprobar-orden/${userId}/${ordenId}/`,
        {
          method: 'POST',
          headers: {
            Authorization: `${token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        notification.success({
          message: 'Éxito',
          description: 'Solicitud aprobada exitosamente',
        });
        onAprobar();
        onClose();
      } else {
        const errorData = await response.json();
        notification.error({
          message: 'Error',
          description: errorData.error || 'Error al aprobar solicitud',
        });
      }
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Error al aprobar solicitud',
      });
    }
  };

  return (
    <Modal
      title="Aprobar Solicitud"
      visible={visible}
      onOk={handleOk}
      onCancel={onClose}
      okText="Aprobar"
      cancelText="Cancelar"
    >
      <Input.TextArea
        value={motivo}
        onChange={(e) => setMotivo(e.target.value)}
        placeholder="Motivo (opcional)"
        rows={4}
      />
      <Input.TextArea
        value={secuencial}
        onChange={(e) => setSecuencial(e.target.value)}
        placeholder="Ingrese el Secuelcial del Preimpreso"
        rows={1}
      />
    </Modal>
  );
};

export default AprobarSolicitudMovilizacion;
