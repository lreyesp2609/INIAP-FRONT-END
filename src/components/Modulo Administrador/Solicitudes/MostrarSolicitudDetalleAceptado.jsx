import React, { useState, useEffect } from 'react';
import { Modal, Input } from 'antd';
import API_URL from '../../../Config';

const MostrarSolicitudAceptadoAdmin = ({ id_solicitud, onClose }) => {
    const [solicitud, setSolicitud] = useState(null);
    const [datosPersonales, setDatosPersonales] = useState(null);
    const [rutas, setRutas] = useState([]);
    const [cuentaBancaria, setCuentaBancaria] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [motivoCancelacion, setMotivoCancelacion] = useState('');

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

    const handleAction = async () => {
        setIsModalVisible(false);

        if (!motivoCancelacion.trim()) {
            setError('Por favor, ingrese un motivo de cancelación');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Token no encontrado');
                return;
            }

            // Primero, actualizamos el estado de la solicitud
            const updateResponse = await fetch(`${API_URL}/Informes/actualizar-solicitud/${id_solicitud}/`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    estado_solicitud: 'cancelado',
                }),
            });

            if (!updateResponse.ok) {
                const errorData = await updateResponse.json();
                throw new Error(errorData.error || 'Error al actualizar el estado de la solicitud');
            }

            // Luego, creamos el motivo de cancelación
            const createMotivoCanceladoResponse = await fetch(`${API_URL}/Informes/crear-motivo-cancelado/${id_solicitud}/`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    motivo_cancelado: motivoCancelacion 
                }),
            });

            if (createMotivoCanceladoResponse.ok) {
                console.log('Solicitud cancelada y motivo de cancelación creado exitosamente');
                onClose(); // Close the component
            } else {
                const errorData = await createMotivoCanceladoResponse.json();
                throw new Error(errorData.error || 'Error al crear el motivo de cancelación');
            }
        } catch (error) {
            console.log('Error al cancelar la solicitud:', error);
            setError('Error al cancelar la solicitud: ' + error.message);
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
                <div className="flex justify-end mt-4">
                    <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => setIsModalVisible(true)}
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
            
            <Modal
                title="Confirmar Cancelación"
                visible={isModalVisible}
                onOk={handleAction}
                onCancel={() => setIsModalVisible(false)}
                okText="Confirmar"
                cancelText="Cancelar"
            >
                <p>¿Estás seguro de que deseas cancelar esta solicitud?</p>
                <Input.TextArea
                    value={motivoCancelacion}
                    onChange={(e) => setMotivoCancelacion(e.target.value)}
                    placeholder="Ingrese el motivo de cancelación"
                    rows={4}
                    className="mt-4"
                />
                {error && <p className="text-red-500 mt-2">{error}</p>}
            </Modal>
        </div>
    );
};

export default MostrarSolicitudAceptadoAdmin;