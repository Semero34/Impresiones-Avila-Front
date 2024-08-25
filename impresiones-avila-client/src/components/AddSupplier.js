import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, Box, TextField, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function AddSupplier() {
    const [name, setName] = useState('');
    const [contact, setContact] = useState('');
    const [address, setAddress] = useState('');
    const [paymentTerms, setPaymentTerms] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3001/suppliers', 
                { name, contact, address, payment_terms: paymentTerms }, 
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}` // Asegúrate de enviar el token
                    }
                }
            );
            navigate('/suppliers');
        } catch (error) {
            console.error('Error adding supplier:', error);
        }
    };

    return (
        <Container maxWidth="sm" className="min-h-screen flex items-center justify-center">
            <Paper elevation={6} className="p-8 rounded-lg">
                <Box mb={5} textAlign="center">
                    <Typography variant="h4" component="h1" gutterBottom>
                        Agregar Proveedor
                    </Typography>
                </Box>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <TextField
                        label="Nombre"
                        fullWidth
                        margin="normal"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        variant="outlined"
                        InputLabelProps={{
                            shrink: true,
                            sx: {
                                top: '8px',
                                left: '12px',
                            },
                        }}
                        InputProps={{
                            sx: {
                                borderRadius: '20px',
                            },
                        }}
                    />
                    <TextField
                        label="Contacto"
                        fullWidth
                        margin="normal"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        variant="outlined"
                        InputLabelProps={{
                            shrink: true,
                            sx: {
                                top: '8px',
                                left: '12px',
                            },
                        }}
                        InputProps={{
                            sx: {
                                borderRadius: '20px',
                            },
                        }}
                    />
                    <TextField
                        label="Dirección"
                        fullWidth
                        margin="normal"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        variant="outlined"
                        InputLabelProps={{
                            shrink: true,
                            sx: {
                                top: '8px',
                                left: '12px',
                            },
                        }}
                        InputProps={{
                            sx: {
                                borderRadius: '20px',
                            },
                        }}
                    />
                    <TextField
                        label="Términos de Pago"
                        fullWidth
                        margin="normal"
                        value={paymentTerms}
                        onChange={(e) => setPaymentTerms(e.target.value)}
                        variant="outlined"
                        InputLabelProps={{
                            shrink: true,
                            sx: {
                                top: '8px',
                                left: '12px',
                            },
                        }}
                        InputProps={{
                            sx: {
                                borderRadius: '20px',
                            },
                        }}
                    />
                    <Button 
                        type="submit" 
                        variant="contained" 
                        color="primary" 
                        fullWidth 
                        sx={{ 
                            mt: 2, 
                            mb: 2, 
                            bgcolor: 'purple', 
                            color: 'white', 
                            borderRadius: '20px' 
                        }}
                    >
                        Agregar
                    </Button>
                </form>
            </Paper>
        </Container>
    );
}

export default AddSupplier;
