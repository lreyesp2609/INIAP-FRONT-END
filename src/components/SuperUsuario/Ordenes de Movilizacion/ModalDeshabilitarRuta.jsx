import React, { useState } from 'react';
import { Modal, notification } from 'antd';

const ModalDeshabilitarRuta = ({ ruta, onClose }) => {
  const [visible, setVisible] = useState(true);

  const handleDeshabilitar = () => {
    setVisible(false);
    onClose();
  };

  return (
    <Modal
      title="Deshabilitar Ruta"
      visible={visible}
      onOk={handleDeshabilitar}
      onCancel={() => setVisible(false)}
      okText="Deshabilitar"
      cancelText="Cancelar"
    >
      ¿Estás seguro de que deseas deshabilitar la ruta "{ruta.ruta_descripcion}"?
    </Modal>
  );
};

export default ModalDeshabilitarRuta;
