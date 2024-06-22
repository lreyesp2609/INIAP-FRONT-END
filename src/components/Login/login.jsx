import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import { Form, Input, Button, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../Config';
import logo from "../imgs/CONVENIOS-1.jpg"


const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append('usuario', values.username);
      formData.append('contrasenia', values.password);

      const response = await fetch(`${API_URL}/Login/iniciar_sesion/`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log('Respuesta del servidor:', data);

      if (response.ok) {
        const { token, id_usuario } = data;
        localStorage.setItem('token', token);

        await obtenerUsuario(id_usuario, token);
      } else {
        console.error('Error en inicio de sesión:', data.mensaje);
        notification.error({
          message: 'Error en inicio de sesión',
          description: data.mensaje,
        });
      }
    } catch (error) {
      console.error('Error en la solicitud de inicio de sesión:', error);
    }
  };

  const obtenerUsuario = async (idUsuario, token) => {
    try {
      const response = await fetch(`${API_URL}/Login/obtener_usuario/${idUsuario}/`, {
        method: 'GET',
        headers: {
          Authorization: `${token}`,
        },
      });

      const userData = await response.json();
      console.log('Datos del usuario:', userData);

      if (response.ok) {
        onLogin(userData);
        localStorage.setItem('user', JSON.stringify(userData));

        if (userData.usuario.rol === 'Empleado') {
          navigate('/menu-empleados');
        } else if (userData.usuario.rol === 'Administrador') {
          navigate('/menu-administrador');
        } else if (userData.usuario.rol === 'SuperUsuario') {
          navigate('/menu-superusuario');
        }
      } else {
        console.error('Error al obtener usuario:', userData.mensaje);
      }
    } catch (error) {
      console.error('Error en la solicitud de obtener usuario:', error);
    }
  };

  return (
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-screen ">
  <div className="flex items-center justify-center">
    <img src={logo} alt="Descripción de la imagen" className="w-32 md:w-auto" />
  </div>
  <div className="flex items-center justify-center bg-gray-500">
    <div className=" w-full max-w-md p-4 ">
      <Form
        name="loginForm"
        initialValues={{ remember: true }}
        onFinish={handleSubmit}
        className="space-y-6"
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: 'Por favor, ingresa tu usuario' }]}
        >
          <Input
            id="username"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Usuario"

          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Por favor, ingresa tu contraseña' }]}
        >
          <Input.Password
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
          />
        </Form.Item>
        <Form.Item>
          <button
            type="primary"
            htmlType="submit"
            class=" w-full bg-green-500 hover:bg-green-400 
            text-white font-bold py-2 px-4 border-b-4 border-green-700
            hover:border-green-500 rounded"
          >
            <FontAwesomeIcon icon={faUser} /> Iniciar sesión
          </button>
        </Form.Item>
        
      </Form>
    </div>
  </div>
</div>


  


  );
};

export default LoginForm;
