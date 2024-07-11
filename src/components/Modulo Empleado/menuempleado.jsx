import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LeftMenu from './lateralizquierdoEmpleado';
import ListarSolicitudes from './ListaSolicitude';
import ListarMovilizacion from './Ordenes de Movilizacion/ListarMovilizacion';
import Navbar from '../Login/navbar';
import ChangePasswordModal from '../Login/changepasswordmodal';  // Asegúrate de importar el modal
import API_URL from '../../Config';
import { notification } from 'antd';

const MenuEmpleados = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [view, setView] = useState('home');
  const [isPasswordChangeModalVisible, setIsPasswordChangeModalVisible] = useState(false);
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const storedToken = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId');  // Obtén el ID del usuario de localStorage
    const needsPasswordChange = localStorage.getItem('needs_password_change') === 'true';

    if (storedUser) {
      setUser(storedUser.usuario);
      setUserId(storedUserId);  // Usa el ID del usuario desde localStorage
    } else {
      navigate('/');
    }

    if (storedToken) {
      setToken(storedToken);
    } else {
      navigate('/');
    }

    if (needsPasswordChange) {
      setIsPasswordChangeModalVisible(true);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('needs_password_change');
    localStorage.removeItem('userId');  // Asegúrate de eliminar el ID del usuario también
    navigate('/');
  };

  const handleNavigate = (view) => {
    setView(view);
  };

  const handlePasswordChange = async (newPassword) => {
    console.log('userId:', userId);  // Verifica que userId no sea undefined
    console.log('token:', token);    // Verifica que token sea válido

    try {
      const formData = new FormData();
      formData.append('nueva_contrasenia', newPassword);

      const response = await fetch(`${API_URL}/Login/cambiar-contrasenia/${userId}/`, {
        method: 'POST',
        headers: {
          Authorization: `${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        notification.success({
          message: 'Contraseña cambiada exitosamente',
        });
        setIsPasswordChangeModalVisible(false);
        localStorage.removeItem('needs_password_change');
      } else {
        notification.error({
          message: 'Error al cambiar la contraseña',
          description: data.error,
        });
      }
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);
      notification.error({
        message: 'Error al cambiar la contraseña',
        description: error.message,
      });
    }
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
        {view === 'gestion-solicitud' && <ListarSolicitudes />}
        {view === 'gestion-empleados' && <ListarMovilizacion />}
      </div>
      <ChangePasswordModal
        visible={isPasswordChangeModalVisible}
        onChangePassword={handlePasswordChange}
        onCancel={() => setIsPasswordChangeModalVisible(false)}
      />
    </div>
  );
};

export default MenuEmpleados;
