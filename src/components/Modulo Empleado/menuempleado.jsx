import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LeftMenu from './lateralizquierdoEmpleado';

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
    <div>
    
      <LeftMenu user={user} onNavigate={handleNavigate} />

    </div>
  );
}

export default MenuEmpleados;