import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Box, Paper, LinearProgress, CircularProgress } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import LockResetIcon from '@mui/icons-material/LockReset';

function ResetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const { token } = useParams();
    const navigate = useNavigate();

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        evaluatePasswordStrength(newPassword);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const evaluatePasswordStrength = (password) => {
        const strength = password.length > 8 ? 100 : (password.length / 8) * 100;
        setPasswordStrength(strength);
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage('Las contraseñas no coinciden');
            return;
        }
        if (passwordStrength < 50) {
            setMessage('La contraseña es demasiado débil');
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/reset-password/${token}`, { password });
            setMessage(response.data.message || 'Contraseña restablecida con éxito');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            setMessage('Error al restablecer la contraseña');
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
                padding: '20px',
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
                    <LockResetIcon sx={{ fontSize: 40, color: '#6A1B9A', marginBottom: '10px' }} />
                    <Typography
                        component="h1"
                        variant="h5"
                        sx={{ fontWeight: 'bold', color: '#6A1B9A', marginBottom: '1rem', textAlign: 'center' }}
                    >
                        Restablecer Contraseña
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{ color: '#6A1B9A', marginBottom: '2rem', textAlign: 'center' }}
                    >
                        Introduce una nueva contraseña para tu cuenta y confírmala.
                    </Typography>
                    <Box component="form" onSubmit={handleResetPassword} noValidate sx={{ mt: 1, width: '100%' }}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Nueva Contraseña"
                            type="password"
                            value={password}
                            onChange={handlePasswordChange}
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
                        />
                        <LinearProgress
                            variant="determinate"
                            value={passwordStrength}
                            sx={{
                                height: '8px',
                                borderRadius: '5px',
                                marginBottom: '20px',
                                backgroundColor: '#f0f0f0',
                                '& .MuiLinearProgress-bar': {
                                    backgroundColor: passwordStrength < 50 ? '#f44336' : passwordStrength < 75 ? '#ff9800' : '#4caf50',
                                },
                            }}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Confirmar Contraseña"
                            type="password"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
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
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            disabled={loading || password !== confirmPassword || passwordStrength < 50}
                        >
                            {loading ? <CircularProgress size={24} style={{ color: 'white' }} /> : 'Restablecer Contraseña'}
                        </Button>
                        {message && (
                            <Typography
                                sx={{
                                    color: message.includes('Error') || message.includes('no coinciden') ? 'error.main' : 'primary.main',
                                    marginTop: '1.5rem',
                                    textAlign: 'center',
                                }}
                            >
                                {message}
                            </Typography>
                        )}
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}

export default ResetPassword;
