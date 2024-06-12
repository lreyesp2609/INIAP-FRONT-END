import React from 'react';
import { useNavigate } from 'react-router-dom';

const MenuEmpleados = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div>
      <h1>Hola Empleado</h1>
      <button onClick={handleLogout}>Cerrar Sesión</button>
    </div>
  );
}

export default MenuEmpleados;