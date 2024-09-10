import React, { useState } from 'react';
import { Container, TextField, Button, Alert, Box, Typography, Grid, Paper, Divider, LinearProgress, InputAdornment } from '@mui/material';
import { Percent, CalendarToday, People, ConfirmationNumber } from '@mui/icons-material';
import axios from 'axios';
import 'tailwindcss/tailwind.css';

// Función para generar un código de cupón aleatorio
const generateRandomCode = (length = 8) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

function CreateCoupon() {
    const [discount, setDiscount] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [usageLimit, setUsageLimit] = useState('');
    const [quantity, setQuantity] = useState(1); // Campo para la cantidad de cupones a generar
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('success');
    const [generatedCoupons, setGeneratedCoupons] = useState([]); // Estado para almacenar los cupones generados

    const handleCreateCoupons = async () => {
        const coupons = [];
        for (let i = 0; i < quantity; i++) {
            const code = generateRandomCode(); // Generar código aleatorio
            coupons.push({ code, discount, expiration_date: expirationDate, usage_limit: usageLimit || null });
        }

        try {
            // Enviar los cupones generados al servidor
            await axios.post('/admin/coupons/batch', { coupons });
            setAlertMessage(`${quantity} cupones creados exitosamente`);
            setAlertType('success');
            setGeneratedCoupons(coupons); // Guardar cupones generados para mostrarlos
        } catch (error) {
            setAlertMessage('Error al crear los cupones');
            setAlertType('error');
        }
        setTimeout(() => setAlertMessage(''), 3000);
    };

    return (
        <Container maxWidth="md" className="py-16">
            <Paper
                elevation={12}
                className="p-10 rounded-3xl shadow-2xl"
                style={{
                    backgroundColor: '#f9fafb',
                    borderRadius: '20px',
                    transition: 'box-shadow 0.3s ease-in-out',
                    transform: 'translateY(0)',
                    '&:hover': {
                        boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.2)',
                        transform: 'translateY(-3px)',
                    },
                }}
            >
                <Typography variant="h3" fontWeight="bold" align="center" gutterBottom className="text-gray-900">
                    Crear Cupones
                </Typography>

                {alertMessage && (
                    <Alert severity={alertType} className="mb-4">
                        {alertMessage}
                    </Alert>
                )}

                <Divider className="mb-8" />

                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Descuento (%)"
                            fullWidth
                            type="number"
                            value={discount}
                            onChange={(e) => setDiscount(e.target.value)}
                            className="mb-4"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Percent />
                                    </InputAdornment>
                                ),
                                style: {
                                    fontSize: '1.4rem',
                                    padding: '14px',
                                    backgroundColor: '#F3F4F6',
                                    borderRadius: '10px',
                                    boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)',
                                },
                            }}
                            InputLabelProps={{
                                style: { fontSize: '1.2rem', fontWeight: 'bold', color: '#374151' },
                            }}
                            variant="outlined"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    transition: 'box-shadow 0.3s ease',
                                    '&:hover': {
                                        boxShadow: '0 0 5px rgba(109, 40, 217, 0.5)', // Sombra morada
                                    },
                                    '&.Mui-focused': {
                                        boxShadow: '0 0 8px rgba(109, 40, 217, 0.8)', // Sombra más intensa al hacer foco
                                        borderColor: '#6D28D9', // Color morado
                                    },
                                },
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Fecha de expiración"
                            fullWidth
                            type="date"
                            value={expirationDate}
                            onChange={(e) => setExpirationDate(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <CalendarToday />
                                    </InputAdornment>
                                ),
                                style: {
                                    fontSize: '1.4rem',
                                    padding: '14px',
                                    backgroundColor: '#F3F4F6',
                                    borderRadius: '10px',
                                    boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)',
                                },
                            }}
                            InputLabelProps={{
                                shrink: true,
                                style: { fontSize: '1.2rem', fontWeight: 'bold', color: '#374151' },
                            }}
                            className="mb-4"
                            variant="outlined"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    transition: 'box-shadow 0.3s ease',
                                    '&:hover': {
                                        boxShadow: '0 0 5px rgba(109, 40, 217, 0.5)', // Sombra morada
                                    },
                                    '&.Mui-focused': {
                                        boxShadow: '0 0 8px rgba(109, 40, 217, 0.8)', // Sombra más intensa al hacer foco
                                        borderColor: '#6D28D9', // Color morado
                                    },
                                },
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Límite de uso (opcional)"
                            fullWidth
                            type="number"
                            value={usageLimit}
                            onChange={(e) => setUsageLimit(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <People />
                                    </InputAdornment>
                                ),
                                style: {
                                    fontSize: '1.4rem',
                                    padding: '14px',
                                    backgroundColor: '#F3F4F6',
                                    borderRadius: '10px',
                                    boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)',
                                },
                            }}
                            InputLabelProps={{
                                style: { fontSize: '1.2rem', fontWeight: 'bold', color: '#374151' },
                            }}
                            variant="outlined"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    transition: 'box-shadow 0.3s ease',
                                    '&:hover': {
                                        boxShadow: '0 0 5px rgba(109, 40, 217, 0.5)', // Sombra morada
                                    },
                                    '&.Mui-focused': {
                                        boxShadow: '0 0 8px rgba(109, 40, 217, 0.8)', // Sombra más intensa al hacer foco
                                        borderColor: '#6D28D9', // Color morado
                                    },
                                },
                            }}
                            className="mb-4"
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Cantidad de cupones"
                            fullWidth
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <ConfirmationNumber />
                                    </InputAdornment>
                                ),
                                style: {
                                    fontSize: '1.4rem',
                                    padding: '14px',
                                    backgroundColor: '#F3F4F6',
                                    borderRadius: '10px',
                                    boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)',
                                },
                            }}
                            InputLabelProps={{
                                style: { fontSize: '1.2rem', fontWeight: 'bold', color: '#374151' },
                            }}
                            variant="outlined"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    transition: 'box-shadow 0.3s ease',
                                    '&:hover': {
                                        boxShadow: '0 0 5px rgba(109, 40, 217, 0.5)', // Sombra morada
                                    },
                                    '&.Mui-focused': {
                                        boxShadow: '0 0 8px rgba(109, 40, 217, 0.8)', // Sombra más intensa al hacer foco
                                        borderColor: '#6D28D9', // Color morado
                                    },
                                },
                            }}
                            className="mb-8"
                        />
                    </Grid>
                </Grid>

                {/* Barra de progreso visual */}
                <Box mt={4}>
                    <Typography variant="body1" className="mb-2">
                        Progreso de creación de cupones
                    </Typography>
                    <LinearProgress
                        variant="determinate"
                        value={(generatedCoupons.length / quantity) * 100}
                        style={{ height: '10px', borderRadius: '5px', backgroundColor: '#E5E7EB' }}
                    />
                </Box>

                <Button
                    variant="contained"
                    fullWidth
                    onClick={handleCreateCoupons}
                    style={{
                        backgroundColor: '#6D28D9', // Color morado sólido
                        color: 'white',
                        fontWeight: 'bold',
                        padding: '18px',
                        fontSize: '1.3rem',
                        borderRadius: '16px',
                        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
                    }}
                    className="transform hover:scale-105 transition-transform"
                >
                    Crear Cupones
                </Button>

                {/* Mostrar los cupones generados */}
                {generatedCoupons.length > 0 && (
                    <Box mt={6} p={4} className="bg-white rounded-xl shadow-md">
                        <Typography variant="h5" fontWeight="bold" className="text-gray-900 mb-4">
                            Cupones Generados:
                        </Typography>
                        <ul className="list-disc pl-6">
                            {generatedCoupons.map((coupon, index) => (
                                <li key={index} className="text-gray-700 text-lg mb-2">
                                    Código: <strong className="text-purple-600">{coupon.code}</strong> - Descuento: {coupon.discount}% - Vence: {coupon.expiration_date}
                                </li>
                            ))}
                        </ul>
                    </Box>
                )}
            </Paper>
        </Container>
    );
}

export default CreateCoupon;
