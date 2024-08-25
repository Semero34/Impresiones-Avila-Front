import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Alert, Avatar, Box, Grid, Paper, FormControlLabel, Checkbox } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { jwtDecode } from 'jwt-decode';
import 'tailwindcss/tailwind.css';

const Login = ({ setUser }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();

    const validateForm = () => {
        let valid = true;
        if (!username) {
            setUsernameError('El nombre de usuario es obligatorio');
            valid = false;
        } else {
            setUsernameError('');
        }
        if (!password) {
            setPasswordError('La contraseña es obligatoria');
            valid = false;
        } else {
            setPasswordError('');
        }
        return valid;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm()) return;
        
        try {
            const response = await axios.post('http://localhost:3001/login', { username, password });
            const data = response.data;
            if (data.success) {
                const token = data.token;
                localStorage.setItem('token', token);

                // Decode the JWT token to extract user_id and role
                const decodedToken = jwtDecode(token);
                const user = {
                    user_id: decodedToken.id,
                    role: decodedToken.role,
                };

                // Set the user in the application state or context
                setUser(user);

                // Redirect based on the role
                if (user.role === 'admin') {
                    navigate('/admin-dashboard');
                } else {
                    navigate('/');
                }
            } else {
                setError('Nombre de usuario o contraseña incorrectos');
            }
        } catch (err) {
            setError('Ocurrió un error. Por favor, inténtelo de nuevo.');
        }
    };

    return (
        <Grid container component="main" className="min-h-screen">
            <Grid item xs={false} sm={4} md={7} className="hidden sm:block">
                <Box
                    className="h-full"
                    sx={{
                        backgroundImage: `url(/images/bg-sign-in-basic.jpeg)`,
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
                            ¡Bienvenido de nuevo!
                        </Typography>
                        <Typography variant="h6" component="p">
                            Por favor, inicia sesión en tu cuenta.
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
                        Iniciar sesión
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        {error && <Alert severity="error">{error}</Alert>}
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Nombre de usuario"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            error={Boolean(usernameError)}
                            helperText={usernameError}
                            InputProps={{
                                sx: { borderRadius: '20px' },
                            }}
                            InputLabelProps={{
                                shrink: true,
                                sx: { top: '8px', left: '12px' },
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
                            error={Boolean(passwordError)}
                            helperText={passwordError}
                            InputProps={{
                                sx: { borderRadius: '20px' },
                            }}
                            InputLabelProps={{
                                shrink: true,
                                sx: { top: '8px', left: '12px' },
                            }}
                        />
                        <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                            <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Recuérdame" />
                            <Link to="/forgot-password" style={{ color: 'grey', fontSize: '0.875rem' }}>¿Olvidaste tu contraseña?</Link>
                        </Box>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{ mt: 3, mb: 2, bgcolor: 'purple', color: 'white', borderRadius: '20px' }}
                        >
                            Iniciar sesión
                        </Button>
                        <Grid container justifyContent="space-between">
                            <Grid item>
                                <Link to="/register" variant="body2" style={{ color: 'purple' }}>
                                    {"¿No tienes una cuenta? Regístrate"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
};

export default Login;
