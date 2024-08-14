import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../../Config';
import { notification, Tooltip } from 'antd';

const CrearRutaMovilizacion = ({ onClose }) => {
  const navigate = useNavigate();

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-2xl font-bold">Crear Ruta</h2>
    </div>
);

};

export default CrearRutaMovilizacion;