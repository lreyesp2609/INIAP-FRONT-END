import React, { useState, useRef } from 'react';
import { FiUsers, FiMenu, FiTruck, FiList } from 'react-icons/fi';
import { FaBuilding, FaClipboardList,FaUserTie, FaWarehouse  } from 'react-icons/fa';
import { IoDocumentAttachOutline } from 'react-icons/io5';

const LeftMenu = ({ user, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

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
        <div
          className={`transform ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out fixed top-0 left-0 w-3/4 h-full bg-[#169658] z-40 pt-16`}
        >
          <div className="relative h-full flex flex-col">
            <div
              className="flex flex-col items-center space-y-6 w-full overflow-y-auto pt-10"
              ref={menuRef}
            >
              <button
                onClick={() => {
                  onNavigate("gestion-empleados");
                  setIsOpen(false);
                }}
                className="flex items-center w-full focus:outline-none hover:bg-[#0d4b34] p-2 rounded transition duration-200 ease-in-out text-xs"
              >
                <FiUsers className="w-6 h-6 text-white mx-3" />
                <span className="text-white text-xs">Gestión de Empleados</span>
              </button>
              <button
                onClick={() => {
                  onNavigate("gestion-vehiculos");
                  setIsOpen(false);
                }}
                className="flex items-center w-full focus:outline-none hover:bg-[#0d4b34] p-2 rounded transition duration-200 ease-in-out text-xs"
              >
                <FiTruck className="w-6 h-6 text-white mx-3" />
                <span className="text-white text-xs">Gestión de Vehículos</span>
              </button>
              <button
                onClick={() => {
                  onNavigate("gestion-categorias-bienes");
                  setIsOpen(false);
                }}
                className="flex items-center w-full focus:outline-none hover:bg-[#0d4b34] p-2 rounded transition duration-200 ease-in-out text-xs"
              >
                <FiList className="w-6 h-6 text-white mx-3" />
                <span className="text-white text-xs">
                  Gestión de Categorías de Bienes
                </span>
              </button>
              <button
                onClick={() => {
                  onNavigate("gestion-estaciones");
                  setIsOpen(false);
                }}
                className="flex items-center w-full focus:outline-none hover:bg-[#0d4b34] p-2 rounded transition duration-200 ease-in-out text-xs"
              >
                <FaBuilding className="w-6 h-6 text-white mx-3" />
                <span className="text-white text-xs">
                  Gestión de Estaciones
                </span>
              </button>
              <button
                onClick={() => {
                  onNavigate("gestion-unidades");
                  setIsOpen(false);
                }}
                className="flex items-center w-full focus:outline-none hover:bg-[#0d4b34] p-2 rounded transition duration-200 ease-in-out text-xs"
              >
                <FaWarehouse className="w-6 h-6 text-white mx-3" />
                <span className="text-white text-xs">Gestión de Unidades</span>
              </button>
              <button
                onClick={() => {
                  onNavigate("gestion-cargos");
                  setIsOpen(false);
                }}
                className="flex items-center w-full focus:outline-none hover:bg-[#0d4b34] p-2 rounded transition duration-200 ease-in-out text-xs"
              >
                <FaUserTie  className="w-6 h-6 text-white mx-3" />
                <span className="text-white text-xs">Gestión de Cargos</span>
              </button>
              <button
                onClick={() => {
                  onNavigate("gestion-licencias");
                  setIsOpen(false);
                }}
                className="flex items-center w-full focus:outline-none hover:bg-[#0d4b34] p-2 rounded transition duration-200 ease-in-out text-xs"
              >
                <FaClipboardList className="w-6 h-6 text-white mx-3" />
                <span className="text-white text-xs">Gestión de Licencias</span>
              </button>
              <button
                onClick={() => {
                  onNavigate("gestion-motivos-ordenes");
                  setIsOpen(false);
                }}
                className="flex items-center w-full focus:outline-none hover:bg-[#0d4b34] p-2 rounded transition duration-200 ease-in-out text-xs"
              >
                <FiList className="w-6 h-6 text-white mx-3" />
                <span className="text-white text-xs">
                  Gestión de Motivos para las Órdenes
                </span>
              </button>
              <button
                onClick={() => {
                  onNavigate("gestion-provincias");
                  setIsOpen(false);
                }}
                className="flex items-center w-full focus:outline-none hover:bg-[#0d4b34] p-2 rounded transition duration-200 ease-in-out text-xs"
              >
                <FiList className="w-6 h-6 text-white mx-3" />
                <span className="text-white text-xs">
                  Gestión de Provincias
                </span>
              </button>
              <button
                onClick={() => {
                  onNavigate("gestion-encabezados");
                  setIsOpen(false);
                }}
                className="flex items-center w-full focus:outline-none hover:bg-[#0d4b34] p-2 rounded transition duration-200 ease-in-out text-xs"
              >
                <FiList className="w-6 h-6 text-white mx-3" />
                <span className="text-white text-xs">
                  Gestión de Encabezados
                </span>
              </button>
              <button
                onClick={() => {
                  onNavigate("gestion-movilizaciones");
                  setIsOpen(false);
                }}
                className="flex items-center w-full focus:outline-none hover:bg-[#0d4b34] p-2 rounded transition duration-200 ease-in-out text-xs"
              >
                <IoDocumentAttachOutline className="w-6 h-6 text-white mx-3" />
                <span className="text-white text-xs">
                  Gestión de Movilizaciones
                </span>
              </button>
            </div>
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
        <div
          className="flex flex-col items-center space-y-6 mt-20 w-full overflow-y-auto max-h-full"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#0d4b34 transparent",
          }}
        >
          <button
            onClick={() => onNavigate("gestion-empleados")}
            className="flex items-center w-full focus:outline-none hover:bg-[#0d4b34] p-2 rounded transition duration-200 ease-in-out text-xs"
          >
            <FiUsers className="w-6 h-6 text-white mx-3" />
            <span className="text-white text-xs hidden md:inline">
              Gestión de Empleados
            </span>
          </button>
          <button
            onClick={() => onNavigate("gestion-vehiculos")}
            className="flex items-center w-full focus:outline-none hover:bg-[#0d4b34] p-2 rounded transition duration-200 ease-in-out text-xs"
          >
            <FiTruck className="w-6 h-6 text-white mx-3" />
            <span className="text-white text-xs hidden md:inline">
              Gestión de Vehículos
            </span>
          </button>
          <button
            onClick={() => onNavigate("gestion-categorias-bienes")}
            className="flex items-center w-full focus:outline-none hover:bg-[#0d4b34] p-2 rounded transition duration-200 ease-in-out text-xs"
          >
            <FiList className="w-6 h-6 text-white mx-3" />
            <span className="text-white text-xs hidden md:inline">
              Gestión de Categorías de Bienes
            </span>
          </button>
          <button
            onClick={() => onNavigate("gestion-estaciones")}
            className="flex items-center w-full focus:outline-none hover:bg-[#0d4b34] p-2 rounded transition duration-200 ease-in-out text-xs"
          >
            <FaBuilding className="w-6 h-6 text-white mx-3" />
            <span className="text-white text-xs hidden md:inline">
              Gestión de Estaciones
            </span>
          </button>
          <button
            onClick={() => onNavigate("gestion-unidades")}
            className="flex items-center w-full focus:outline-none hover:bg-[#0d4b34] p-2 rounded transition duration-200 ease-in-out text-xs"
          >
            <FaWarehouse className="w-6 h-6 text-white mx-3" />
            <span className="text-white text-xs hidden md:inline">Gestió de Unidades</span>
          </button>
          <button
            onClick={() => onNavigate("gestion-cargos")}
            className="flex items-center w-full focus:outline-none hover:bg-[#0d4b34] p-2 rounded transition duration-200 ease-in-out text-xs"
          >
            <FaUserTie className="w-6 h-6 text-white mx-3" />
            <span className="text-white text-xs hidden md:inline">Gestión de Cargos</span>
          </button>
          <button
            onClick={() => onNavigate("gestion-licencias")}
            className="flex items-center w-full focus:outline-none hover:bg-[#0d4b34] p-2 rounded transition duration-200 ease-in-out text-xs"
          >
            <FaClipboardList className="w-6 h-6 text-white mx-3" />
            <span className="text-white text-xs hidden md:inline">
              Gestión de Licencias
            </span>
          </button>
          <button
            onClick={() => onNavigate("gestion-motivos-ordenes")}
            className="flex items-center w-full focus:outline-none hover:bg-[#0d4b34] p-2 rounded transition duration-200 ease-in-out text-xs"
          >
            <FiList className="w-6 h-6 text-white mx-3" />
            <span className="text-white text-xs hidden md:inline">
              Gestión de Motivos para las Órdenes
            </span>
          </button>
          <button
            onClick={() => onNavigate("gestion-provincias")}
            className="flex items-center w-full focus:outline-none hover:bg-[#0d4b34] p-2 rounded transition duration-200 ease-in-out text-xs"
          >
            <FiList className="w-6 h-6 text-white mx-3" />
            <span className="text-white text-xs hidden md:inline">
              Gestión de Provincias
            </span>
          </button>
          <button
            onClick={() => onNavigate("gestion-encabezados")}
            className="flex items-center w-full focus:outline-none hover:bg-[#0d4b34] p-2 rounded transition duration-200 ease-in-out text-xs"
          >
            <FiList className="w-6 h-6 text-white mx-3" />
            <span className="text-white text-xs hidden md:inline">
              Gestión de Encabezados
            </span>
          </button>
          <button
            onClick={() => onNavigate("gestion-movilizaciones")}
            className="flex items-center w-full focus:outline-none hover:bg-[#0d4b34] p-2 rounded transition duration-200 ease-in-out text-xs"
          >
            <IoDocumentAttachOutline className="w-6 h-6 text-white mx-3" />
            <span className="text-white text-xs hidden md:inline">
              Gestión de Movilizaciones
            </span>
          </button>
          <button
            onClick={() => {
              onNavigate("gestion-bancos");
              setIsOpen(false);
            }}
            className="flex items-center w-full focus:outline-none hover:bg-[#0d4b34] p-2 rounded transition duration-200 ease-in-out text-xs"
          >
            <FaBuilding className="w-6 h-6 text-white mx-3" />
            <span className="text-white text-xs">Gestión de Bancos</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeftMenu;
