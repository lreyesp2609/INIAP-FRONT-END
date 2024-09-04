import React, { useState, useEffect } from 'react';
import API_URL from '../../../Config';
import { useNavigate } from 'react-router-dom';
import { notification } from 'antd';
import moment from 'moment';

const ListarDetalleJustificaciones = ({ idInforme, onClose }) => {
    const [detalle, setDetalle] = useState({
        codigo_solicitud: '',
        rango_fechas: '',
        facturas: [],
        total_factura: 0
    });

    useEffect(() => {
        // Cargar el detalle de justificaciones cuando se monta el componente
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
        {
            title: 'Tipo de Documento',
            dataIndex: 'tipo_documento',
            key: 'tipo_documento',
        },
        {
            title: 'Número de Factura',
            dataIndex: 'numero_factura',
            key: 'numero_factura',
        },
        {
            title: 'Fecha de Emisión',
            dataIndex: 'fecha_emision',
            key: 'fecha_emision',
        },
        {
            title: 'Detalle del Documento',
            dataIndex: 'detalle_documento',
            key: 'detalle_documento',
        },
        {
            title: 'Valor ($)',
            dataIndex: 'valor',
            key: 'valor',
            render: value => `${parseFloat(value).toFixed(2)}`,
        },
    ];

    const dataSource = detalle.facturas.map((factura, index) => ({
        key: index,
        ...factura,
    }));

    const totalFacturas = parseFloat(detalle.total_factura).toFixed(2);

    const handleClose = () => {
        if (onClose) onClose(); // Ejecutar la función pasada como prop para cerrar el componente actual
    };

    const handleGeneratePDF = () => {
        // Implementar funcionalidad para generar PDF
    };

    return (
        <div className="p-6 border border-gray-300 rounded-lg shadow-md" style={{ width: '210mm', height: '297mm', margin: '0 auto', backgroundColor: '#fff' }}>
            <div className="mb-12 text-center"> {/* Añadido mb-12 para más margen inferior */}
                <h2 className="text-xl font-bold mb-4">
                    DETALLE DE DOCUMENTOS DE RESPALDO PARA LAS JUSTIFICACIÓN DEL 70% 
                    <br />
                    DE GASTOS REALIZADOS EN LA COMISION DE SERVICIOS
                </h2>
            </div>

            <div className="mb-8 flex flex-col items-center"> {/* Añadido mb-8 para margen inferior del bloque */}
                <div className="flex items-center mb-4">
                    <h2 className="text-lg font-bold mr-4">NUMERO DE INFORME:</h2>
                    <h2 className="text-medium">{detalle.codigo_solicitud}</h2>
                </div>
                <div className="flex items-center mb-4">
                    <h2 className="text-lg font-bold mr-4">FECHA DE COMISIÓN:</h2>
                    <h3 className="text-medium">{detalle.rango_fechas}</h3>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
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
            <div className="mt-4 text-center">
                <button onClick={handleGeneratePDF} className="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Generar PDF</button>
                <button onClick={handleClose} className=" ml-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Cerrar</button>
            </div>
        </div>
    );
};

export default ListarDetalleJustificaciones;
