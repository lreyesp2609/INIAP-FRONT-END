import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Login/navbar';

const GestionEmpleados = () => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser.usuario);
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="min-h-screen flex">
      <Navbar user={user} onLogout={handleLogout} /> {/* Renderiza el Navbar */}
      <div className="flex-grow flex justify-center items-center">
        <h1 className="text-3xl">Hola Super Usuario</h1>
      </div>
    </div>
  );
};

export default GestionEmpleados;
