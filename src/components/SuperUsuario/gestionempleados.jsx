import React, { useState, useEffect } from 'react';

const GestionEmpleados = () => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser.usuario);
    }
  }, []);

  return (
    <div className="flex-grow flex justify-center items-center">
      <h1 className="text-3xl">Hola Super Usuario</h1>
    </div>
  );
};

export default GestionEmpleados;
