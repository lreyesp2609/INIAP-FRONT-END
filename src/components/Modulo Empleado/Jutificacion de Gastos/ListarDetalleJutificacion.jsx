import React, { useState, useEffect } from 'react';
import API_URL from '../../../Config';
import { notification } from 'antd';
import moment from 'moment';

const ListarDetalleJustificaciones = ({ idInforme, onClose }) => {
    const [detalle, setDetalle] = useState({
        codigo_solicitud: '',
        rango_fechas: '',
        nombre_completo: '',
        cargo: '',
        cedula: '',
        facturas: [],
        total_factura: 0
    });
    
    const [includeHeaderFooter, setIncludeHeaderFooter] = useState(true); // Nuevo estado para el checkbox

    useEffect(() => {
        const fetchDetalle = async () => {
            try {
                const response = await fetch(`${API_URL}/Informes/listar-detalle-justificaciones/${idInforme}/`);
                const result = await response.json();

                if (response.ok) {
                    setDetalle({
                        ...result,
                        facturas: result.facturas.map(factura => ({
                            ...factura,
                            fecha_emision: moment(factura.fecha_emision, 'DD-MM-YYYY').format('DD-MM-YYYY')
                        }))
                    });
                } else {
                    notification.error({
                        message: 'Error',
                        description: result.error || 'Error al cargar el detalle de las justificaciones.',
                    });
                }
            } catch (error) {
                notification.error({
                    message: 'Error',
                    description: error.message || 'Error al cargar el detalle de las justificaciones.',
                });
            }
        };

        fetchDetalle();
    }, [idInforme]);

    const columns = [
        { title: 'Tipo de Documento', dataIndex: 'tipo_documento', key: 'tipo_documento' },
        { title: 'Número de Factura', dataIndex: 'numero_factura', key: 'numero_factura' },
        { title: 'Fecha de Emisión', dataIndex: 'fecha_emision', key: 'fecha_emision' },
        { title: 'Detalle del Documento', dataIndex: 'detalle_documento', key: 'detalle_documento' },
        { title: 'Valor ($)', dataIndex: 'valor', key: 'valor', render: value => `${parseFloat(value).toFixed(2)}` },
    ];

    const dataSource = detalle.facturas.map((factura, index) => ({ key: index, ...factura }));

    const totalFacturas = parseFloat(detalle.total_factura).toFixed(2);

    const handleClose = () => {
        if (onClose) onClose();
    };

    const handleGeneratePDF = async () => {
        try {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            const idUsuario = storedUser?.usuario?.id_usuario;
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Token no encontrado');

            const response = await fetch(`${API_URL}/Informes/generar_pdf_facturas/${idUsuario}/${idInforme}/pdf/?includeHeaderFooter=${includeHeaderFooter}`, {
                method: 'GET',
                headers: { 'Authorization': `${token}` },
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Error en la respuesta del servidor');
            }

            const contentType = response.headers.get('Content-Type');
            if (!contentType || !contentType.includes('application/pdf')) {
                throw new Error('Respuesta inesperada del servidor');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const popup = window.open('', '_blank');
            if (popup) {
                popup.location.href = url;
            } else {
                notification.error({
                    message: 'Error',
                    description: 'No se pudo abrir la ventana del PDF. Por favor, permite las ventanas emergentes.',
                    placement: 'topRight',
                });
            }
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error('Error al generar o abrir el PDF:', error);
            notification.error({
                message: 'Error',
                description: `Error al generar o abrir el PDF: ${error.message}`,
                placement: 'topRight',
            });
        }
    };

    return (
        <div className="p-6 border border-gray-300 rounded-lg shadow-md bg-white">
            <div className="mb-12 text-center">
                <h2 className="text-lg font-bold mb-2">
                    DETALLE DE DOCUMENTOS DE RESPALDO PARA LA JUSTIFICACIÓN DEL 70%
                    <br />
                    DE GASTOS REALIZADOS EN LA COMISIÓN DE SERVICIOS
                </h2>
            </div>
            <div className="mb-12 flex flex-col items-center">
                <div className="flex items-center mb-2">
                    <h2 className="text-medium font-bold mr-2">NUMERO DE INFORME:</h2>
                    <h2 className="text-medium">{detalle.codigo_solicitud}</h2>
                </div>
                <div className="flex items-center mb-2">
                    <h2 className="text-medium font-bold mr-2">FECHA DE COMISIÓN:</h2>
                    <h3 className="text-medium">{detalle.rango_fechas}</h3>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="mb-12 min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr>
                            {columns.map(col => (
                                <th key={col.key} className="border-b px-4 py-2 text-left">{col.title}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {dataSource.map((factura, index) => (
                            <tr key={index}>
                                {columns.map(col => (
                                    <td key={col.key} className="border-b px-4 py-2">
                                        {col.render ? col.render(factura[col.dataIndex]) : factura[col.dataIndex]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        <tr>
                            <td className="border-b px-4 py-2"></td>
                            <td className="border-b px-4 py-2"></td>
                            <td className="border-b px-4 py-2"></td>
                            <td className="border-b px-4 py-2 text-right font-semibold">Total($)</td>
                            <td className="border-b px-4 py-2 text-left font-semibold">{totalFacturas}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="mb-8 flex flex-col items-center">
                <div className="flex items-center mb-2">
                    <h3 className="text-medium">{detalle.nombre_completo}</h3>
                </div>
                <div className="flex items-center mb-2">
                    <h3 className="text-medium">{detalle.cargo}</h3> 
                </div>
                <div className="flex items-center mb-2">
                    <h3 className="text-medium">{detalle.cedula}</h3>
                </div>
            </div>
            <div className="mb-12 flex items-center">
                <input
                    type="checkbox"
                    checked={includeHeaderFooter}
                    onChange={() => setIncludeHeaderFooter(!includeHeaderFooter)}
                    className="mr-2"
                />
                <label>Incluir encabezado y pie de página</label>
            </div>
            <div className="text-center">
                <button onClick={handleGeneratePDF} className="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Generar PDF</button>
                <button onClick={handleClose} className="ml-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Cerrar</button>
            </div>
        </div>
    );
};

export default ListarDetalleJustificaciones;