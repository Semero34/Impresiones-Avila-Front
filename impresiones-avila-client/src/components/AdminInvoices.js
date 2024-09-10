import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, Button, Typography, CircularProgress, Box, TextField,
    TablePagination
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

function AdminInvoices() {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true); // Estado de carga
    const [searchTerm, setSearchTerm] = useState(''); // Estado para el filtro de búsqueda
    const [page, setPage] = useState(0); // Estado para la paginación
    const [rowsPerPage, setRowsPerPage] = useState(5); // Filas por página

    const navigate = useNavigate();

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('${process.env.REACT_APP_API_URL}/admin/invoices', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setInvoices(response.data);
                setLoading(false); // Detener carga
            } catch (error) {
                console.error('Error fetching invoices:', error);
                setLoading(false); // Detener carga en caso de error
            }
        };

        fetchInvoices();
    }, []);

    const updateInvoiceStatus = async (id, status) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${process.env.REACT_APP_API_URL}/admin/invoices/${id}`, { status }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setInvoices(invoices.map(invoice => invoice.invoice_id === id ? { ...invoice, status } : invoice));
        } catch (error) {
            console.error('Error updating invoice status:', error);
        }
    };

    const approveOrderAndCreateInvoice = async (orderId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/admin/orders/${orderId}/approve`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success) {
                const updatedInvoices = invoices.map(invoice =>
                    invoice.invoice_id === response.data.invoiceId
                        ? { ...invoice, status: 'approved' }
                        : invoice
                );
                setInvoices(updatedInvoices);
            }
        } catch (error) {
            console.error('Error approving order and creating invoice:', error);
        }
    };

    const viewInvoiceDetails = (invoiceId) => {
        navigate(`/invoice/${invoiceId}`);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Filtrado de facturas basado en el término de búsqueda
    const filteredInvoices = invoices.filter((invoice) =>
        (invoice.client_name ? invoice.client_name.toLowerCase() : '').includes(searchTerm.toLowerCase()) ||
        (invoice.status ? invoice.status.toLowerCase() : '').includes(searchTerm.toLowerCase())
    );
    
    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" className="mt-8">
            <Typography variant="h4" className="font-bold text-center mb-8">
                Facturas
            </Typography>
            <Box display="flex" justifyContent="space-between" mb={2}>
                <TextField
                    label="Buscar por Cliente o Estado"
                    variant="outlined"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    fullWidth
                />
            </Box>
            {filteredInvoices.length === 0 ? (
                <Typography variant="h6" color="textSecondary" align="center">
                    No hay facturas disponibles.
                </Typography>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                    <TableHead>
    <TableRow>
        <TableCell>ID</TableCell>
        <TableCell>Cliente</TableCell>
        <TableCell>Total</TableCell>
        <TableCell>Método de Pago</TableCell>
        <TableCell>Estado</TableCell>
        <TableCell>Acciones</TableCell>
    </TableRow>
</TableHead>
<TableBody>
    {filteredInvoices
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map((invoice) => (
            <TableRow key={invoice.invoice_id}>
                <TableCell>{invoice.invoice_id}</TableCell>
                <TableCell>{invoice.client_name}</TableCell>
                <TableCell>${invoice.total_amount}</TableCell>
                <TableCell>{invoice.payment_method}</TableCell>
                <TableCell>{invoice.status}</TableCell>
                <TableCell>
    {invoice.status === 'pending' && (
        <>
            <Button
                variant="contained"
                color="primary"
                onClick={() => approveOrderAndCreateInvoice(invoice.order_id)}
                style={{ marginRight: '10px' }}
            >
                Aprobar
            </Button>
            <Button
                variant="contained"
                color="error" // Cambia a color rojo
                onClick={() => updateInvoiceStatus(invoice.invoice_id, 'canceled')}
                style={{ marginRight: '10px' }}
            >
                Anular
            </Button>
        </>
    )}
    <Button
        variant="contained"
        onClick={() => viewInvoiceDetails(invoice.invoice_id)}
    >
        Ver Detalles
    </Button>
</TableCell>

            </TableRow>
        ))}
</TableBody>

                    </Table>
                    <TablePagination
                        component="div"
                        count={filteredInvoices.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelRowsPerPage="Filas por página"
                    />
                </TableContainer>
            )}
        </Container>
    );
}

export default AdminInvoices;
