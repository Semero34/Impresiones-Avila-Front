import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box, Paper } from '@mui/material';

function AddTransaction() {
    const { clientId } = useParams();
    const navigate = useNavigate();
    const [order_date, setOrderDate] = useState('');
    const [item_description, setItemDescription] = useState('');
    const [quantity, setQuantity] = useState('');
    const [unit_price, setUnitPrice] = useState('');
    const [message, setMessage] = useState('');

    const handleAddTransaction = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3001/transactions', { client_id: clientId, order_date, item_description, quantity, unit_price });
            setMessage('Transaction added successfully');
            setOrderDate('');
            setItemDescription('');
            setQuantity('');
            setUnitPrice('');
            navigate(`/transactions/${clientId}`);
        } catch (error) {
            setMessage('Failed to add transaction');
            console.error('Error adding transaction:', error);
        }
    };

    return (
        <Container maxWidth="sm" className="min-h-screen flex items-center justify-center">
            <Paper elevation={6} className="p-8 rounded-lg">
                <Box mb={5} textAlign="center">
                    <Typography variant="h4" component="h1" gutterBottom>
                        Agregar Transacción para Cliente ID: {clientId}
                    </Typography>
                </Box>
                <form onSubmit={handleAddTransaction} className="space-y-4">
                    <TextField
                        fullWidth
                        label="Fecha del Pedido"
                        type="date"
                        value={order_date}
                        onChange={(e) => setOrderDate(e.target.value)}
                        variant="outlined"
                        InputLabelProps={{ shrink: true, sx: { top: '8px', left: '12px' } }}
                        InputProps={{ sx: { borderRadius: '20px' } }}
                    />
                    <TextField
                        fullWidth
                        label="Descripción del Artículo"
                        value={item_description}
                        onChange={(e) => setItemDescription(e.target.value)}
                        variant="outlined"
                        InputLabelProps={{ shrink: true, sx: { top: '8px', left: '12px' } }}
                        InputProps={{ sx: { borderRadius: '20px' } }}
                    />
                    <TextField
                        fullWidth
                        label="Cantidad"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        variant="outlined"
                        InputLabelProps={{ shrink: true, sx: { top: '8px', left: '12px' } }}
                        InputProps={{ sx: { borderRadius: '20px' } }}
                    />
                    <TextField
                        fullWidth
                        label="Precio Unitario"
                        value={unit_price}
                        onChange={(e) => setUnitPrice(e.target.value)}
                        variant="outlined"
                        InputLabelProps={{ shrink: true, sx: { top: '8px', left: '12px' } }}
                        InputProps={{ sx: { borderRadius: '20px' } }}
                    />
                    <Button 
                        variant="contained" 
                        color="primary" 
                        type="submit" 
                        fullWidth 
                        sx={{ 
                            mt: 2, 
                            mb: 2, 
                            bgcolor: 'purple', 
                            color: 'white', 
                            borderRadius: '20px' 
                        }}
                    >
                        Agregar Transacción
                    </Button>
                </form>
                {message && <Typography color={message.includes('successfully') ? 'primary' : 'error'} variant="body2" style={{ marginTop: '20px' }}>{message}</Typography>}
            </Paper>
        </Container>
    );
}

export default AddTransaction;
