import React, { useState } from 'react';
import { FiUsers, FiMenu, FiTruck, FiList } from 'react-icons/fi';
import { FaBuilding, FaClipboardList } from 'react-icons/fa';

const LeftMenu = ({ user, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!user || !user.unidades || user.unidades.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="md:hidden fixed top-0 left-0 w-full z-50 bg-[#169658]">
        <div className="flex items-center justify-between px-4 py-3">
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="fixed top-40 left-2 z-5 bg-[#169658] p-2 rounded-full focus:outline-none"
          >
            <FiMenu className="w-8 h-8 text-white" />
          </button>
        </div>
        <div className={`transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out fixed top-0 left-0 w-3/4 h-full bg-[#169658] z-40 overflow-y-auto pt-16`}>
          <div className="flex flex-col items-center space-y-6 w-full">
            <button 
              onClick={() => {
                onNavigate('gestion-empleados');
                setIsOpen(false);
              }} 
              className="flex items-center w-full focus:outline-none hover:bg-[#0d4b34] p-2 rounded transition duration-200 ease-in-out"
            >
              <FiUsers className="w-8 h-8 text-white mx-4" />
              <span className="text-white text-sm">Gestión de Empleados</span>
            </button>
            <button 
              onClick={() => {
                onNavigate('gestion-vehiculos');
                setIsOpen(false);
              }} 
              className="flex items-center w-full focus:outline-none hover:bg-[#0d4b34] p-2 rounded transition duration-200 ease-in-out"
            >
              <FiTruck className="w-8 h-8 text-white mx-4" />
              <span className="text-white text-sm">Gestión de Vehículos</span>
            </button>
            <button 
              onClick={() => {
                onNavigate('gestion-categorias-bienes');
                setIsOpen(false);
              }} 
              className="flex items-center w-full focus:outline-none hover:bg-[#0d4b34] p-2 rounded transition duration-200 ease-in-out"
            >
              <FiList className="w-8 h-8 text-white mx-4" />
              <span className="text-white text-sm">Gestión de Categorías de Bienes</span>
            </button>
            <button 
              onClick={() => {
                onNavigate('gestion-estaciones');
                setIsOpen(false);
              }} 
              className="flex items-center w-full focus:outline-none hover:bg-[#0d4b34] p-2 rounded transition duration-200 ease-in-out"
            >
              <FaBuilding className="w-8 h-8 text-white mx-4" />
              <span className="text-white text-sm">Gestión de Estaciones</span>
            </button>
            <button 
              onClick={() => {
                onNavigate('gestion-licencias');
                setIsOpen(false);
              }} 
              className="flex items-center w-full focus:outline-none hover:bg-[#0d4b34] p-2 rounded transition duration-200 ease-in-out"
            >
              <FaClipboardList className="w-8 h-8 text-white mx-4" />
              <span className="text-white text-sm">Gestión de Licencias</span>
            </button>
            <button 
              onClick={() => {
                onNavigate('gestion-motivos-ordenes');
                setIsOpen(false);
              }} 
              className="flex items-center w-full focus:outline-none hover:bg-[#0d4b34] p-2 rounded transition duration-200 ease-in-out"
            >
              <FiList className="w-8 h-8 text-white mx-4" />
              <span className="text-white text-sm">Gestión de Motivos para las Órdenes</span>
            </button>
          </div>
        </div>

        {isOpen && (
          <div 
            className="fixed inset-0 bg-black opacity-50 z-30" 
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>

      <div className="hidden md:flex md:flex-col md:w-1/6 p-4 text-white justify-start items-center fixed left-0 top-0 h-full z-40 bg-[#169658]">
        <div className="flex flex-col items-center space-y-6 mt-20 w-full">
          <button 
            onClick={() => onNavigate('gestion-empleados')} 
            className="flex items-center w-full focus:outline-none hover:bg-[#0d4b34] p-2 rounded transition duration-200 ease-in-out"
          >
            <FiUsers className="w-8 h-8 text-white mx-4" />
            <span className="text-white text-sm hidden md:inline">Gestión de Empleados</span>
          </button>
          <button 
            onClick={() => onNavigate('gestion-vehiculos')} 
            className="flex items-center w-full focus:outline-none hover:bg-[#0d4b34] p-2 rounded transition duration-200 ease-in-out"
          >
            <FiTruck className="w-8 h-8 text-white mx-4" />
            <span className="text-white text-sm hidden md:inline">Gestión de Vehículos</span>
          </button>
          <button 
            onClick={() => onNavigate('gestion-categorias-bienes')} 
            className="flex items-center w-full focus:outline-none hover:bg-[#0d4b34] p-2 rounded transition duration-200 ease-in-out"
          >
            <FiList className="w-8 h-8 text-white mx-4" />
            <span className="text-white text-sm hidden md:inline">Gestión de Categorías de Bienes</span>
          </button>
          <button 
            onClick={() => onNavigate('gestion-estaciones')} 
            className="flex items-center w-full focus:outline-none hover:bg-[#0d4b34] p-2 rounded transition duration-200 ease-in-out"
          >
            <FaBuilding className="w-8 h-8 text-white mx-4" />
            <span className="text-white text-sm hidden md:inline">Gestión de Estaciones</span>
          </button>
          <button 
            onClick={() => onNavigate('gestion-licencias')} 
            className="flex items-center w-full focus:outline-none hover:bg-[#0d4b34] p-2 rounded transition duration-200 ease-in-out"
          >
            <FaClipboardList className="w-8 h-8 text-white mx-4" />
            <span className="text-white text-sm hidden md:inline">Gestión de Licencias</span>
          </button>
          <button 
            onClick={() => onNavigate('gestion-motivos-ordenes')} 
            className="flex items-center w-full focus:outline-none hover:bg-[#0d4b34] p-2 rounded transition duration-200 ease-in-out"
          >
            <FiList className="w-8 h-8 text-white mx-4" />
            <span className="text-white text-sm hidden md:inline">Gestión de Motivos para las Órdenes</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeftMenu;
