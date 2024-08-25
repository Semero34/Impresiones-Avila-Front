import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Box, Paper } from '@mui/material';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/forgot-password', { email });
            setMessage(response.data.message);
        } catch (error) {
            setMessage('Error al enviar el correo de restablecimiento');
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} sx={{ padding: 4, mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">
                    Olvidaste tu Contraseña
                </Typography>
                <Box component="form" onSubmit={handleForgotPassword} noValidate sx={{ mt: 1 }}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Correo Electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2 }}>
                        Enviar Correo
                    </Button>
                    {message && <Typography color="error">{message}</Typography>}
                </Box>
            </Paper>
        </Container>
    );
}

export default ForgotPassword;
