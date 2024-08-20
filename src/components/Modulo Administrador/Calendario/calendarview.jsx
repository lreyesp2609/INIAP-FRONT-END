import React from "react";
import MesView from "./Mesview";
import SemanaView from "./Semanaview";
import AgendaView from "./Agendaview";

const CalendarView = ({ view, date, ordenesAprobadas, onOrdenClick, onShowAgenda, onShowSolicitudList }) => {
  return (
    <div>
      {view === "month" && (
        <MesView
          date={date}
          ordenesAprobadas={ordenesAprobadas}
          onOrdenClick={onOrdenClick}
          onShowAgenda={onShowAgenda}
          onShowSolicitudList={onShowSolicitudList}
        />
      )}
      {view === "week" && (
        <SemanaView
          date={date}
          ordenesAprobadas={ordenesAprobadas}
          onOrdenClick={onOrdenClick}
          onShowAgenda={onShowAgenda}
          onShowSolicitudList={onShowSolicitudList}
        />
      )}
      {view === "agenda" && (
        <AgendaView
          ordenesAprobadas={ordenesAprobadas}
          onOrdenClick={onOrdenClick}
          onShowAgenda={onShowAgenda}
        />
      )}
    </div>
  );
};

export default CalendarView;
