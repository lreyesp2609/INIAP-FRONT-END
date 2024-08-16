import React from 'react';

const ModalHabilitarRuta = ({ ruta, onClose }) => {
  const handleHabilitar = () => {
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Deshabilitar Ruta</h2>
        <p>¿Estás seguro de que deseas deshabilitar la ruta "{ruta.ruta_descripcion}"?</p>
        <button onClick={handleHabilitar}>Sí</button>
        <button onClick={onClose}>No</button>
      </div>
    </div>
  );
};

export default ModalHabilitarRuta;
