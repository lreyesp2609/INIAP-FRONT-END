import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/Login/login';
import MenuEmpleados from './components/Modulo Empleado/menuempleado';
import PrivateRoute from './components/Login/rutaprivada';

const App = () => {
  const [user, setUser] = useState(null);

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
      </Routes>
    </Router>
  );
};

export default App;