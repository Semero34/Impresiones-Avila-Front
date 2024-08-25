import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Box, TextField, Button, Paper } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

function EditSupplier() {
    const { id } = useParams();
    const [name, setName] = useState('');
    const [contact, setContact] = useState('');
    const [address, setAddress] = useState('');
    const [paymentTerms, setPaymentTerms] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSupplier = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:3001/suppliers/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const supplier = response.data;
                setName(supplier.name);
                setContact(supplier.contact);
                setAddress(supplier.address);
                setPaymentTerms(supplier.payment_terms);
            } catch (error) {
                setMessage('Error fetching supplier data');
                console.error('Error fetching supplier:', error);
            }
        };
        fetchSupplier();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:3001/suppliers/${id}`, { name, contact, address, payment_terms: paymentTerms }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setMessage('Supplier updated successfully');
            navigate('/suppliers');
        } catch (error) {
            setMessage('Failed to update supplier');
            console.error('Error updating supplier:', error);
        }
    };

    return (
        <Container maxWidth="sm" className="min-h-screen flex items-center justify-center">
            <Paper elevation={6} className="p-8 rounded-lg">
                <Box mb={5} textAlign="center">
                    <Typography variant="h4" component="h1" gutterBottom>
                        Editar Proveedor
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
                        Guardar
                    </Button>
                </form>
                {message && <Typography color={message.includes('successfully') ? 'primary' : 'error'} variant="body2" style={{ marginTop: '20px' }}>{message}</Typography>}
            </Paper>
        </Container>
    );
}

export default EditSupplier;
