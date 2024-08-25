import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Paper, Grid, Card, CardContent, CardActionArea, Button, Divider } from '@mui/material';
import { Payment, AccountBalance } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PayPalButtons } from "@paypal/react-paypal-js";
import {jwtDecode} from 'jwt-decode';

function Checkout() {
    const [cartItems, setCartItems] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('sinpe');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(cart);

        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            const user_id = decodedToken.id;

            const fetchClientInfo = async () => {
                try {
                    await axios.get(`http://localhost:3001/client-by-user/${user_id}`);
                } catch (error) {
                    console.error('Error fetching client info:', error);
                    setError('No se pudo obtener la información del cliente.');
                }
            };

            fetchClientInfo();
        }
    }, []);

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const handlePayPalOrderCreation = async () => {
        try {
            const token = localStorage.getItem('token');
            const decodedToken = jwtDecode(token);
            const user_id = decodedToken.id;

            const clientResponse = await axios.get(`http://localhost:3001/client-by-user/${user_id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const client_id = clientResponse.data.client_id;

            const response = await axios.post('http://localhost:3001/create-paypal-order', {
                client_id: client_id,
                items: cartItems,
                total: calculateTotal(),
                paymentMethod: 'paypal',
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            return response.data.orderID;
        } catch (error) {
            console.error('Error creando la orden de PayPal:', error);
            setMessage('Hubo un error al iniciar la transacción con PayPal. Por favor, intenta de nuevo.');
            return null;
        }
    };

    const handlePayPalApprove = async (data) => {
        try {
            const captureResponse = await axios.post('http://localhost:3001/capture-paypal-order', {
                orderID: data.orderID
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

             // Clear the cart after a successful purchase
        localStorage.removeItem('cart');
        setCartItems([]);

            navigate('/confirmation', {
                state: {
                    invoiceId: captureResponse.data.invoiceId,
                    cartItems,
                    total: calculateTotal(),
                    paymentMethod: 'paypal',
                }
            });

        } catch (error) {
            console.error('Error al capturar la orden de PayPal:', error);
            setMessage('Hubo un error al capturar la transacción con PayPal. Por favor, intenta de nuevo.');
        }
    };

    const handleCheckout = async () => {
        const token = localStorage.getItem('token');
        const decodedToken = jwtDecode(token);
        const user_id = decodedToken.id;
    
        try {
            const clientResponse = await axios.get(`http://localhost:3001/client-by-user/${user_id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            const client_id = clientResponse.data.client_id;
    
            const response = await axios.post('http://localhost:3001/create-paypal-order', {
                client_id: client_id,
                items: cartItems,
                total: calculateTotal(),
                paymentMethod: paymentMethod,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            localStorage.removeItem('cart');
            setCartItems([]);
    
            if (response.data.success) {
                navigate('/confirmation', {
                    state: {
                        invoiceId: response.data.invoiceId,
                        cartItems,
                        total: calculateTotal(),
                        paymentMethod: paymentMethod,
                    }
                });
            } else {
                setMessage('Hubo un error al procesar tu orden. Por favor, intenta de nuevo.');
            }
        } catch (error) {
            console.error('Error al procesar la orden:', error);
            setMessage('Hubo un error al procesar tu orden. Por favor, intenta de nuevo.');
        }
    };
    

    const total = calculateTotal();

    return (
        <Box 
            style={{ 
                backgroundColor: '#f3e5f5', 
                paddingBottom: '2rem', 
                minHeight: '100vh', 
                width: '100%',
                margin: 0,
                padding: 0,
            }}
        >
            <Box 
                className="text-center py-12 mb-8" 
                style={{ 
                    backgroundColor: '#d7bde2', 
                    color: '#4a235a', 
                    padding: '2rem 0', 
                    borderRadius: '0px', 
                    width: '100%',
                    boxShadow: 'none', 
                    margin: 0,
                }}
            >
                <Typography variant="h3" className="font-bold" style={{ margin: '0 auto', maxWidth: '1200px' }}>
                    ¡Estás a punto de completar tu compra!
                </Typography>
                <Typography variant="subtitle1" style={{ marginTop: '1rem', color: '#6c3483' }}>
                    Revisa los detalles de tu pedido y selecciona un método de pago para finalizar.
                </Typography>
            </Box>
    
            <Container maxWidth="lg" style={{ padding: '0', backgroundColor: '#f3e5f5' }}>
                <Grid container spacing={4} style={{ margin: '0 auto', maxWidth: '1200px' }}>
                    <Grid item xs={12} md={8}>
                        <Paper elevation={8} className="p-8 rounded-lg shadow-lg" style={{ backgroundColor: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '20px' }}>
                            <Typography variant="h4" gutterBottom className="font-bold text-gray-900">
                                Resumen del Pedido
                            </Typography>
                            {cartItems.map((item, index) => (
                                <Box key={index} display="flex" justifyContent="space-between" mb={2} className="p-4 border-b" style={{ borderColor: '#d7bde2', borderBottomWidth: '2px' }}>
                                    <Box display="flex">
                                        <img src={item.image} alt={item.name} className="w-24 h-24 rounded-lg object-cover mr-4 shadow-md" />
                                        <Box>
                                            <Typography variant="body1" className="font-bold text-gray-900">{item.name}</Typography>
                                            <Typography variant="body2" className="text-gray-600">{item.description}</Typography>
                                            <Typography variant="body2" className="text-gray-900">Cantidad: {item.quantity}</Typography>
                                            <Typography variant="body2" className="font-bold text-blue-500">Precio: ${item.price}</Typography>
                                        </Box>
                                    </Box>
                                    <Typography variant="body1" className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</Typography>
                                </Box>
                            ))}
                            <Typography variant="h5" align="right" mt={2} className="font-bold text-gray-900">
                                Total: ${total.toFixed(2)}
                            </Typography>
                        </Paper>
                    </Grid>
    
                    <Grid item xs={12} md={4}>
                        <Paper elevation={8} className="p-8 rounded-lg shadow-lg" style={{ backgroundColor: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '20px' }}>
                            <Typography variant="h6" gutterBottom className="font-bold text-gray-900">
                                Método de Pago
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <CardActionArea onClick={() => setPaymentMethod('sinpe')}>
                                        <Card
                                            style={{
                                                backgroundColor: paymentMethod === 'sinpe' ? '#d7bde2' : '#f3e5f5',
                                                color: paymentMethod === 'sinpe' ? 'white' : 'black',
                                                borderRadius: '12px',
                                                transition: '0.3s',
                                                boxShadow: paymentMethod === 'sinpe' ? '0 4px 15px rgba(0, 0, 0, 0.2)' : 'none'
                                            }}
                                        >
                                            <CardContent style={{ textAlign: 'center' }}>
                                                <Payment fontSize="large" />
                                                <Typography variant="h6">Sinpe Móvil</Typography>
                                            </CardContent>
                                        </Card>
                                    </CardActionArea>
                                </Grid>
                                <Grid item xs={6}>
                                    <CardActionArea onClick={() => setPaymentMethod('bank')}>
                                        <Card
                                            style={{
                                                backgroundColor: paymentMethod === 'bank' ? '#d7bde2' : '#f3e5f5',
                                                color: paymentMethod === 'bank' ? 'white' : 'black',
                                                borderRadius: '12px',
                                                transition: '0.3s',
                                                boxShadow: paymentMethod === 'bank' ? '0 4px 15px rgba(0, 0, 0, 0.2)' : 'none'
                                            }}
                                        >
                                            <CardContent style={{ textAlign: 'center' }}>
                                                <AccountBalance fontSize="large" />
                                                <Typography variant="h6">Transferencia Bancaria</Typography>
                                            </CardContent>
                                        </Card>
                                    </CardActionArea>
                                </Grid>
                                <Grid item xs={12}>
                                    <CardActionArea onClick={() => setPaymentMethod('paypal')}>
                                        <Card
                                            style={{
                                                backgroundColor: paymentMethod === 'paypal' ? '#d7bde2' : '#f3e5f5',
                                                color: paymentMethod === 'paypal' ? 'white' : 'black',
                                                borderRadius: '12px',
                                                transition: '0.3s',
                                                boxShadow: paymentMethod === 'paypal' ? '0 4px 15px rgba(0, 0, 0, 0.2)' : 'none'
                                            }}
                                        >
                                            <CardContent style={{ textAlign: 'center' }}>
                                                <Payment fontSize="large" />
                                                <Typography variant="h6">PayPal</Typography>
                                            </CardContent>
                                        </Card>
                                    </CardActionArea>
                                </Grid>
                            </Grid>
    
                            <Divider className="my-4" style={{ borderColor: '#d7bde2' }} />
    
                            <Box mt={4} textAlign="center">
                                {paymentMethod === 'paypal' ? (
                                    <PayPalButtons 
                                        createOrder={handlePayPalOrderCreation}
                                        onApprove={handlePayPalApprove}
                                    />                               
                                ) : (
                                    <Button
                                        variant="contained"
                                        size="large"
                                        onClick={handleCheckout}
                                        className="py-3 px-6 rounded-full shadow-xl transition-all duration-300 transform hover:scale-105"
                                        style={{
                                            backgroundColor: '#ab47bc',
                                            color: 'white',
                                            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
                                            borderRadius: '30px'
                                        }}
                                    >
                                        Finalizar Compra
                                    </Button>
                                )}
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
                {error && <Typography color="error" className="text-center mt-4">{error}</Typography>}
            </Container>
        </Box>
    );
}   

export default Checkout;
