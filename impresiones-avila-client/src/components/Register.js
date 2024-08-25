import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Box, Paper, Avatar, Link, Grid, Alert } from '@mui/material';
import { LockOutlined as LockOutlinedIcon } from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

function Register() {
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [identificationType, setIdentificationType] = useState('');
    const [identificationNumber, setIdentificationNumber] = useState('');
    const [message, setMessage] = useState('');
    const [emailError, setEmailError] = useState('');
const [idError, setIdError] = useState('');

    const navigate = useNavigate();

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const validateIdNumber = (number) => {
        return /^\d+$/.test(number);
    };

    const validatePassword = (password) => {
        const minLength = 8;
        const hasNumber = /\d/;
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
    
        if (password.length < minLength) {
            return 'La contraseña debe tener al menos 8 caracteres.';
        } else if (!hasNumber.test(password)) {
            return 'La contraseña debe contener al menos un número.';
        } else if (!hasSpecialChar.test(password)) {
            return 'La contraseña debe contener al menos un carácter especial.';
        } else {
            return '';
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        const passwordError = validatePassword(password);
    if (passwordError) {
        setMessage(passwordError);
        return;
    }


        if (!username || !firstName || !lastName || !email || !password || !confirmPassword || !birthDate || !identificationType || !identificationNumber) {
            setMessage('Todos los campos son obligatorios');
            return;
        }

        if (!validateEmail(email)) {
            setEmailError('El formato del correo electrónico no es válido');
            return;
        } else {
            setEmailError('');
        }

        if (!validateIdNumber(identificationNumber)) {
            setIdError('El número de identificación debe contener solo números');
            return;
        } else {
            setIdError('');
        }
        if (password !== confirmPassword) {
            setMessage('Las contraseñas no coinciden');
            return;
        }
        try {
            const response = await axios.post('http://localhost:3001/register', {
                username,
                firstName,
                lastName,
                email,
                password,
                birthDate,
                identificationType,
                identificationNumber
            });

            if (response.data.success) {
                navigate('/login');
            } else {
                setMessage(response.data.message);
            }
        } catch (error) {
            setMessage('Error en el proceso de registro');
        }
    };

    return (
        <Grid container component="main" className="min-h-screen">
            <Grid item xs={false} sm={4} md={7} className="hidden sm:block">
                <Box
                    className="h-full"
                    sx={{
                        backgroundImage: `url(/images/register.jpg)`,
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: (t) =>
                            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        position: 'relative',
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            color: 'white',
                            textAlign: 'center',
                        }}
                    >
                        <Typography variant="h3" component="h1" gutterBottom>
                            ¡Únete a nosotros!
                        </Typography>
                        <Typography variant="h6" component="p">
                            Crea una cuenta para empezar.
                        </Typography>
                    </Box>
                </Box>
            </Grid>
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                <Box
                    sx={{
                        my: 8,
                        mx: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '100vh',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Registrarse
                    </Typography>
                    <Box component="form" onSubmit={handleRegister} noValidate sx={{ mt: 1 }}>
                        {message && <Alert severity="error">{message}</Alert>}
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Nombre de Usuario"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
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
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Nombre"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
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
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Apellido"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
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
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Correo Electrónico"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Fecha de Nacimiento"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={birthDate}
                            onChange={(e) => setBirthDate(e.target.value)}
                            sx={{
                                borderRadius: '20px',
                                '& .MuiOutlinedInput-input': {
                                    padding: '10px 14px',
                                },
                            }}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Tipo de Identificación"
                            value={identificationType}
                            onChange={(e) => setIdentificationType(e.target.value)}
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
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Número de Identificación"
                            value={identificationNumber}
                            onChange={(e) => setIdentificationNumber(e.target.value)}
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
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Contraseña"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Confirmar Contraseña"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                        <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2, borderRadius: '20px', bgcolor: 'purple', color: 'white' }}>
                            Registrarse
                        </Button>
                        <Grid container justifyContent="space-between">
                            <Grid item>
                                <Link component={RouterLink} to="/login" variant="body2" style={{ color: 'purple' }}>
                                    {"¿Ya tienes una cuenta? Inicia sesión aquí"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
}

export default Register;
