import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Divider } from '@mui/material';
import 'tailwindcss/tailwind.css';

const InvoiceDetail = () => {
    const { id } = useParams();
    const [invoice, setInvoice] = useState(null);
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:3001/invoice/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setInvoice(response.data.invoice);
                setItems(response.data.items);
            } catch (error) {
                console.error('Error fetching invoice:', error);
            }
        };

        fetchInvoice();
    }, [id]);

    if (!invoice) {
        return <div className="text-center">Loading...</div>;
    }

    // Asegúrate de que los valores sean números antes de aplicar toFixed
    const subtotal = invoice.subtotal ? Number(invoice.subtotal).toFixed(2) : '0.00';
    const tax = invoice.tax ? Number(invoice.tax).toFixed(2) : '0.00';
    const totalAmount = invoice.total_amount ? Number(invoice.total_amount).toFixed(2) : '0.00';

    return (
        <Container maxWidth="md" className="mt-8">
            <Paper elevation={6} className="p-8 rounded-lg">
                <Box className="text-center mb-8">
                    <Typography variant="h4" className="font-bold">
                        Factura Electrónica
                    </Typography>
                </Box>

                <Box mb={4}>
                    <Typography variant="h6" className="font-bold">Información de la Empresa</Typography>
                    <Typography variant="body1">Empresa XYZ S.A.</Typography>
                    <Typography variant="body1">Identificación: 50601082400050230983</Typography>
                    <Typography variant="body1">Teléfono: 22368188</Typography>
                    <Typography variant="body1">Correo Electrónico: contacto@empresa.com</Typography>
                    <Typography variant="body1">Dirección: San José, Costa Rica</Typography>
                </Box>

                <Divider />

                <Box mt={4} mb={4}>
                    <Typography variant="h6" className="font-bold">Información del Cliente</Typography>
                    <Typography variant="body1">{invoice.client_name}</Typography>
                    <Typography variant="body1">{invoice.client_identification}</Typography>
                    <Typography variant="body1">{invoice.address}</Typography>
                    <Typography variant="body1">{invoice.contact_info}</Typography>
                </Box>

                <Divider />

                <Box mt={4} mb={4}>
                    <Typography variant="h6" className="font-bold">Detalles de la Factura</Typography>
                    <Typography variant="body1">Número de Factura: {invoice.invoice_id}</Typography>
                    <Typography variant="body1">Fecha de Emisión: {new Date(invoice.issue_date).toLocaleDateString()}</Typography>
                    <Typography variant="body1">Condición de Venta: {invoice.sale_condition}</Typography>
                    <Typography variant="body1">Método de Pago: {invoice.payment_method}</Typography>
                </Box>

                <Divider />

                <TableContainer component={Paper} className="mt-4">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Descripción</TableCell>
                                <TableCell>Cantidad</TableCell>
                                <TableCell>Precio Unitario</TableCell>
                                <TableCell>Subtotal</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {items.map((item) => (
                                <TableRow key={item.item_id}>
                                    <TableCell>{item.description}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>₡{Number(item.unit_price).toFixed(2)}</TableCell>
                                    <TableCell>₡{Number(item.subtotal).toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Box mt={4} textAlign="right">
                    <Typography variant="h6" className="font-bold">Subtotal: ₡{subtotal}</Typography>
                    <Typography variant="h6" className="font-bold">Impuestos: ₡{tax}</Typography>
                    <Typography variant="h6" className="font-bold">Total: ₡{totalAmount}</Typography>
                </Box>

                <Box mt={4}>
                    <Typography variant="body2" className="font-italic">Monto en letras: {invoice.total_amount_in_words}</Typography>
                </Box>

                <Box mt={4}>
                    <Typography variant="h6" className="font-bold">Observaciones</Typography>
                    <Typography variant="body1">{invoice.observations}</Typography>
                </Box>

                <Box mt={4}>
                    <Typography variant="body2" className="font-italic text-right">Realizado por: {invoice.issued_by}</Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default InvoiceDetail;
