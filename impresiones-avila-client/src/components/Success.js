import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Typography, Container } from '@mui/material';

function Success() {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');

    useEffect(() => {
        if (sessionId) {
            // Here you can fetch additional details about the session if needed
            console.log('Session ID:', sessionId);
        }
    }, [sessionId]);

    return (
        <Container>
            <Box sx={{ mt: 5 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    ¡Gracias por tu compra!
                </Typography>
                <Typography variant="h6" align="center">
                    Tu pago se ha realizado con éxito.
                </Typography>
                <Typography variant="body1" align="center" sx={{ mt: 2 }}>
                    Tu número de sesión es: {sessionId}
                </Typography>
            </Box>
        </Container>
    );
}

export default Success;
