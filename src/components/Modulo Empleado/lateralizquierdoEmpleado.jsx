import React, { useState } from 'react';
import { FiUsers, FiMenu, FiTruck, FiList, FiMap } from 'react-icons/fi';
import { MdEmojiTransportation } from "react-icons/md";
import { IoDocumentText, IoCash ,IoDocumentAttachOutline,IoDocumentTextSharp,IoDocumentAttachSharp  } from "react-icons/io5";

const LeftMenu = ({ user, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!user || !user.unidades || user.unidades.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="md:hidden fixed top-0 left-0 w-full z-50 bg-[#169658]">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Botón de menú */}
          <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="fixed top-40 left-2 z-5 bg-green-800 p-2 rounded-full focus:outline-none "
            >
              <FiMenu className="w-8 h-8 text-white" />
            </button>
        </div>
        <div className={`transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out fixed top-0 left-0 w-3/4 h-full bg-green-800 z-40 overflow-y-auto pt-16`}>
          <div className="flex flex-col items-center space-y-6 w-full">
            <button 
              onClick={() => {
                onNavigate('gestion-empleados');
                setIsOpen(false);
              }} 
              className="flex items-center w-full focus:outline-none hover:bg-[#0d4b34] p-2 rounded transition duration-200 ease-in-out"
            >
              <MdEmojiTransportation  className="w-8 h-8 text-white mx-4" />
              <span className="text-white text-sm">Órdenes de movilización</span>
            </button>
            <button 
              onClick={() => {
                onNavigate('gestion-solicitud');
                setIsOpen(false);
              }} 
              className="flex items-center w-full focus:outline-none hover:bg-[#0d4b34] p-2 rounded transition duration-200 ease-in-out"
            >
              <IoDocumentText className="w-8 h-8 text-white mx-4" />
              <span className="text-white text-sm">Solicitudes de viaje</span>
            </button>
            <button 
              onClick={() => {
                onNavigate('gestion-informe');
                setIsOpen(false);
              }} 
              className="flex items-center w-full focus:outline-none hover:bg-[#0d4b34] p-2 rounded transition duration-200 ease-in-out"
            >
              <IoDocumentAttachSharp className="w-8 h-8 text-white mx-4" />
              <span className="text-white text-sm">Informes de Servicios</span>
            </button>
            <button 
              onClick={() => {
                onNavigate('gestion-gastos');
                setIsOpen(false);
              }} 
              className="flex items-center w-full focus:outline-none hover:bg-[#0d4b34] p-2 rounded transition duration-200 ease-in-out"
            >
              <IoCash className="w-8 h-8 text-white mx-4" />
              <span className="text-white text-sm">Justificacion de Gastos</span>
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

      <div className="hidden md:flex md:flex-col md:w-1/6 p-4 text-white justify-start items-center fixed left-0 top-0 h-full z-40 bg-green-800">
        <div className="flex flex-col items-center space-y-6 mt-20 w-full">
          <button 
            onClick={() => onNavigate('gestion-empleados')} 
            className="flex items-center w-full focus:outline-none hover:bg-[#0d4b34] p-2 rounded transition duration-200 ease-in-out"
          >
            <IoDocumentAttachOutline   className="w-10 h-10 text-white mx-6" />
            <span className="text-white text-sm hidden md:inline ">Órdenes de movilización</span>
          </button>
          <button 
            onClick={() => onNavigate('gestion-solicitud')} 
            className="flex items-center w-full focus:outline-none hover:bg-[#0d4b34] p-2 rounded transition duration-200 ease-in-out"
          >
            <IoDocumentText className="w-10 h-10 text-white mx-6" />
            <span className="text-white text-sm hidden md:inline">Solicitudes de viaje</span>
          </button>
          <button 
            onClick={() => onNavigate('gestion-informe')} 
            className="flex items-center w-full focus:outline-none hover:bg-[#0d4b34] p-2 rounded transition duration-200 ease-in-out"
          >
            <IoDocumentAttachSharp className="w-10 h-10 text-white mx-6" />
            <span className="text-white text-sm hidden md:inline">Informes de Servicios</span>
          </button>
          <button 
            onClick={() => onNavigate('gestion-gastos')} 
            className="flex items-center w-full focus:outline-none hover:bg-[#0d4b34] p-2 rounded transition duration-200 ease-in-out"
          >
            <IoCash className="w-10 h-10 text-white mx-6" />
            <span className="text-white text-sm hidden md:inline">Justificacion de Gastos</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeftMenu;
