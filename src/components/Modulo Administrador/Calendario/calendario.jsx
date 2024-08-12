import React, { useState, useEffect } from "react";
import API_URL from "../../../Config";
import MesView from "./Mesview";
import SemanaView from "./Semanaview";
import AgendaView from "./Agendaview";

const Calendario = () => {
  const [view, setView] = useState("month");
  const [date, setDate] = useState(new Date());
  const [ordenesAprobadas, setOrdenesAprobadas] = useState([]);
  const [id_usuario, setIdUsuario] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setIdUsuario(storedUser.usuario.id_usuario);
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    const fetchOrdenesAprobadas = async () => {
      if (!id_usuario || !token) return;

      try {
        const response = await fetch(
          `${API_URL}/OrdenesMovilizacion/listar-ordenes-aprobadas/${id_usuario}/`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        const data = await response.json();
        const today = new Date().setHours(0, 0, 0, 0);
        const filteredOrders = data.ordenes_aprobadas.filter((orden) => {
          const ordenDate = new Date(orden.fecha_viaje).setHours(0, 0, 0, 0);
          return ordenDate >= today;
        });
        setOrdenesAprobadas(filteredOrders);
      } catch (error) {
        console.error("Error al obtener las órdenes de movilización:", error);
      }
    };

    fetchOrdenesAprobadas();
  }, [id_usuario, token, date]);

  const handlePrev = () => {
    const newDate = new Date(date);
    if (view === "month") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (view === "week") {
      newDate.setDate(newDate.getDate() - 7);
    }
    setDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(date);
    if (view === "month") {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (view === "week") {
      newDate.setDate(newDate.getDate() + 7);
    }
    setDate(newDate);
  };

  const handleToday = () => {
    setDate(new Date());
  };

  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <div>
          <button
            onClick={handlePrev}
            className="bg-gray-200 px-4 py-2 mr-2 rounded"
          >
            Anterior
          </button>
          <button
            onClick={handleToday}
            className="bg-gray-200 px-4 py-2 mr-2 rounded"
          >
            Hoy
          </button>
          <button
            onClick={handleNext}
            className="bg-gray-200 px-4 py-2 rounded"
          >
            Siguiente
          </button>
        </div>
        <div>
          <button
            onClick={() => setView("month")}
            className={`px-4 py-2 mr-2 rounded ${
              view === "month" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Mes
          </button>
          <button
            onClick={() => setView("week")}
            className={`px-4 py-2 mr-2 rounded ${
              view === "week" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Semana
          </button>
          <button
            onClick={() => setView("agenda")}
            className={`px-4 py-2 rounded ${
              view === "agenda" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Agenda
          </button>
        </div>
      </div>
      <div>
        {view === "month" && (
          <MesView date={date} ordenesAprobadas={ordenesAprobadas} />
        )}
        {view === "week" && (
          <SemanaView date={date} ordenesAprobadas={ordenesAprobadas} />
        )}
        {view === "agenda" && (
          <AgendaView ordenesAprobadas={ordenesAprobadas} />
        )}
      </div>
    </div>
  );
};

export default Calendario;
