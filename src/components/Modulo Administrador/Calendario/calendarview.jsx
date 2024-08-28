import React from "react";
import MesView from "./Mesview";
import SemanaView from "./Semanaview";
import AgendaView from "./Agendaview";

const CalendarView = ({
  view,
  date,
  ordenesAprobadas,
  solicitudesAceptadas,
  onOrdenClick,
  onShowAgenda,
  onShowSolicitudList,
  handleShowSolicitud,
}) => {
  return (
    <div>
      {view === "month" && (
        <MesView
          date={date}
          ordenesAprobadas={ordenesAprobadas}
          solicitudesAceptadas={solicitudesAceptadas}
          onOrdenClick={onOrdenClick}
          onShowAgenda={onShowAgenda}
          onShowSolicitudList={onShowSolicitudList}
          handleShowSolicitud={handleShowSolicitud}

        />
      )}
      {view === "week" && (
        <SemanaView
          date={date}
          ordenesAprobadas={ordenesAprobadas}
          solicitudesAceptadas={solicitudesAceptadas}
          onOrdenClick={onOrdenClick}
          onShowAgenda={onShowAgenda}
          onShowSolicitudList={onShowSolicitudList}
          handleShowSolicitud={handleShowSolicitud}
        />
      )}
      {view === "agenda" && (
        <AgendaView
          solicitudesAceptadas={solicitudesAceptadas}
          ordenesAprobadas={ordenesAprobadas}
          onOrdenClick={onOrdenClick}
          onShowAgenda={onShowAgenda}
          handleShowSolicitud={handleShowSolicitud}
        />
      )}
    </div>
  );
};

export default CalendarView;
