import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Box, Paper, CircularProgress, InputAdornment } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(false);
        try {
            const response = await axios.post('${process.env.REACT_APP_API_URL}/forgot-password', { email });
            setMessage(response.data.message);
        } catch (error) {
            setMessage('Error al enviar el correo de restablecimiento');
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Container component="main" maxWidth="xs">
                <Paper
                    elevation={12}
                    sx={{
                        padding: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        borderRadius: '15px',
                        boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.1)',
                        background: 'white',
                    }}
                >
                    <Typography
                        component="h1"
                        variant="h5"
                        sx={{ fontWeight: 'bold', color: '#6A1B9A', marginBottom: '1rem', textAlign: 'center' }}
                    >
                        ¿Olvidaste tu Contraseña?
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{ marginBottom: '2rem', color: '#6A1B9A', textAlign: 'center', fontSize: '16px' }}
                    >
                        Introduce tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
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
                            sx={{
                                marginBottom: '1.5rem',
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '25px',
                                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                                    '&:hover fieldset': {
                                        borderColor: '#6A1B9A',
                                    },
                                },
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailIcon sx={{ color: '#6A1B9A' }} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{
                                backgroundColor: '#6A1B9A',
                                color: 'white',
                                fontWeight: 'bold',
                                padding: '10px',
                                borderRadius: '25px',
                                boxShadow: '0px 10px 20px rgba(106, 27, 154, 0.4)',
                                transition: 'transform 0.3s',
                                '&:hover': {
                                    backgroundColor: '#4A148C',
                                    transform: 'translateY(-3px)',
                                },
                            }}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} style={{ color: 'white' }} /> : 'Enviar Correo'}
                        </Button>
                        {message && (
                            <Typography color={error ? 'error' : 'primary'} sx={{ marginTop: '1.5rem', textAlign: 'center' }}>
                                {message}
                            </Typography>
                        )}
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}

export default ForgotPassword;
