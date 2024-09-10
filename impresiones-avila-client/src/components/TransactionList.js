import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';

function TransactionList() {
    const { clientId } = useParams();
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/transactions/${clientId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log('Transacciones obtenidas:', response.data);
                setTransactions(response.data);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };

        fetchTransactions();
    }, [clientId]);

    const handleGenerateReport = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/generate-client-report/${clientId}`, {
                responseType: 'blob',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `reporte_cliente_${clientId}.pdf`);
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error('Error generating report:', error);
        }
    };

    return (
        <Container className="mt-8" style={{ backgroundColor: '#F3E5F5', borderRadius: '15px', padding: '20px' }}>
            <Box mt={5}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Transacciones del Cliente
                </Typography>
                <Button variant="contained" color="secondary" onClick={handleGenerateReport}>
                    Generar Informe
                </Button>
                <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID Transacción</TableCell>
                                <TableCell>Fecha del Pedido</TableCell>
                                <TableCell>Descripción del Artículo</TableCell>
                                <TableCell>Cantidad</TableCell>
                                <TableCell>Precio Unitario</TableCell>
                                <TableCell>Precio Total</TableCell>
                                <TableCell>Saldo Pendiente</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {transactions.map((transaction) => (
                                <TableRow key={transaction.transaction_id}>
                                    <TableCell>{transaction.transaction_id}</TableCell>
                                    <TableCell>{transaction.order_date}</TableCell>
                                    <TableCell>{transaction.item_description}</TableCell>
                                    <TableCell>{transaction.quantity}</TableCell>
                                    <TableCell>{transaction.unit_price}</TableCell>
                                    <TableCell>{transaction.total_price}</TableCell>
                                    <TableCell>{transaction.pending_balance}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Container>
    );
}

export default TransactionList;
