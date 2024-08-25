import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Box, Paper } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

function ResetPassword() {
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const { token } = useParams();
    const navigate = useNavigate();

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:3001/reset-password/${token}`, { password });
            if (response.data.message) {
                setMessage(response.data.message);
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
        } catch (error) {
            setMessage('Error al restablecer la contraseña');
        }
    };    

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} sx={{ padding: 4, mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">
                    Restablecer Contraseña
                </Typography>
                <Box component="form" onSubmit={handleResetPassword} noValidate sx={{ mt: 1 }}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Nueva Contraseña"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2 }}>
                        Restablecer Contraseña
                    </Button>
                    {message && <Typography color="error">{message}</Typography>}
                </Box>
            </Paper>
        </Container>
    );
}

export default ResetPassword;
