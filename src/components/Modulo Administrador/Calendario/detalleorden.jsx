import React, { useEffect, useState } from "react";
import API_URL from "../../../Config";

const DetalleOrden = ({ idUsuario, idOrden, token, onClose }) => {
  const [orden, setOrden] = useState(null);
  const [vehiculos, setVehiculos] = useState([]);
  const [conductores, setConductores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordenResponse = await fetch(
          `${API_URL}/OrdenesMovilizacion/detalle-orden/${idUsuario}/${idOrden}/`,
          {
            headers: { Authorization: `${token}` },
          }
        );

        if (!ordenResponse.ok)
          throw new Error("Error al obtener los detalles de la orden");
        const ordenData = await ordenResponse.json();
        setOrden(ordenData);

        const vehiculosResponse = await fetch(
          `${API_URL}/Vehiculos/vehiculos/${idUsuario}/`,
          {
            headers: { Authorization: `${token}` },
          }
        );

        if (!vehiculosResponse.ok)
          throw new Error("Error al obtener vehículos");
        const vehiculosData = await vehiculosResponse.json();
        setVehiculos(vehiculosData.vehiculos);

        const conductoresResponse = await fetch(
          `${API_URL}/Empleados/lista-empleados/${idUsuario}/`,
          {
            headers: { Authorization: `${token}` },
          }
        );

        if (!conductoresResponse.ok)
          throw new Error("Error al obtener conductores");
        const conductoresData = await conductoresResponse.json();
        setConductores(conductoresData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idUsuario, idOrden, token]);

  const getVehiculo = (idVehiculo) =>
    vehiculos.find((v) => v.id_vehiculo === idVehiculo) || {};
  const getConductor = (idConductor) =>
    conductores.find((c) => c.id_empleado === idConductor) || {};
  const getFuncionario = (idFuncionario) =>
    conductores.find((c) => c.id_empleado === idFuncionario) || {};

  const vehiculo = orden ? getVehiculo(orden.id_vehiculo) : {};
  const conductor = orden ? getConductor(orden.id_conductor) : {};
  const funcionario = orden ? getFuncionario(orden.id_empleado) : {};

  if (loading) {
    return <div className="p-4">Cargando...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4 sm:p-6">
  <h2 className="text-2xl font-bold mb-4 text-center">
    Detalle de la Orden de Movilización
  </h2>
  {orden ? (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      {/* Vista en tabla para pantallas grandes */}
      <div className="hidden md:block">
        <table className="w-full table-fixed">
          <tbody>
            <tr>
              <td colSpan="2" className="text-center">
                <strong>ORDEN DE MOVILIZACIÓN</strong>
              </td>
            </tr>
            <tr>
              <td colSpan="2" className="text-center">
                ESTACIÓN EXPERIMENTAL TROPICAL PICHILINGUE
              </td>
            </tr>
            <tr>
              <td className="w-1/2">
                <strong>Secuencial:</strong> {orden.secuencial_orden_movilizacion}
              </td>
              <td className="w-1/2">
                <strong>Fecha de Emisión:</strong> {orden.fecha_hora_emision}
              </td>
            </tr>
            <tr>
              <td className="w-1/2">
                <strong>Motivo:</strong> {orden.motivo_movilizacion}
              </td>
              <td className="w-1/2">
                <strong>Estado:</strong> {orden.estado_movilizacion}
              </td>
            </tr>
            <tr>
              <td className="w-1/2">
                <strong>Origen/Destino:</strong> {orden.lugar_origen_destino_movilizacion}
              </td>
              <td className="w-1/2">
                <strong>Duración:</strong> {orden.duracion_movilizacion}
              </td>
            </tr>
            <tr>
              <td className="w-1/2">
                <strong>Conductor:</strong> <br />
                {conductor.nombres} {conductor.apellidos}
                <br />
                <strong>Cédula:</strong> {conductor.cedula}
              </td>
              <td className="w-1/2">
                <strong>Vehículo:</strong> <br />
                Marca: {vehiculo.marca}
                <br />
                Placa: {vehiculo.placa}
                <br />
                Color: {vehiculo.color_primario}
              </td>
            </tr>
            <tr>
              <td className="w-1/2">
                <strong>Funcionario:</strong> <br />
                {funcionario.nombres} {funcionario.apellidos}
                <br />
                <strong>Cédula:</strong> {funcionario.cedula}
              </td>
              <td className="w-1/2">
                <strong>Detalles del Vehículo:</strong> <br />
                Matrícula: {vehiculo.numero_matricula}
                <br />
                Motor: {vehiculo.numero_motor}
                <br />
                Año: {vehiculo.anio_fabricacion}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      {/* Vista en tarjetas para dispositivos móviles */}
      <div className="block md:hidden">
        <div className="mb-4">
          <strong>ORDEN DE MOVILIZACIÓN</strong>
        </div>
        <div className="mb-4">
          <strong>ESTACIÓN EXPERIMENTAL TROPICAL PICHILINGUE</strong>
        </div>
        <div className="mb-4">
          <strong>Secuencial:</strong> {orden.secuencial_orden_movilizacion}
        </div>
        <div className="mb-4">
          <strong>Fecha de Emisión:</strong> {orden.fecha_hora_emision}
        </div>
        <div className="mb-4">
          <strong>Motivo:</strong> {orden.motivo_movilizacion}
        </div>
        <div className="mb-4">
          <strong>Estado:</strong> {orden.estado_movilizacion}
        </div>
        <div className="mb-4">
          <strong>Origen/Destino:</strong> {orden.lugar_origen_destino_movilizacion}
        </div>
        <div className="mb-4">
          <strong>Duración:</strong> {orden.duracion_movilizacion}
        </div>
        <div className="mb-4">
          <strong>Conductor:</strong> <br />
          {conductor.nombres} {conductor.apellidos}
          <br />
          <strong>Cédula:</strong> {conductor.cedula}
        </div>
        <div className="mb-4">
          <strong>Vehículo:</strong> <br />
          Marca: {vehiculo.marca}
          <br />
          Placa: {vehiculo.placa}
          <br />
          Color: {vehiculo.color_primario}
        </div>
        <div className="mb-4">
          <strong>Funcionario:</strong> <br />
          {funcionario.nombres} {funcionario.apellidos}
          <br />
          <strong>Cédula:</strong> {funcionario.cedula}
        </div>
        <div className="mb-4">
          <strong>Detalles del Vehículo:</strong> <br />
          Matrícula: {vehiculo.numero_matricula}
          <br />
          Motor: {vehiculo.numero_motor}
          <br />
          Año: {vehiculo.anio_fabricacion}
        </div>
      </div>
      <button
    className="w-full md:w-auto bg-blue-500 
    hover:bg-blue-600 text-white font-bold 
    py-2 px-4 border-b-4 border-blue-300 
    hover:border-blue-700 rounded mt-2 md:mt-0 md:ml-2"
    onClick={onClose}
  >
    Cerrar
  </button>
    </div>
  ) : (
    <p>No se encontraron detalles para esta orden.</p>
  )}
  
</div>

  );
};

export default DetalleOrden;
