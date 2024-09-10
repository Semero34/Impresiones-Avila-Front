import React from 'react';
import { useLocation } from 'react-router-dom';
import { Typography, Paper, Container, Box } from '@mui/material';

function Confirmation() {
    const location = useLocation();
    const { transactionId, cartItems, total, paymentMethod } = location.state;

    return (
        <Container maxWidth="md">
            <Paper elevation={3} style={{ padding: '2rem', marginTop: '2rem' }}>
                <Typography variant="h4" gutterBottom>
                    ¡Gracias por tu compra!
                </Typography>
                <Typography variant="h6" gutterBottom>
                    ID de Transacción: {transactionId}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Método de Pago: {paymentMethod === 'card' ? 'Tarjeta de Crédito/Débito' : paymentMethod}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Total: ${total.toFixed(2)}
                </Typography>
                <Box mt={3}>
                    <Typography variant="h6" gutterBottom>
                        Resumen de la Orden:
                    </Typography>
                    {cartItems.map((item, index) => (
                        <Typography key={index} variant="body1">
                            {item.name} - Cantidad: {item.quantity} - Precio: ${item.price.toFixed(2)}
                        </Typography>
                    ))}
                </Box>
            </Paper>
        </Container>
    );
}

export default Confirmation;