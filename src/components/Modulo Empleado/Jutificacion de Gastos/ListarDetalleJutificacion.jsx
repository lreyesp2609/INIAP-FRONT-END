import React, { useState, useEffect } from 'react';
import API_URL from '../../../Config';
import { notification, Table, Typography, Card } from 'antd';
import moment from 'moment';

const { Title } = Typography;

const ListarDetalleJustificaciones = ({ idInforme }) => {
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
            title: 'Valor',
            dataIndex: 'valor',
            key: 'valor',
            render: value => `$${parseFloat(value).toFixed(2)}`,
        },
    ];

    const dataSource = detalle.facturas.map((factura, index) => ({
        key: index,
        ...factura,
    }));

    const totalFacturas = parseFloat(detalle.total_factura).toFixed(2);

    return (
        <div className="p-4">
            <Card>
                <Title level={2} className="text-center">{detalle.codigo_solicitud}</Title>
                <Title level={3} className="text-center">{detalle.rango_fechas}</Title>
                <Table
                    dataSource={dataSource}
                    columns={columns}
                    pagination={false}
                    summary={() => (
                        <Table.Summary.Row>
                            <Table.Summary.Cell colSpan={4} />
                            <Table.Summary.Cell>
                                <Typography.Text strong>Total:</Typography.Text> ${totalFacturas}
                            </Table.Summary.Cell>
                        </Table.Summary.Row>
                    )}
                />
            </Card>
        </div>
    );
};

export default ListarDetalleJustificaciones;
