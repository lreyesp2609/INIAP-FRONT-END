import React, { useState, useEffect } from "react";
import API_URL from "../../../Config";
import CalendarControls from "./calendarcontrols";
import CalendarView from "./calendarview";
import DetalleOrden from "./detalleorden";
import AgendaView from "./Agendaview";
import MostrarSolicitudAdministrador from "./MostrarSolicitudDetalleAdmin";

const Calendario = () => {
  const [view, setView] = useState("month");
  const [date, setDate] = useState(new Date());
  const [ordenesAprobadas, setOrdenesAprobadas] = useState([]);
  const [id_usuario, setIdUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [selectedOrden, setSelectedOrden] = useState(null);
  const [showCalendar, setShowCalendar] = useState(true);
  const [showAgenda, setShowAgenda] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [prevView, setPrevView] = useState(null);
  const [solicitudesAceptadas, setSolicitudesAceptadas] = useState([]);
  const [idSolicitud, setIdSolicitud] = useState(null);

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
        const filteredOrders = data.ordenes_aprobadas.filter((orden) => {
          const ordenDate = new Date(orden.fecha_hora_emision).setHours(
            0,
            0,
            0,
            0
          );
          return true;
        });
        setOrdenesAprobadas(filteredOrders);
      } catch (error) {
        console.error("Error al obtener las órdenes de movilización:", error);
      }
    };

    const fetchSolicitudesAceptadas = async () => {
      if (!id_usuario || !token) {
        console.log("No user ID or token, skipping API call.");
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/Informes/listar-solicitudes-aceptadas-admin/`
        );
        const data = await response.json();
        const filteredSolicitudes = data.solicitudes.filter((solicitud) => {
          const llegadaDate = new Date(solicitud["Fecha Solicitud"]).setHours(
            0,
            0,
            0,
            0
          );
          return true;
        });
        setSolicitudesAceptadas(filteredSolicitudes);
      } catch (error) {
        console.error("Error al obtener las solicitudes aceptadas:", error);
      }
    };

    fetchSolicitudesAceptadas();
    if (id_usuario && token) {
      fetchOrdenesAprobadas();
    }
  }, [id_usuario, token]);

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
    setPrevView(showAgenda ? "agenda" : "calendar");
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
    if (prevView === "agenda") {
      setShowAgenda(true);
      setShowCalendar(false);
    } else {
      setShowCalendar(true);
      setShowAgenda(false);
    }
    setPrevView(null);
  };

  const closeAgendaView = () => {
    setShowAgenda(false);
    setShowCalendar(true);
  };

  const handleShowSolicitud = (id) => {
    setIdSolicitud(id);
    setShowCalendar(false);
    setShowAgenda(false);
  };

  const handleCloseSolicitud = () => {
    setIdSolicitud(null);
    setShowCalendar(true);
  };

  return (
    <div className="p-4">
      {showCalendar && !showAgenda && !selectedOrden && (
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
            solicitudesAceptadas={solicitudesAceptadas}
            onOrdenClick={handleOrdenClick}
            onShowAgenda={handleShowAgenda}
            handleShowSolicitud={handleShowSolicitud}
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
      {idSolicitud && (
        <MostrarSolicitudAdministrador
          id={idSolicitud}
          onClose={handleCloseSolicitud}
        />
      )}

      {showAgenda && selectedDate && id_usuario && token && (
        <AgendaView
          ordenesAprobadas={ordenesAprobadas.filter(
            (o) =>
              new Date(o.fecha_hora_emision).toDateString() ===
              new Date(selectedDate).toDateString()
          )}
          idUsuario={id_usuario}
          token={token}
          onOrdenClick={handleOrdenClick}
          handleShowSolicitud={handleShowSolicitud}
          onClose={closeAgendaView}
        />
      )}
    </div>
  );
};

export default Calendario;
