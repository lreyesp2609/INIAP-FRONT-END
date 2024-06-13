import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import imgempleados from '../SuperUsuario/res/empleados.png';
import Navbar from '../Login/navbar';

const MenuSuperUsuario = () => {
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

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    }
  }, [navigate]);

  if (!user || !user.unidades || user.unidades.length === 0) {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const navigateToGestionEmpleados = () => {
    navigate('/gestion-empleados'); // Navega a la ruta de GestionEmpleados
  };

  return (
    <div className="min-h-screen flex">
      <Navbar user={user} onLogout={handleLogout} />
      <div className="w-1/4 p-2 bg-blue-600 text-white flex flex-col justify-between items-center fixed left-0 top-0 h-full z-40">
        <div className="w-full p-2 bg-blue-600 text-white flex justify-center items-center flex-col md:fixed md:left-0 md:h-full md:z-40 md:w-1/4">
          <h2 className="text-sm font-bold mb-2">Unidad:</h2>
          <p className="text-sm">
            {user.unidades[0].nombre_unidad || '-'}
          </p>
          <h2 className="text-sm font-bold mt-4 mb-2">Cargo:</h2>
          <p className="text-sm">
            {user.unidades[0].cargos[0]?.cargo || '-'}
          </p>
        </div>
      </div>

      <div className="w-3/4 p-4 ml-auto mt-16">
        <div className="flex flex-wrap justify-center">
          <div className="w-full md:w-1/3 p-4 mb-4">
            <div className="bg-white rounded-lg shadow-lg p-4 text-center cursor-pointer" onClick={navigateToGestionEmpleados}>
              <div className="mb-4">
                <img
                  src={imgempleados}
                  alt="Gestión de Empleados"
                  className="w-16 h-16 mx-auto"
                />
              </div>
              <h1 className="text-xl font-bold mb-4">
                Gestión de Empleados
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuSuperUsuario;
