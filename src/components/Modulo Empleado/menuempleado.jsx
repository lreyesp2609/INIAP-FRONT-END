import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LeftMenu from './lateralizquierdoEmpleado';
import ListarSolicitudes from './ListaSolicitude';
import Navbar from '../Login/navbar';

const MenuEmpleados = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [view, setView] = useState('home');

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
    navigate('/');
  };

  const handleNavigate = (view) => {
    setView(view);
  };
  return (
    <div className="min-h-screen flex">
    <Navbar user={user} onLogout={handleLogout} />
    <LeftMenu user={user} onNavigate={handleNavigate} />
    <div className="w-3/4 p-4 ml-auto mt-16">
      {view === 'home' && (
        <div className="flex justify-center items-center">
          <h1 className="text-3xl">Bienvenido Empleado</h1>
        </div>
      )}
      {view === 'gestion-solicitud' && <ListarSolicitudes/>}
    </div>
  </div>
  );
}

export default MenuEmpleados;