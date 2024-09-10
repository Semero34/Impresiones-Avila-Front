import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, Paper, Box } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

const EditClient = () => {
    const { id } = useParams();
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [contactInfo, setContactInfo] = useState('');
    const [clientType, setClientType] = useState('');
    const [pendingBalance, setPendingBalance] = useState('');
    const [identificationNumber, setIdentificationNumber] = useState('');
    const [email, setEmail] = useState('');
    const [identificationType, setIdentificationType] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchClient = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/clients/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const client = response.data;
                setName(client.name);
                setAddress(client.address);
                setContactInfo(client.contact_info);
                setClientType(client.client_type);
                setPendingBalance(client.pending_balance);
                setIdentificationNumber(client.identification_number);
                setEmail(client.email);
                setIdentificationType(client.identification_type);
            } catch (error) {
                setError('Error al obtener la información del cliente');
            }
        };
        fetchClient();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !address || !contactInfo || !clientType || !email || !identificationNumber || !identificationType) {
            setError('Todos los campos son obligatorios');
            return;
        }
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${process.env.REACT_APP_API_URL}/clients/${id}`, {
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
            setError('Error al actualizar el cliente');
        }
    };

    return (
        <Container maxWidth="sm" className="min-h-screen flex items-center justify-center">
            <Paper elevation={6} className="p-8 rounded-lg" sx={{ backgroundColor: '#F3E5F5' }}>
                <Box mb={5} textAlign="center">
                    <Typography variant="h4" component="h1" gutterBottom style={{ color: '#4A007E' }}>
                        Editar Cliente
                    </Typography>
                </Box>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <Typography color="error" variant="body2">{error}</Typography>}
                    <TextField
                        label="Nombre"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                        variant="outlined"
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
                                bgcolor: '#FFFFFF',
                            },
                        }}
                    />
                    <TextField
                        label="Dirección"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                        variant="outlined"
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
                                bgcolor: '#FFFFFF',
                            },
                        }}
                    />
                    <TextField
                        label="Información de Contacto"
                        value={contactInfo}
                        onChange={(e) => setContactInfo(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                        variant="outlined"
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
                                bgcolor: '#FFFFFF',
                            },
                        }}
                    />
                    <TextField
                        label="Tipo de Cliente"
                        value={clientType}
                        onChange={(e) => setClientType(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                        variant="outlined"
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
                                bgcolor: '#FFFFFF',
                            },
                        }}
                    />
                    <TextField
                        label="Saldo Pendiente"
                        value={pendingBalance}
                        onChange={(e) => setPendingBalance(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                        variant="outlined"
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
                                bgcolor: '#FFFFFF',
                            },
                        }}
                    />
                    <TextField
                        label="Número de Cédula"
                        value={identificationNumber}
                        onChange={(e) => setIdentificationNumber(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                        variant="outlined"
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
                                bgcolor: '#FFFFFF',
                            },
                        }}
                    />
                    <TextField
                        label="Correo Electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                        variant="outlined"
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
                                bgcolor: '#FFFFFF',
                            },
                        }}
                    />
                    <TextField
                        label="Tipo de Cédula"
                        value={identificationType}
                        onChange={(e) => setIdentificationType(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                        variant="outlined"
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
                                bgcolor: '#FFFFFF',
                            },
                        }}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{
                            mt: 2,
                            mb: 2,
                            bgcolor: '#8E24AA',
                            color: 'white',
                            borderRadius: '20px',
                            ':hover': {
                                bgcolor: '#7B1FA2',
                            }
                        }}
                    >
                        Actualizar Cliente
                    </Button>
                </form>
            </Paper>
        </Container>
    );
};

export default EditClient;
