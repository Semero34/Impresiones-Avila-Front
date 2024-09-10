import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

function TransactionOverview() {
    const [transactions, setTransactions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/transactions`);
                console.log('Transacciones obtenidas:', response.data);
                setTransactions(response.data);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };

        fetchTransactions();
    }, []);

    const handleGenerateReport = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/generate-general-report`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'reporte_general.pdf');
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error('Error generating report:', error);
        }
    };

    return (
        <Container maxWidth="lg">
            <Box mt={5}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Transacciones Generales
                </Typography>
                <Button variant="contained" color="secondary" onClick={handleGenerateReport}>
                    Generar Informe
                </Button>
                <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID Transacción</TableCell>
                                <TableCell>ID Cliente</TableCell>
                                <TableCell>Fecha del Pedido</TableCell>
                                <TableCell>Descripción del Artículo</TableCell>
                                <TableCell>Cantidad</TableCell>
                                <TableCell>Precio Unitario</TableCell>
                                <TableCell>Precio Total</TableCell>
                                <TableCell>Saldo Pendiente</TableCell>
                                <TableCell>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {transactions.map((transaction) => (
                                <TableRow key={transaction.transaction_id}>
                                    <TableCell>{transaction.transaction_id}</TableCell>
                                    <TableCell>
                                        <Button onClick={() => navigate(`/clients/${transaction.client_id}`)}>
                                            {transaction.client_id}
                                        </Button>
                                    </TableCell>
                                    <TableCell>{transaction.order_date}</TableCell>
                                    <TableCell>{transaction.item_description}</TableCell>
                                    <TableCell>{transaction.quantity}</TableCell>
                                    <TableCell>{transaction.unit_price}</TableCell>
                                    <TableCell>{transaction.total_price}</TableCell>
                                    <TableCell>{transaction.pending_balance}</TableCell>
                                    <TableCell>
                                        <IconButton color="primary" onClick={() => navigate(`/add-transaction/${transaction.client_id}`)}>
                                            <AddIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Container>
    );
}

export default TransactionOverview;
