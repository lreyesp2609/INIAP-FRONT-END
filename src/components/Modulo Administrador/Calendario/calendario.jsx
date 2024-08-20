import React, { useState, useEffect } from "react";
import API_URL from "../../../Config";
import CalendarControls from "./calendarcontrols";
import CalendarView from "./calendarview";
import DetalleOrden from "./detalleorden";
import SolicitudListView from "./solicitudlistview";
import AgendaView from "./Agendaview";

const Calendario = () => {
  const [view, setView] = useState("month");
  const [date, setDate] = useState(new Date());
  const [ordenesAprobadas, setOrdenesAprobadas] = useState([]);
  const [id_usuario, setIdUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [selectedOrden, setSelectedOrden] = useState(null);
  const [showCalendar, setShowCalendar] = useState(true);
  const [showAgenda, setShowAgenda] = useState(false);
  const [showSolicitudList, setShowSolicitudList] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [ordersForSelectedDate, setOrdersForSelectedDate] = useState([]);
  const [prevView, setPrevView] = useState(null);

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
      if (!id_usuario || !token) {
        console.log("No user ID or token, skipping API call.");
        return;
      }

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

  const handleOrdenClick = (idOrden) => {
    setSelectedOrden(idOrden);
    setPrevView(showSolicitudList ? "solicitudList" : "calendar");
    setShowSolicitudList(false);
    setShowAgenda(false);
    setShowCalendar(false);
  };

  const handleShowSolicitudList = (date) => {
    const selectedDateString = new Date(date).toISOString().split("T")[0];
    const ordersForDate = ordenesAprobadas.filter((orden) => {
      const orderDateString = new Date(orden.fecha_viaje)
        .toISOString()
        .split("T")[0];
      return orderDateString === selectedDateString;
    });
    setOrdersForSelectedDate(ordersForDate);
    setPrevView("calendar");
    setShowSolicitudList(true);
    setShowAgenda(false);
    setShowCalendar(false);
  };

  const handleShowAgenda = (date) => {
    setSelectedDate(date);
    setPrevView("calendar");
    setShowAgenda(true);
    setShowCalendar(false);
  };

  const closeDetalleOrden = () => {
    setSelectedOrden(null);
    if (prevView === "solicitudList") {
      setShowSolicitudList(true);
      setShowAgenda(false);
      setShowCalendar(false);
    } else if (prevView === "agenda") {
      setShowAgenda(true);
      setShowSolicitudList(false);
      setShowCalendar(false);
    } else {
      setShowCalendar(true);
      setShowSolicitudList(false);
      setShowAgenda(false);
    }
    setPrevView(null);
  };

  const closeAgendaView = () => {
    setShowAgenda(false);
    setShowCalendar(true);
  };

  const closeSolicitudListView = () => {
    setShowSolicitudList(false);
    setShowCalendar(true);
  };

  return (
    <div className="p-4">
      {showCalendar && !showAgenda && !showSolicitudList && !selectedOrden && (
        <>
          <CalendarControls
            handlePrev={handlePrev}
            handleNext={handleNext}
            handleToday={handleToday}
            view={view}
            setView={setView}
          />
          <CalendarView
            view={view}
            date={date}
            ordenesAprobadas={ordenesAprobadas}
            onOrdenClick={handleOrdenClick}
            onShowAgenda={handleShowAgenda}
            onShowSolicitudList={handleShowSolicitudList}
          />
        </>
      )}
      {selectedOrden && (
        <DetalleOrden
          idUsuario={id_usuario}
          idOrden={selectedOrden}
          token={token}
          onClose={closeDetalleOrden}
        />
      )}
      {showAgenda && selectedDate && id_usuario && token && (
        <AgendaView
          ordenesAprobadas={ordenesAprobadas.filter(
            (o) =>
              new Date(o.fecha_viaje).toDateString() ===
              new Date(selectedDate).toDateString()
          )}
          idUsuario={id_usuario}
          token={token}
          onOrdenClick={handleOrdenClick}
          onClose={closeAgendaView}
        />
      )}
      {showSolicitudList &&
        ordersForSelectedDate.length > 0 &&
        !selectedOrden && (
          <SolicitudListView
            ordenes={ordersForSelectedDate}
            onClose={closeSolicitudListView}
            onOrdenSelect={handleOrdenClick}
          />
        )}
    </div>
  );
};

export default Calendario;
