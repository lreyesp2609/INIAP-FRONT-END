import React, { useState, useEffect } from "react";
import API_URL from "../../../Config";

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
        setOrdenesAprobadas(data.ordenes_aprobadas);
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

  const daysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const renderMonthView = () => {
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    const startOfMonth = new Date(year, date.getMonth(), 1);
    const startDay = (startOfMonth.getDay() + 6) % 7;
    const daysInCurrentMonth = daysInMonth(year, date.getMonth());

    const daysOfWeek = ["lun", "mar", "mié", "jue", "vie", "sáb", "dom"];
    const daysArray = [
      ...Array(startDay).fill(null),
      ...Array.from({ length: daysInCurrentMonth }, (_, i) => i + 1),
    ];

    return (
      <div>
        <h2 className="text-center text-xl mb-4">{`${month} ${year}`}</h2>
        <div className="grid grid-cols-7 gap-2 text-center">
          {daysOfWeek.map((day, index) => (
            <div key={index} className="font-bold">
              {day}
            </div>
          ))}
          {daysArray.map((day, index) => {
            const currentDay = new Date(year, date.getMonth(), day);
            const orden = ordenesAprobadas.find(
              (o) =>
                new Date(o.fecha_viaje).toDateString() ===
                currentDay.toDateString()
            );
            return (
              <div key={index} className="border p-2 relative min-w-[2.5rem] sm:min-w-[3rem] lg:min-w-[4rem]">
                {day !== null ? (
                  <div className="relative overflow-visible text-sm">
                    {day}
                    {orden && (
                      <a
                        href="#"
                        className="block mt-2 p-1 rounded bg-yellow-400 border border-yellow-400 text-black overflow-visible whitespace-normal text-xs sm:text-sm lg:text-base"
                      >
                        {orden.secuencial_orden_movilizacion}
                      </a>
                    )}
                  </div>
                ) : (
                  ""
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - ((date.getDay() + 6) % 7));
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    const daysOfWeek = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      daysOfWeek.push(day);
    }
    return (
      <div>
        <h2 className="text-center text-xl mb-4">
          {`${startOfWeek.getDate()} - ${endOfWeek.getDate()} ${endOfWeek.toLocaleString(
            "default",
            { month: "short" }
          )} ${endOfWeek.getFullYear()}`}
        </h2>
        <div className="grid grid-cols-7 gap-2 text-center">
          {daysOfWeek.map((day, i) => {
            const orden = ordenesAprobadas.find(
              (o) =>
                new Date(o.fecha_viaje).toDateString() === day.toDateString()
            );
            return (
              <div key={i} className="border p-2 relative min-w-[2.5rem] sm:min-w-[3rem] lg:min-w-[4rem]">
                {`${day.toLocaleDateString("default", {
                  weekday: "short",
                })} ${day.getDate()}/${day.getMonth() + 1}`}
                {orden && (
                  <a
                    href="#"
                    className="block mt-2 p-1 rounded bg-yellow-400 border border-yellow-400 text-black overflow-visible whitespace-normal text-xs sm:text-sm lg:text-base"
                  >
                    {orden.secuencial_orden_movilizacion}
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
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
        {view === "month" && renderMonthView()}
        {view === "week" && renderWeekView()}
        {view === "agenda" && <div>Agenda View</div>}
      </div>
    </div>
  );
};

export default Calendario;
