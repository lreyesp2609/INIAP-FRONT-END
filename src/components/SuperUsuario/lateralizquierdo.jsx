import React from 'react';
import { FaUsers } from 'react-icons/fa';

const LeftMenu = ({ user, onNavigate }) => {
  if (!user || !user.unidades || user.unidades.length === 0) {
    return null;
  }

  return (
    <div className="bg-[#169658] text-white flex flex-col justify-between items-center fixed left-0 top-0 h-full z-40">
      <div className="p-4 flex flex-col items-center h-full">
        <div className="mb-4">
          <FaUsers className="text-4xl" />
        </div>
        <div className="flex flex-col items-center space-y-4 w-full">
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate('gestion-empleados')}>
            <span className="text-lg">Gestión de Empleados</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftMenu;
