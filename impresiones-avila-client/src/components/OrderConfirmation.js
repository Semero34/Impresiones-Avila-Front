import React from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Typography, Box, Grid, Paper } from '@mui/material';

const OrderConfirmation = () => {
    const location = useLocation();
    const { invoiceId, clientInfo, cartItems = [], total, paymentMethod } = location.state || {};  // Defaulting cartItems to an empty array

    return (
        <Container maxWidth="lg" className="mt-12 mb-12">
            <Box className="text-center mb-8">
                <Typography variant="h3" className="font-bold">
                    Confirmación de Orden
                </Typography>
            </Box>
            <Paper elevation={4} className="p-8 rounded-lg">
                <Typography variant="h5" className="text-center mb-4">
                    ¡Gracias por tu compra! Tu orden ha sido confirmada.
                </Typography>
                <Grid container spacing={6}>
                    <Grid item xs={12} md={6}>
                        <Box className="mb-8">
                            <Typography variant="h6" gutterBottom>
                                Número de Orden
                            </Typography>
                            <Typography variant="body1">
                                #{invoiceId}
                            </Typography>
                        </Box>
                        <Box className="mb-8">
                            <Typography variant="h6" gutterBottom>
                                Resumen de la Orden
                            </Typography>
                            {cartItems.length > 0 ? (
                                cartItems.map((item, index) => (
                                    <Typography key={index} variant="body1">
                                        {item.name} - Cantidad: {item.quantity}
                                    </Typography>
                                ))
                            ) : (
                                <Typography variant="body2">No hay artículos en el resumen.</Typography>
                            )}
                            <Typography variant="body1">
                                Subtotal: ${total}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box className="mb-8">
                            <Typography variant="h6" gutterBottom>
                                Detalles de Envío
                            </Typography>
                            <Typography variant="body1">
                                Dirección: {clientInfo?.address || 'N/A'}
                            </Typography>
                            <Typography variant="body1">
                                Método de Envío: Envío Estándar
                            </Typography>
                        </Box>
                        <Box className="mb-8">
                            <Typography variant="h6" gutterBottom>
                                Detalles del Pago
                            </Typography>
                            <Typography variant="body1">
                                Método de Pago: {paymentMethod || 'N/A'}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
                <Box className="text-center mt-8">
                    <Typography variant="body2" color="textSecondary">
                        Si tienes alguna pregunta sobre tu orden, por favor contacta a nuestro servicio al cliente.
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default OrderConfirmation;
