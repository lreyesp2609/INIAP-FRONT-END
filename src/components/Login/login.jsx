import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { Form, Input, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../Config';
import logo from "../imgs/CONVENIOS-1.jpg";

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('needs_password_change');
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
        const { token, id_usuario, needs_password_change } = data;

        localStorage.setItem('token', token);
        localStorage.setItem('userId', id_usuario);
        localStorage.setItem('needs_password_change', needs_password_change);

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
    <div className="relative flex items-center justify-center min-h-screen bg-green-900">
      <div className="absolute w-0 h-0 border-l-[100vw] sm:border-l-[70vw] md:border-l-[100vw] border-l-transparent border-b-[100vh] sm:border-b-[70vh] md:border-b-[100vh] border-b-green-800 rounded-full"></div>
      <div className="absolute left-0 w-0 h-0 border-l-[95vw] sm:border-l-[65vw] md:border-l-[95vw] border-l-transparent border-b-[95vh] sm:border-b-[65vh] md:border-b-[95vh] border-b-green-700 rounded-full"></div>
      <div className="absolute left-0 w-0 h-0 border-l-[85vw] sm:border-l-[60vw] md:border-l-[85vw] border-l-transparent border-b-[90vh] sm:border-b-[60vh] md:border-b-[90vh] border-b-green-600 rounded-full"></div>
      <div className="absolute left-0 w-0 h-0 border-l-[75vw] sm:border-l-[55vw] md:border-l-[75vw] border-l-transparent border-b-[85vh] sm:border-b-[55vh] md:border-b-[85vh] border-b-green-500 rounded-full"></div>

      <div className="bg-white shadow-lg rounded-lg p-4 sm:p-8 max-w-md w-full z-10 m-4 sm:m-0">
        <div className="mb-4 flex justify-center">
          <div className="flex items-center justify-center">
            <img src={logo} alt="Descripción de la imagen" className="w-24 sm:w-32 md:w-auto" />
          </div>
        </div>

        <Form
          name="loginForm"
          initialValues={{ remember: true }}
          onFinish={handleSubmit}
          className="space-y-10"
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
              className="bg-gray-300 text-black border border-gray-500 rounded py-2 px-4"
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
              className="bg-gray-300 text-black border border-gray-500 rounded py-2 px-4"
            />
          </Form.Item>
          <Form.Item>
            <button
              type="primary"
              htmlType="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 border-b-4 border-green-400 hover:border-green-900 rounded"
            >
              <FontAwesomeIcon icon={faUser} /> Iniciar sesión
            </button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginForm;
