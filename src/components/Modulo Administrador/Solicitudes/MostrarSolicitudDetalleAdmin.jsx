import React, { useState, useEffect } from 'react';
import API_URL from '../../../Config';

const MostrarSolicitudAdmin = ({ id_solicitud, onClose }) => {
    const [solicitud, setSolicitud] = useState(null);
    const [datosPersonales, setDatosPersonales] = useState(null);
    const [rutas, setRutas] = useState([]);
    const [cuentaBancaria, setCuentaBancaria] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSolicitud = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('Token no encontrado');
                    setIsLoading(false);
                    return;
                }

                if (!id_solicitud || isNaN(id_solicitud)) {
                    setError('ID de solicitud no válido');
                    setIsLoading(false);
                    return;
                }

                const response = await fetch(`${API_URL}/Informes/listar-solicitud-empleado/${id_solicitud}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Datos de la solicitud:', data);
                    setSolicitud(data.solicitud);
                    setDatosPersonales(data.datos_personales);
                    setRutas(data.rutas);
                    setCuentaBancaria(data.cuenta_bancaria);
                } else {
                    const errorData = await response.json();
                    console.log('Error al obtener la solicitud:', errorData);
                    setError(errorData.error || 'Error al obtener la solicitud');
                }
            } catch (error) {
                console.log('Error al obtener la solicitud:', error);
                setError('Error al obtener la solicitud: ' + error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSolicitud();
    }, [id_solicitud]);

    if (isLoading) {
        return <div>Cargando...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    if (!solicitud) {
        return <div>No se encontraron datos de la solicitud</div>;
    }

    return (
        <div className="p-4">
            <div className="mb-6 border-2 border-gray-600 rounded-lg p-4">
                <h2 className="mb-6 border-2 border-gray-600 rounded-lg p-4 text-center font-bold">
                    SOLICITUD DE AUTORIZACIÓN PARA CUMPLIMIENTO DE SERVICIOS INSTITUCIONALES
                </h2>
                {error && <div className="mb-4 text-red-500">{error}</div>}
                <div className="mb-6 border-2 border-gray-600 rounded-lg p-4">
                    <div className="mb-4 flex">
                        <div className="mr-4 w-1/2">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Nro. SOLICITUD DE AUTORIZACIÓN PARA CUMPLIMIENTO DE SERVICIOS INSTITUCIONALES
                            </label>
                            <input
                                type="text"
                                value={solicitud['Codigo de Solicitud']}
                                readOnly
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="w-1/2">
                            <label className="block text-gray-700 text-sm font-bold mb-2 h-10">
                                FECHA DE SOLICITUD (dd-mmm-aaa)
                            </label>
                            <input
                                type="text"
                                value={solicitud['Fecha Solicitud']}
                                readOnly
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">MOTIVO MOVILIZACIÓN</label>
                        <input
                            type="text"
                            value={solicitud['Motivo']}
                            readOnly
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
                <h2 className="mb-6 border-2 border-gray-600 rounded-lg p-4 text-center font-bold">DATOS GENERALES</h2>
                <div className="mb-6 border-2 border-gray-600 rounded-lg p-4">
                    {datosPersonales && (
                        <div className="w-full mr-2">
                            <div className="flex mb-2">
                                <div className="mr-2 w-1/2">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">APELLIDOS - NOMBRES DE LA O EL SERVIDOR</label>
                                    <input
                                        type="text"
                                        value={datosPersonales.Nombre}
                                        readOnly
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="w-1/2">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">PUESTO QUE OCUPA:</label>
                                    <input
                                        type="text"
                                        value={datosPersonales.Cargo}
                                        readOnly
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            <div className="mb-4 flex">
                                <div className="w-1/2 mr-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">CIUDAD - PROVINCIA DEL SERVICIO INSTITUCIONAL:</label>
                                    <input
                                        type="text"
                                        value={solicitud['Lugar de Servicio']}
                                        readOnly
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="w-1/2">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">NOMBRE DE LA UNIDAD A LA QUE PERTENECE LA O EL SERVIDOR</label>
                                    <input
                                        type="text"
                                        value={datosPersonales.Unidad}
                                        readOnly
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="mb-4 flex">
                        <div className="mr-4 w-1/4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">FECHA SALIDA (dd-mmm-aaaa)</label>
                            <input
                                type="text"
                                value={solicitud['Fecha de Salida']}
                                readOnly
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="mr-4 w-1/4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">HORA SALIDA (hh:mm)</label>
                            <input
                                type="text"
                                value={solicitud['Hora de Salida']}
                                readOnly
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="mr-4 w-1/4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">FECHA LLEGADA (dd-mmm-aaaa)</label>
                            <input
                                type="text"
                                value={solicitud['Fecha de Llegada']}
                                readOnly
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="w-1/4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">HORA LLEGADA (hh:mm)</label>
                            <input
                                type="text"
                                value={solicitud['Hora de Llegada']}
                                readOnly
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">SERVIDORES QUE INTEGRAN LOS SERVICIOS INSTITUCIONALES:</label>
                        <input
                            type="text"
                            value={solicitud['Listado de Empleados']}
                            readOnly
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">DESCRIPCIÓN DE LAS ACTIVIDADES A EJECUTARSE</label>
                        <textarea
                            value={solicitud['Descripción de Actividades']}
                            readOnly
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="4"
                        ></textarea>
                    </div>
                </div>
                <h2 className="mb-6 border-2 border-gray-600 rounded-lg p-4 text-center font-bold">TRANSPORTE</h2>
                <div className="mb-6 border-2 border-gray-600 rounded-lg p-4">
                    <div className="mb-3 flex">
                        <div className="mb-3">
                            {rutas.map((ruta, index) => (
                                <div key={index} className="mb-6 border-b pb-4">
                                    <h3 className="text-lg font-bold mb-2">Ruta {index + 1}</h3>
                                    <div className="mb-3 grid grid-cols-12 gap-2">
                                        <div className="col-span-3">
                                            <label className="block text-gray-700 text-sm font-bold mb-2">TIPO DE TRANSPORTE (Aéreo, terrestre, marítimo, otros)</label>
                                            <input
                                                type="text"
                                                value={ruta['Tipo de Transporte']}
                                                readOnly
                                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div className="col-span-3">
                                            <label className="block text-gray-700 text-sm font-bold mb-2 h-10">NOMBRE DEL TRANSPORTE</label>
                                            <input
                                                type="text"
                                                value={ruta['Nombre del Transporte']}
                                                readOnly
                                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div className="col-span-6">
                                            <label className="block text-gray-700 text-sm font-bold mb-2 h-10">RUTA</label>
                                            <input
                                                type="text"
                                                value={ruta['Ruta']}
                                                readOnly
                                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                        <div>
                                            <label className="block text-gray-700 text-sm font-bold mb-2">FECHA SALIDA TRANSPORTE</label>
                                            <input
                                                type="text"
                                                value={ruta['Fecha de Salida']}
                                                readOnly
                                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 text-sm font-bold mb-2">HORA SALIDA TRANSPORTE</label>
                                            <input
                                                type="text"
                                                value={ruta['Hora de Salida']}
                                                readOnly
                                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 text-sm font-bold mb-2">FECHA LLEGADA TRANSPORTE</label>
                                            <input
                                                type="text"
                                                value={ruta['Fecha de Llegada']}
                                                readOnly
                                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 text-sm font-bold mb-2">HORA LLEGADA TRANSPORTE</label>
                                            <input
                                                type="text"
                                                value={ruta['Hora de Llegada']}
                                                readOnly
                                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <h2 className="mb-6 border-2 border-gray-600 rounded-lg p-4 text-center font-bold">DATOS PARA TRANSFERENCIA</h2>
                <div className="mb-6 border-2 border-gray-600 rounded-lg p-4">
                    <div className="flex flex-wrap -mx-2">
                        <div className="w-full md:w-1/3 px-2 mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">NOMBRE DEL BANCO:</label>
                            <input
                                type="text"
                                value={cuentaBancaria?.Banco}
                                readOnly
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="w-full md:w-1/3 px-2 mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">TIPO DE CUENTA:</label>
                            <input
                                type="text"
                                value={cuentaBancaria?.['Tipo de Cuenta']}
                                readOnly
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="w-full md:w-1/3 px-2 mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">No. DE CUENTA:</label>
                            <input
                                type="text"
                                value={cuentaBancaria?.['Número de Cuenta']}
                                readOnly
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>
                <div className="flex justify-between">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MostrarSolicitudAdmin;