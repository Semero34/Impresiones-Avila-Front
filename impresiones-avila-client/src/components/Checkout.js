import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Paper, Grid, Button, CircularProgress, Divider } from '@mui/material';
import { CreditCard, Lock, LocalShipping, Replay } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

function Checkout() {
    const [cartItems, setCartItems] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [clientInfo, setClientInfo] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(cart);

        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            const user_id = decodedToken.id;

            axios.get(`${process.env.REACT_APP_API_URL}/client-by-user/${user_id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            }).then(response => {
                setClientInfo(response.data);
            }).catch(error => {
                console.error('Error fetching client info:', error);
            });
        }
    }, []);

    const calculateTotal = () => {
        const total = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
        const discount = localStorage.getItem('discount') || 0; // Recuperar el descuento del localStorage
        return (total - total * discount).toFixed(2); // Aplica el descuento
    };

    const getDiscountAmount = () => {
        const total = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
        const discount = localStorage.getItem('discount') || 0;
        return (total * discount).toFixed(2); // Muestra el monto de descuento
    };
    
    const handleCheckout = async () => {
        if (cartItems.length === 0) {
            setMessage('Tu carrito está vacío.');
            return;
        }
    
        const discount = localStorage.getItem('discount') || 0; // Recupera el descuento del localStorage
    
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const decodedToken = jwtDecode(token);
            const user_id = decodedToken.id;
    
            const clientResponse = await axios.get(`${process.env.REACT_APP_API_URL}/client-by-user/${user_id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
    
            const client_id = clientResponse.data.client_id;
    
            const orderResponse = await axios.post('${process.env.REACT_APP_API_URL}/create-checkout-session', {
                client_id: client_id,
                items: cartItems,
                discount: discount // Enviamos el descuento al backend
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
    
            localStorage.removeItem('discount');
    
            window.location.href = orderResponse.data.url; // Redirige a Stripe Checkout
        } catch (error) {
            console.error('Error al procesar la orden:', error);
            setMessage('Hubo un error al procesar tu orden. Por favor, intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };
    

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        if (query.get("success")) {
            setMessage("¡Orden realizada con éxito! Pronto recibirás un correo de confirmación.");
        }
        if (query.get("canceled")) {
            setMessage("Orden cancelada -- continúa comprando y realiza el checkout cuando estés listo.");
        }
    }, []);

    return (
        <Box 
            style={{ 
                background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
                paddingBottom: '2rem', 
                minHeight: '100vh', 
                width: '100%', 
                margin: 0, 
                padding: 0 
            }}
        >
            <Container maxWidth="lg" style={{ padding: '0', backgroundColor: 'transparent' }}>
                <Grid container spacing={4} style={{ margin: '0 auto', maxWidth: '1200px' }}>
                    <Grid item xs={12} md={8}>
                        <Paper 
                            elevation={12} 
                            className="p-8 rounded-lg shadow-xl" 
                            style={{ 
                                backgroundColor: '#ffffff', 
                                border: '1px solid #d1c4e9', 
                                borderRadius: '20px',
                                transition: 'transform 0.3s, box-shadow 0.3s',
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
                                }
                            }}
                        >
                            <Typography variant="h4" gutterBottom className="font-bold text-gray-900">
                                Resumen del Pedido
                            </Typography>
                            {cartItems.map((item, index) => (
                                <Box 
                                    key={index} 
                                    display="flex" 
                                    justifyContent="space-between" 
                                    mb={2} 
                                    className="p-4 border-b" 
                                    style={{ borderColor: '#d7bde2', borderBottomWidth: '2px' }}
                                >
                                    <Box display="flex">
                                        <img 
                                            src={item.image} 
                                            alt={item.name} 
                                            className="w-24 h-24 rounded-lg object-cover mr-4 shadow-md" 
                                            style={{ 
                                                transition: 'transform 0.3s',
                                                '&:hover': {
                                                    transform: 'scale(1.1)',
                                                }
                                            }}
                                        />
                                        <Box>
                                            <Typography variant="body1" className="font-bold text-gray-900">{item.name}</Typography>
                                            <Typography variant="body2" className="text-gray-600">{item.description}</Typography>
                                            <Typography variant="body2" className="text-gray-900">Cantidad: {item.quantity}</Typography>
                                            <Typography variant="body2" className="font-bold text-blue-500">Precio: ${item.price}</Typography>
                                        </Box>
                                    </Box>
                                    <Typography variant="h5" align="right" mt={2} className="font-bold text-gray-900">
                                        Subtotal: ${(item.price * item.quantity).toFixed(2)}
                                    </Typography>
                                </Box>
                            ))}
                            <Typography variant="h5" align="right" mt={2} className="font-bold text-gray-900">
                                Descuento: -${getDiscountAmount()}
                            </Typography>
                            <Typography variant="h5" align="right" mt={2} className="font-bold text-gray-900">
                                Total: ${calculateTotal()}
                            </Typography>
                        </Paper>
                    </Grid>
    
                    <Grid item xs={12} md={4}>
                        <Paper 
                            elevation={12} 
                            className="p-8 rounded-lg shadow-xl" 
                            style={{ 
                                backgroundColor: '#ffffff', 
                                border: '1px solid #d1c4e9', 
                                borderRadius: '20px',
                                transition: 'transform 0.3s, box-shadow 0.3s',
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
                                }
                            }}
                        >
                            <Typography variant="h6" gutterBottom className="font-bold text-gray-900" style={{ textAlign: 'center' }}>
                                ¡Tu pedido está casi listo!
                            </Typography>
                            <Box display="flex" alignItems="center" justifyContent="center" my={2}>
                                <CreditCard style={{ color: '#6A1B9A', fontSize: '40px' }} />
                                <Typography variant="body1" className="ml-2 font-bold text-gray-700">
                                    Pagas con Stripe
                                </Typography>
                            </Box>
                            {clientInfo && (
                                <Box my={2}>
                                    <Typography variant="body2" className="text-gray-600">Nombre: {clientInfo.name}</Typography>
                                    <Typography variant="body2" className="text-gray-600">Email: {clientInfo.email}</Typography>
                                </Box>
                            )}
                            <Divider light style={{ margin: '20px 0' }} />
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Box display="flex" alignItems="center">
                                    <LocalShipping style={{ color: '#43a047', fontSize: '24px', marginRight: '8px' }} />
                                    <Typography variant="body2" className="text-gray-600">Envío Gratis</Typography>
                                </Box>
                                <Box display="flex" alignItems="center">
                                    <Replay style={{ color: '#f57c00', fontSize: '24px', marginRight: '8px' }} />
                                    <Typography variant="body2" className="text-gray-600">Devoluciones Fáciles</Typography>
                                </Box>
                                <Box display="flex" alignItems="center">
                                    <Lock style={{ color: '#d32f2f', fontSize: '24px', marginRight: '8px' }} />
                                    <Typography variant="body2" className="text-gray-600">Pago Seguro</Typography>
                                </Box>
                            </Box>
                            <Button
                                onClick={handleCheckout}
                                variant="contained"
                                size="large"
                                disabled={loading}
                                className="py-3 px-6 rounded-full shadow-xl transition-all duration-300 transform hover:scale-105"
                                style={{
                                    marginTop: '20px',
                                    backgroundColor: '#6A1B9A',
                                    color: 'white',
                                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
                                    borderRadius: '30px'
                                }}
                            >
                                {loading ? <CircularProgress size={24} style={{ color: 'white' }} /> : 'Finalizar Compra'}
                            </Button>
                        </Paper>
                    </Grid>
                </Grid>
                {message && <Typography color="error" className="text-center mt-4">{message}</Typography>}
            </Container>
        </Box>
    );
}

export default Checkout;
