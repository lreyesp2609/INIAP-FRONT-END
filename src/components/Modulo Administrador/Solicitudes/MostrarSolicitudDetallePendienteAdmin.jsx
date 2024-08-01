import React, { useState, useEffect } from 'react';
import API_URL from '../../../Config';

const MostrarSolicitudPendienteAdmin = ({ id_solicitud, onClose }) => {
    const [solicitud, setSolicitud] = useState(null);
    const [datosPersonales, setDatosPersonales] = useState(null);
    const [rutas, setRutas] = useState([]);
    const [cuentaBancaria, setCuentaBancaria] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalAction, setModalAction] = useState('');

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

    const handleAction = async (action) => {
        setShowModal(false);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Token no encontrado');
                return;
            }

            const response = await fetch(`${API_URL}/Informes/actualizar-solicitud/${id_solicitud}/`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ estado_solicitud: action }),
            });

            if (response.ok) {
                console.log(`Solicitud ${action} exitosamente`);
                onClose(); // Close the component
            } else {
                const errorData = await response.json();
                console.log(`Error al ${action} la solicitud:`, errorData);
                setError(errorData.error || `Error al ${action} la solicitud`);
            }
        } catch (error) {
            console.log(`Error al ${action} la solicitud:`, error);
            setError(`Error al ${action} la solicitud: ` + error.message);
        }
    };

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
                            <label className="block text-gray-700 text-sm font-bold mb-2">FECHA RETORNO (dd-mmm-aaaa)</label>
                            <input
                                type="text"
                                value={solicitud['Fecha de Retorno']}
                                readOnly
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="w-1/4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">HORA RETORNO (hh:mm)</label>
                            <input
                                type="text"
                                value={solicitud['Hora de Retorno']}
                                readOnly
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">LUGAR DE SERVICIO</label>
                        <input
                            type="text"
                            value={solicitud['Lugar de Servicio']}
                            readOnly
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
                <div className="flex justify-end mt-4">
                    <button
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
                        onClick={() => { setShowModal(true); setModalAction('aceptado'); }}
                    >
                        Aceptar
                    </button>
                    <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => { setShowModal(true); setModalAction('cancelado'); }}
                    >
                        Cancelar
                    </button>
                    <button
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-2"
                        onClick={onClose}
                    >
                        Cerrar
                    </button>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-black opacity-50 absolute inset-0"></div>
                    <div className="bg-white p-8 rounded-lg shadow-lg z-10">
                        <h2 className="text-2xl font-bold mb-4">Confirmación</h2>
                        <p>¿Estás seguro de que deseas {modalAction} esta solicitud?</p>
                        <div className="flex justify-end mt-4">
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                                onClick={() => handleAction(modalAction)}
                            >
                                Confirmar
                            </button>
                            <button
                                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                                onClick={() => setShowModal(false)}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MostrarSolicitudPendienteAdmin;