import React, { useState, useEffect } from 'react';
import API_URL from '../../../Config';

const ListarDetallePDF = ({ idInforme, onClose }) => {
    const [informe, setInforme] = useState({
        'Codigo de Solicitud': '',
        'Fecha del Informe': '',
        'Nombre Completo': '',
        'Cargo': '',
        'Lugar de Servicio': '',
        'Nombre de Unidad': '',
        'Listado de Empleados': '',
        'Fecha Salida Informe': '',
        'Hora Salida Informe': '',
        'Fecha Llegada Informe': '',
        'Hora Llegada Informe': '',
        'Observacion': '',
        'Transportes': [],
        'Productos Alcanzados': [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchInforme();
    }, [idInforme]);

    const createMarkup = (html) => {
        return { __html: html };
    };

    const fetchInforme = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Token no encontrado');

            const response = await fetch(`${API_URL}/Informes/detalle-informe/${idInforme}/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error('Error al obtener el informe');

            const data = await response.json();
            setInforme(data.detalle_informe);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center">Cargando...</div>;
    if (error) return <div className="text-center text-red-500">{error}</div>;
    if (!informe) return null;

    return (
        <div className="p-4">
            <div className="mb-6 border-2 border-gray-600 rounded-lg p-4">
                <h2 className="mb-6 border-2 border-gray-600 rounded-lg p-4 text-center font-bold">
                    INFORME DE SERVICIOS INSTITUCIONALES
                </h2>
                <div className="mb-6 border-2 border-gray-600 rounded-lg p-4">
                    <div className="mb-4 flex">
                        <div className="mr-4 w-1/2">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Nro. SOLICITUD DE AUTORIZACIÓN PARA CUMPLIMIENTO DE SERVICIOS INSTITUCIONALES
                            </label>
                            <input
                                type="text"
                                value={informe['Codigo de Solicitud']}
                                readOnly
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div className="mr-4 w-1/2 flex flex-col justify-between">
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    FECHA DEL INFORME (dd-mmm-aaa)
                                </label>
                            </div>
                            <div className="mt-auto">
                                <input
                                    type="text"
                                    value={informe['Fecha del Informe']}
                                    readOnly
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <h2 className="mb-6 border-2 border-gray-600 rounded-lg p-4 text-center font-bold">DATOS GENERALES</h2>
                <div className="mb-6 border-2 border-gray-600 rounded-lg p-4">
                    <div className="mb-4 flex">
                        <div className="mr-4 w-1/2">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                APELLIDOS - NOMBRES DE LA O EL SERVIDOR
                            </label>
                            <input
                                type="text"
                                value={informe['Nombre Completo']}
                                readOnly
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div className="mr-4 w-1/2">
                            <label className="block text-gray-700 text-sm font-bold mb-2">PUESTO QUE OCUPA</label>
                            <input
                                type="text"
                                value={informe['Cargo']}
                                readOnly
                                className="w-full p-2 border rounded"
                            />
                        </div>
                    </div>
                    <div className="mb-4 flex">
                        <div className="mr-4 w-1/2">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                CIUDAD - PROVINCIA DEL SERVICIO INSTITUCIONAL
                            </label>
                            <input
                                type="text"
                                value={informe['Lugar de Servicio']}
                                readOnly
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div className="mr-4 w-1/2">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                NOMBRE DE LA UNIDAD A LA QUE PERTENECE LA O EL SERVIDOR
                            </label>
                            <input
                                type="text"
                                value={informe['Nombre de Unidad']}
                                readOnly
                                className="w-full p-2 border rounded"
                            />
                        </div>
                    </div>
                </div>
                <div className="mb-6 border-2 border-gray-600 rounded-lg p-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        SERVIDORES QUE INTEGRAN EL SERVICIO INSTITUCIONAL
                    </label>
                    <input
                        type="text"
                        value={informe['Listado de Empleados']}
                        readOnly
                        className="w-full p-2 border rounded"
                    />
                </div>
                <h2 className="mb-6 border-2 border-gray-600 rounded-lg p-4 text-center font-bold">INFORME DE ACTIVIDADES Y PRODUCTOS ALCANZADOS</h2>
                <div className="mb-6 border-2 border-gray-600 rounded-lg p-4">
                    {informe['Productos Alcanzados'].map((producto, index) => (
                        <div
                            key={index}
                            dangerouslySetInnerHTML={createMarkup(producto)}
                            clsassName="mb-4 last:mb-0 ql-editor" // Añadimos la clase ql-editor para mantener los estilos de Quill
                        />
                    ))}
                </div>
                <div className="mb-6 border-2 border-gray-600 rounded-lg p-4">
                    <div className="mb-4 flex">
                        <div className="mr-4 w-1/4">
                            <label className="block text-gray-700 text-center text-sm font-bold mb-2">INTINERARIO</label>
                        </div>
                        <div className="mr-4 w-1/2">
                            <label className="block text-gray-700 text-center text-sm font-bold mb-2">SALIDA</label>
                        </div>
                        <div className="mr-4 w-1/2">
                            <label className="block text-gray-700 text-center text-sm font-bold mb-2">LLEGADA</label>
                        </div>
                    </div>
                    <div className="mb-4 flex items-center">
                        <div className="mr-4 w-1/4">
                            <label className="block text-gray-700 text-center text-sm font-bold mb-2">FECHA dd-mmm-aaaa</label>
                        </div>
                        <div className="mr-4 w-1/2">
                            <input
                                type="text"
                                value={informe['Fecha Salida Informe']}
                                readOnly
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div className="mr-4 w-1/2">
                            <input
                                type="text"
                                value={informe['Fecha Llegada Informe']}
                                readOnly
                                className="w-full p-2 border rounded"
                            />
                        </div>
                    </div>
                    <div className="mb-4 flex items-center">
                        <div className="mr-4 w-1/4">
                            <label className="block text-gray-700 text-center text-sm font-bold mb-2">HORA hh:mm</label>
                        </div>
                        <div className="mr-4 w-1/2">
                            <input
                                type="text"
                                value={informe['Hora Salida Informe']}
                                readOnly
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div className="mr-4 w-1/2">
                            <input
                                type="text"
                                value={informe['Hora Llegada Informe']}
                                readOnly
                                className="w-full p-2 border rounded"
                            />
                        </div>
                    </div>
                </div>
                <h2 className="mb-6 border-2 border-gray-600 rounded-lg p-4 text-center font-bold">TRANSPORTE</h2>
                <div className="mb-6 border-2 border-gray-600 rounded-lg p-4">
                    {informe['Transportes'].map((transporte, index) => (
                        <div key={index} className="mb-4">
                            <div className="mb-4 flex">
                                <div className="mr-4 w-1/3">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">TIPO DE TRANSPORTE</label>
                                    <input
                                        type="text"
                                        value={transporte['Tipo de Transporte']}
                                        readOnly
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div className="mr-4 w-1/3">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">NOMBRE DE TRANSPORTE</label>
                                    <input
                                        type="text"
                                        value={transporte['Nombre del Transporte']}
                                        readOnly
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div className="mr-4 w-1/3">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">RUTA</label>
                                    <input
                                        type="text"
                                        value={transporte['Ruta']}
                                        readOnly
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                            </div>
                            <div className="mb-4 flex">
                                <div className="mr-4 w-1/4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">FECHA SALIDA</label>
                                    <input
                                        type="text"
                                        value={transporte['Fecha de Salida']}
                                        readOnly
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div className="mr-4 w-1/4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">HORA SALIDA</label>
                                    <input
                                        type="text"
                                        value={transporte['Hora de Salida']}
                                        readOnly
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div className="mr-4 w-1/4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">FECHA LLEGADA</label>
                                    <input
                                        type="text"
                                        value={transporte['Fecha de Llegada']}
                                        readOnly
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div className="mr-4 w-1/4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">HORA LLEGADA</label>
                                    <input
                                        type="text"
                                        value={transporte['Hora de Llegada']}
                                        readOnly
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <h2 className="mb-6 border-2 border-gray-600 rounded-lg p-4 text-center font-bold">OBSERVACIONES</h2>
                <div className="mb-6 border-2 border-gray-600 rounded-lg p-4">
                    <textarea
                        value={informe['Observacion']}
                        readOnly
                        className="w-full p-2 border rounded"
                        rows="4"
                    />
                </div>
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ListarDetallePDF;
