// src/components/ClientDetails.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box } from '@mui/material';

function ClientDetails() {
    const { id } = useParams();
    const [client, setClient] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:3001/clients/${id}`)
            .then(response => setClient(response.data))
            .catch(error => console.error('Error fetching client details:', error));
    }, [id]);

    if (!client) return <Typography>Cargando...</Typography>;

    return (
        <Container maxWidth="sm">
            <Box mt={5}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Detalles del Cliente
                </Typography>
                <Typography variant="h6">ID: {client.client_id}</Typography>
                <Typography variant="h6">Nombre: {client.name}</Typography>
                <Typography variant="h6">Dirección: {client.address}</Typography>
                <Typography variant="h6">Contacto: {client.contact_info}</Typography>
                <Typography variant="h6">Tipo: {client.client_type}</Typography>
            </Box>
        </Container>
    );
}

export default ClientDetails;
