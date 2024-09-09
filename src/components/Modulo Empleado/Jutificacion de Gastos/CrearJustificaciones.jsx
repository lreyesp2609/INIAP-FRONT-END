import React, { useState } from 'react';
import API_URL from '../../../Config';
import { useNavigate } from 'react-router-dom';
import { notification } from 'antd';

const CrearJustificacione = ({ idInforme, onClose }) => {
    const [facturas, setFacturas] = useState([{ tipo_documento: '', numero_factura: '', fecha_emision: '', detalle_documento: '', valor: 0 }]);
    const [total, setTotal] = useState(0);
    const navigate = useNavigate();

    const handleInputChange = (index, event) => {
        const values = [...facturas];
        const { name, value } = event.target;
        
        // Convertir el valor a número si el campo es "valor"
        if (name === 'valor') {
            values[index][name] = parseFloat(value) || 0;
        } else {
            values[index][name] = value;
        }

        setFacturas(values);
        calculateTotal(values);
    };

    const handleAddRow = () => {
        setFacturas([...facturas, { tipo_documento: '', numero_factura: '', fecha_emision: '', detalle_documento: '', valor: 0 }]);
    };

    const handleRemoveRow = (index) => {
        if (facturas.length === 1) {
            notification.error({
                message: 'Error',
                description: 'Debe haber al menos una factura.',
            });
            return;
        }
        const values = [...facturas];
        values.splice(index, 1);
        setFacturas(values);
        calculateTotal(values);
    };

    const calculateTotal = (facturas) => {
        const total = facturas.reduce((sum, factura) => sum + (parseFloat(factura.valor) || 0), 0);
        setTotal(total);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        // Validación de campos
        for (const factura of facturas) {
            if (!factura.tipo_documento || !factura.numero_factura || !factura.fecha_emision || !factura.detalle_documento || !factura.valor) {
                notification.error({
                    message: 'Error',
                    description: 'Todos los campos deben estar llenos.',
                });
                return;
            }
        }

        try {
            const response = await fetch(`${API_URL}/Informes/crear-justificacion/${idInforme}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ facturas }),
            });

            if (response.ok) {
                notification.success({
                    message: 'Éxito',
                    description: 'Justificación creada exitosamente.',
                });
                if (onClose) onClose(); // Cerrar el componente y regresar al anterior
            } else {
                const error = await response.json();
                notification.error({
                    message: 'Error',
                    description: error.error || 'Error al crear la justificación.',
                });
            }
        } catch (error) {
            notification.error({
                message: 'Error',
                description: error.message || 'Error al crear la justificación.',
            });
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-medium mb-4">Crear Justificación de Gastos</h2>
            <form onSubmit={handleSubmit}>
                <table className="w-full bg-white border border-gray-300 mb-4">
                    <thead>
                        <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-left">Tipo de Documento</th>
                            <th className="py-3 px-6 text-left">Número de Factura</th>
                            <th className="py-3 px-6 text-left">Fecha de Emisión</th>
                            <th className="py-3 px-6 text-left">Detalle del Documento</th>
                            <th className="py-3 px-6 text-left">Valor</th>
                            <th className="py-3 px-6 text-left">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                        {facturas.map((factura, index) => (
                            <tr key={index} className="border-b border-gray-300">
                                <td className="py-3 px-6 text-left">
                                    <input
                                        type="text"
                                        name="tipo_documento"
                                        value={factura.tipo_documento}
                                        onChange={(e) => handleInputChange(index, e)}
                                        className="w-full p-2 border border-gray-300 rounded"
                                    />
                                </td>
                                <td className="py-3 px-6 text-left">
                                    <input
                                        type="text"
                                        name="numero_factura"
                                        value={factura.numero_factura}
                                        onChange={(e) => handleInputChange(index, e)}
                                        className="w-full p-2 border border-gray-300 rounded"
                                    />
                                </td>
                                <td className="py-3 px-6 text-left">
                                    <input
                                        type="date"
                                        name="fecha_emision"
                                        value={factura.fecha_emision}
                                        onChange={(e) => handleInputChange(index, e)}
                                        className="w-full p-2 border border-gray-300 rounded"
                                    />
                                </td>
                                <td className="py-3 px-6 text-left">
                                    <input
                                        type="text"
                                        name="detalle_documento"
                                        value={factura.detalle_documento}
                                        onChange={(e) => handleInputChange(index, e)}
                                        className="w-full p-2 border border-gray-300 rounded"
                                    />
                                </td>
                                <td className="py-3 px-6 text-left">
                                    <input
                                        type="number"
                                        name="valor"
                                        value={factura.valor}
                                        onChange={(e) => handleInputChange(index, e)}
                                        className="w-full p-2 border border-gray-300 rounded"
                                    />
                                </td>
                                <td className="py-3 px-6 text-left">
                                    {facturas.length > 1 && index !== 0 && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveRow(index)}
                                            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                                        >
                                            <span className="text-xl">−</span>
                                        </button>
                                    )}
                                    {index === facturas.length - 1 && (
                                        <button
                                            type="button"
                                            onClick={handleAddRow}
                                            className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 ml-2"
                                        >
                                            <span className="text-xl">+</span>
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex justify-between items-center mb-4">
                    <div className="font-medium text-lg">Total: {total.toFixed(2)}</div>
                </div>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Crear Justificación
                </button>
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-500 text-white rounded ml-4 hover:bg-gray-600"
                >
                    Cerrar
                </button>
            </form>
        </div>
    );
};

export default CrearJustificacione;
