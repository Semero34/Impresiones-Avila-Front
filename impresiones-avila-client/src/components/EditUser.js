import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box, Paper, FormControl, InputLabel, Select, MenuItem, Alert } from '@mui/material';

function EditUser() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('user');
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const user = response.data;
                setUsername(user.username);
                setEmail(user.email);
                setRole(user.role);
            } catch (error) {
                setMessage('Error fetching user data');
                console.error('Error fetching user:', error);
            }
        };
        fetchUser();
    }, [id]);

    const handleEditUser = async (e) => {
        e.preventDefault();

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.put(`${process.env.REACT_APP_API_URL}/users/${id}`, { username, email, role }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setMessage('User updated successfully');
            navigate('/usuarios');
        } catch (error) {
            setMessage('Failed to update user');
            console.error('Error updating user:', error);
        }
    };

    const validateForm = () => {
        let validationErrors = {};
        if (!username) validationErrors.username = "El nombre de usuario es obligatorio";
        if (!email) {
            validationErrors.email = "El correo electrónico es obligatorio";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            validationErrors.email = "El formato del correo electrónico no es válido";
        }
        return validationErrors;
    };

    return (
        <Container maxWidth="sm" className="min-h-screen flex items-center justify-center">
            <Paper elevation={6} className="p-8 rounded-lg" style={{ backgroundColor: '#F3E5F5' }}>
                <Box mb={5} textAlign="center">
                    <Typography variant="h4" component="h1" gutterBottom style={{ color: '#4A007E' }}>
                        Editar Usuario
                    </Typography>
                </Box>
                <form onSubmit={handleEditUser} className="space-y-4">
                    {message && <Alert severity={message.includes('successfully') ? 'success' : 'error'}>{message}</Alert>}
                    <TextField
                        fullWidth
                        label="Nombre de usuario"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        variant="outlined"
                        error={!!errors.username}
                        helperText={errors.username}
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
                        fullWidth
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        variant="outlined"
                        error={!!errors.email}
                        helperText={errors.email}
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
                    <FormControl fullWidth variant="outlined">
                        <InputLabel>Rol</InputLabel>
                        <Select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            label="Rol"
                            sx={{ borderRadius: '20px' }}
                        >
                            <MenuItem value="user">Usuario</MenuItem>
                            <MenuItem value="admin">Administrador</MenuItem>
                        </Select>
                    </FormControl>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        type="submit"
                        fullWidth
                        sx={{ 
                            mt: 2, 
                            mb: 2, 
                            bgcolor: 'purple', 
                            color: 'white', 
                            borderRadius: '20px',
                            '&:hover': {
                                bgcolor: '#6A1B9A',
                            },
                        }}
                    >
                        Actualizar Usuario
                    </Button>
                </form>
            </Paper>
        </Container>
    );
}

export default EditUser;
