import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/Login/login';
import MenuEmpleados from './components/Modulo Empleado/menuempleado';
import MenuAdministrador from './components/Modulo Administrador/menuadministrador';
import PrivateRoute from './components/Login/rutaprivada';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm onLogin={handleLogin} />} />
        <Route path="/menu-empleados" element={
          <PrivateRoute>
            <MenuEmpleados />
          </PrivateRoute>
        } />
        <Route path="/menu-administrador" element={
          <PrivateRoute>
            <MenuAdministrador />
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
};

export default App;
