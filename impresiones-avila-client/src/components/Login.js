import React, { useState } from 'react';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import { Link, useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Alert, Avatar, Box, Grid, Paper, FormControlLabel, Checkbox } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {jwtDecode} from 'jwt-decode'; // Corregido
import 'tailwindcss/tailwind.css';

const Login = ({ setUser }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleGoogleSuccess = async (response) => {
        try {
            const tokenId = response.credential;
            const result = await axios.post('${process.env.REACT_APP_API_URL}/google-login', { token: tokenId });
            if (result.data.success) {
                const token = result.data.token;
                localStorage.setItem('token', token);
                setUser(jwtDecode(token));
                navigate('/');
            }
        } catch (error) {
            setError('Error al iniciar sesión con Google');
        }
    };

    const handleGoogleFailure = (error) => {
        console.log('Error en Google Login', error);
        setError('Falló el inicio de sesión con Google');
    };

    const validateForm = () => {
        if (!username || !password) {
            setError('Nombre de usuario y contraseña son obligatorios');
            return false;
        }
        return true;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm()) return;

        try {
            const response = await axios.post('${process.env.REACT_APP_API_URL}/login', { username, password });
            const data = response.data;
            if (data.success) {
                const token = data.token;
                localStorage.setItem('token', token);
                setUser(jwtDecode(token));
                navigate('/');
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
                        backgroundSize: 'cover',
                    }}
                />
            </Grid>
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                <Box sx={{ my: 8, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Iniciar sesión
                    </Typography>
                    {error && <Alert severity="error">{error}</Alert>}
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Nombre de usuario"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
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
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2, bgcolor: 'purple' }}
                        >
                            Iniciar sesión
                        </Button>

                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={handleGoogleFailure}
                        />

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
