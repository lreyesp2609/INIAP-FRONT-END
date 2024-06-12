import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from './components/Login/login';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
    // Aquí podrías almacenar el token en localStorage si lo necesitas
    // localStorage.setItem("token", userData.token);
  };

  const renderContent = () => {
    // Aquí podrías verificar si hay un token almacenado en localStorage
    // const storedToken = localStorage.getItem("token");
    // if (user || storedToken) {
    //   return <AdminMenu />;
    // }
    return <LoginForm onLogin={handleLogin} />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={renderContent()} />
      </Routes>
    </Router>
  );
}

export default App;