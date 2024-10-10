import React, { useState, useRef } from 'react';
import { FiUsers, FiMenu } from 'react-icons/fi';
import { FaFileAlt } from 'react-icons/fa';
import { MdCalendarToday } from 'react-icons/md'; 
import { IoDocumentAttachOutline, IoDocumentText, IoDocumentAttachSharp } from 'react-icons/io5';

const LeftMenu = ({ user, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  if (!user || !user.unidades || user.unidades.length === 0) {
    return null;
  }

  const menuItems = [
    {
      icon: <FiUsers className="w-8 h-8 text-white mx-4" />,
      label: 'Gestión de Empleados',
      onClick: () => onNavigate('gestion-empleados'),
    },
    {
      icon: <IoDocumentAttachOutline className="w-8 h-8 text-white mx-4" />,
      label: 'Órdenes de movilización',
      onClick: () => onNavigate('gestion-movilizaciones'),
    },
    {
      icon: <IoDocumentAttachOutline className="w-8 h-8 text-white mx-4" />,
      label: 'Crear órdenes de movilización',
      onClick: () => onNavigate('gestion-ordenes-solicitud'),
    },
    {
      icon: <IoDocumentText className="w-8 h-8 text-white mx-4" />,
      label: 'Solicitudes de viaje',
      onClick: () => onNavigate('gestion-solicitud'),
    },
    {
      icon: <IoDocumentText className="w-8 h-8 text-white mx-4" />,
      label: 'Crear solicitudes de viaje',
      onClick: () => onNavigate('gestion-solicitud-crear'),
    },
    {
      icon: <IoDocumentAttachSharp className="w-8 h-8 text-white mx-4" />,
      label: 'Crear informes de gastos',
      onClick: () => onNavigate('gestion-informe-crear'),
    },
    {
      icon: <IoDocumentAttachSharp className="w-8 h-8 text-white mx-4" />,
      label: 'Crear justificacion de gastos',
      onClick: () => onNavigate('gestion-gastos'),
    },
    {
      icon: <MdCalendarToday className="w-8 h-8 text-white mx-4" />,
      label: 'Calendario de Órdenes Aprobadas',
      onClick: () => onNavigate('calendario-ordenes-aprobadas'),
    },
    {
      icon: <FaFileAlt className="w-8 h-8 text-white mx-4" />,
      label: 'Reportes',
      onClick: () => onNavigate('reportes'),
    }
  ];

  return (
    <div>
      {/* Mobile view */}
      <div className="md:hidden fixed top-0 left-0 w-full z-50">
        {/* Circle button on the left of the screen */}
        {!isOpen && (
          <button
            onClick={() => setIsOpen(!isOpen)} 
            className="fixed top-40 left-2 z-50 bg-[#169658] p-2 rounded-full focus:outline-none shadow-lg"
          >
            <FiMenu className="w-8 h-8 text-white" />
          </button>
        )}

        {/* Sidebar */}
        <div 
          className={`fixed inset-0 transition-transform duration-300 ease-in-out ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          } z-40 bg-[#169658] w-3/4 h-full`}
        >
          <div className="relative h-full flex flex-col">
            <div 
              className="flex flex-col items-center space-y-6 w-full overflow-y-auto pt-16"
              ref={menuRef}
              style={{
                maxHeight: 'calc(100vh - 4rem)',
                scrollbarWidth: 'thin',
                scrollbarColor: '#0d4b34 transparent'
              }}
            >
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    item.onClick();
                    setIsOpen(false);
                  }}
                  className="flex items-center w-full focus:outline-none hover:bg-[#0d4b34] p-2 rounded transition duration-200 ease-in-out"
                >
                  {item.icon}
                  <span className="text-white text-sm">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dark overlay to close sidebar */}
        {isOpen && (
          <div 
            className="fixed inset-0 bg-black opacity-50 z-30" 
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>

      {/* Desktop view */}
      <div className="hidden md:flex md:flex-col md:w-1/6 p-4 text-white justify-start items-center fixed left-0 top-0 h-full z-40 bg-[#169658]">
        <div 
          className="flex flex-col items-center space-y-6 mt-20 w-full overflow-y-auto"
          style={{
            maxHeight: 'calc(100vh - 6rem)',
            scrollbarWidth: 'thin',
            scrollbarColor: '#0d4b34 transparent'
          }}
        >
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              className="flex items-center w-full focus:outline-none hover:bg-[#0d4b34] p-2 rounded transition duration-200 ease-in-out"
            >
              {item.icon}
              <span className="text-white text-sm hidden md:inline">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeftMenu;