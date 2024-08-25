import React, { useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, Box, Paper, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AddClient = () => {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [contactInfo, setContactInfo] = useState('');
    const [clientType, setClientType] = useState('');
    const [pendingBalance, setPendingBalance] = useState('');
    const [identificationNumber, setIdentificationNumber] = useState('');
    const [email, setEmail] = useState('');
    const [identificationType, setIdentificationType] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};
        if (!name) newErrors.name = 'El nombre es requerido';
        if (!address) newErrors.address = 'La dirección es requerida';
        if (!email) {
            newErrors.email = 'El correo es requerido';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'El correo no es válido';
        }
        if (!identificationNumber) newErrors.identificationNumber = 'El número de cédula es requerido';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:3001/clients', {
                name,
                address,
                contact_info: contactInfo,
                client_type: clientType,
                pending_balance: pendingBalance,
                identification_number: identificationNumber,
                email,
                identification_type: identificationType
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            navigate('/clientes');
        } catch (error) {
            console.error('Error adding client:', error);
        }
    };

    return (
        <Container maxWidth="sm" className="min-h-screen flex items-center justify-center">
            <Paper elevation={6} className="p-8 rounded-lg" sx={{ bgcolor: '#f5f5f5', boxShadow: '0px 0px 15px rgba(128, 0, 128, 0.2)' }}>
                <Box mb={5} textAlign="center">
                    <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#4A007E' }}>
                        Agregar Cliente
                    </Typography>
                </Box>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Nombre"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                        error={!!errors.name}
                        helperText={errors.name}
                        InputLabelProps={{ shrink: true }}
                        InputProps={{ sx: { borderRadius: '20px' } }}
                    />
                    <TextField
                        label="Dirección"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                        error={!!errors.address}
                        helperText={errors.address}
                        InputLabelProps={{ shrink: true }}
                        InputProps={{ sx: { borderRadius: '20px' } }}
                    />
                    <TextField
                        label="Información de Contacto"
                        value={contactInfo}
                        onChange={(e) => setContactInfo(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                        InputLabelProps={{ shrink: true }}
                        InputProps={{ sx: { borderRadius: '20px' } }}
                    />
                    <FormControl fullWidth margin="normal" variant="outlined">
                        <InputLabel>Tipo de Cliente</InputLabel>
                        <Select
                            value={clientType}
                            onChange={(e) => setClientType(e.target.value)}
                            required
                            label="Tipo de Cliente"
                            sx={{ borderRadius: '20px' }}
                        >
                            <MenuItem value="Individual">Individual</MenuItem>
                            <MenuItem value="Empresa">Empresa</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        label="Saldo Pendiente"
                        type="number"
                        value={pendingBalance}
                        onChange={(e) => setPendingBalance(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                        InputLabelProps={{ shrink: true }}
                        InputProps={{ sx: { borderRadius: '20px' } }}
                    />
                    <TextField
                        label="Número de Cédula"
                        value={identificationNumber}
                        onChange={(e) => setIdentificationNumber(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                        error={!!errors.identificationNumber}
                        helperText={errors.identificationNumber}
                        InputLabelProps={{ shrink: true }}
                        InputProps={{ sx: { borderRadius: '20px' } }}
                    />
                    <TextField
                        label="Correo Electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                        error={!!errors.email}
                        helperText={errors.email}
                        InputLabelProps={{ shrink: true }}
                        InputProps={{ sx: { borderRadius: '20px' } }}
                    />
                    <TextField
                        label="Tipo de Cédula"
                        value={identificationType}
                        onChange={(e) => setIdentificationType(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                        InputLabelProps={{ shrink: true }}
                        InputProps={{ sx: { borderRadius: '20px' } }}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{ mt: 3, bgcolor: '#8E24AA', color: 'white', borderRadius: '20px', '&:hover': { bgcolor: '#7B1FA2' } }}
                    >
                        Agregar Cliente
                    </Button>
                </form>
            </Paper>
        </Container>
    );
};

export default AddClient;
