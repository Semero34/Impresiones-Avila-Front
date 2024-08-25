import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, Paper, Grid } from '@mui/material';

const OrderDetails = () => {
    const { orderId } = useParams();
    const [orderDetails, setOrderDetails] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get(`http://localhost:3001/admin/orders/${orderId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            setOrderDetails(response.data);
        })
        .catch(error => {
            console.error('Error fetching order details:', error);
            setError('Error fetching order details.');
        });
    }, [orderId]);

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    if (!orderDetails) {
        return <Typography>Cargando detalles de la orden...</Typography>;
    }

    return (
        <Container maxWidth="lg" className="mt-12 mb-12">
            <Box className="text-center mb-8">
                <Typography variant="h3" className="font-bold">
                    Detalles de la Orden
                </Typography>
            </Box>
            <Paper elevation={4} className="p-8 rounded-lg">
                <Typography variant="h5" className="text-center mb-4">
                    Orden #{orderDetails.order_id}
                </Typography>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Box className="mb-8">
                            <Typography variant="h6" gutterBottom>
                                Información del Cliente
                            </Typography>
                            <Typography variant="body1"><strong>Nombre:</strong> {orderDetails.client_name}</Typography>
                            <Typography variant="body1"><strong>Dirección:</strong> {orderDetails.address}</Typography>
                            <Typography variant="body1"><strong>Email:</strong> {orderDetails.email}</Typography>
                            <Typography variant="body1"><strong>Teléfono:</strong> {orderDetails.phone_number}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box className="mb-8">
                            <Typography variant="h6" gutterBottom>
                                Detalles de la Orden
                            </Typography>
                            <Typography variant="body1"><strong>Total:</strong> ${orderDetails.total_amount}</Typography>
                            <Typography variant="body1"><strong>Estado:</strong> {orderDetails.status}</Typography>
                            <Typography variant="body1"><strong>Fecha de la Orden:</strong> {orderDetails.order_date}</Typography>
                        </Box>
                    </Grid>
                </Grid>
                <Box className="mb-8">
                    <Typography variant="h6" gutterBottom>
                        Productos
                    </Typography>
                    {orderDetails.items.map((item, index) => (
                        <Box key={index} mb={2}>
                            <Typography variant="body1"><strong>Producto:</strong> {item.product_name}</Typography>
                            <Typography variant="body2">Descripción: {item.description}</Typography>
                            <Typography variant="body2">Cantidad: {item.quantity}</Typography>
                            <Typography variant="body2">Precio Unitario: ${item.unit_price}</Typography>
                        </Box>
                    ))}
                </Box>
            </Paper>
        </Container>
    );
};

export default OrderDetails;
