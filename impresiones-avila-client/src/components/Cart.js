import React, { useState, useEffect } from 'react';
import { Container, Box, Grid, Button, Paper, IconButton, Divider } from '@mui/material';
import { Delete, Add, Remove } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import 'tailwindcss/tailwind.css';

function Cart() {
    const [cartItems, setCartItems] = useState([]);

    const updateCartItems = () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(cart);
    };

    useEffect(() => {
        updateCartItems();

        const handleCartUpdated = () => {
            updateCartItems();
        };

        window.addEventListener('cart-updated', handleCartUpdated);

        return () => {
            window.removeEventListener('cart-updated', handleCartUpdated);
        };
    }, []);

    const removeFromCart = (index) => {
        const updatedCart = cartItems.filter((_, i) => i !== index);
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));

        window.dispatchEvent(new Event('cart-updated'));
    };

    const changeQuantity = (index, amount) => {
        const updatedCart = [...cartItems];
        updatedCart[index].quantity += amount;
    
        if (updatedCart[index].quantity > updatedCart[index].stock) {
            updatedCart[index].quantity = updatedCart[index].stock;
        } else if (updatedCart[index].quantity <= 0) {
            updatedCart[index].quantity = 1;
        }
    
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        window.dispatchEvent(new Event('cart-updated'));
    };
    

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + Number(item.price) * item.quantity, 0).toFixed(2);
    };

    return (
        <Container maxWidth="xl" className="py-16" style={{ minHeight: '100vh', backgroundColor: '#f3e5f5' }}>
            <Box className="text-center mb-12">
                <h1 className="text-5xl font-bold text-gray-800">Tu Carrito</h1>
            </Box>
            <Grid container spacing={6}>
                <Grid item xs={12} md={8}>
                    <Paper elevation={8} className="p-8 rounded-xl shadow-lg animate-fadeIn" style={{ backgroundColor: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '20px' }}>
                        {cartItems.length === 0 ? (
                            <Box className="text-center">
                                <p className="text-2xl text-gray-700">No hay productos en el carrito.</p>
                            </Box>
                        ) : (
                            cartItems.map((item, index) => (
                                <Box key={index} className="mb-6">
                                    <Grid container spacing={4} alignItems="center">
                                        <Grid item xs={3}>
                                            <img src={item.image} alt={item.name} className="w-full h-32 rounded-lg object-cover shadow-md" />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <h2 className="text-2xl font-semibold text-gray-800">{item.name}</h2>
                                            <p className="text-gray-500 mt-1">{item.description}</p>
                                            <Box className="flex items-center mt-4">
                                                <IconButton onClick={() => changeQuantity(index, -1)} className="text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-full">
                                                    <Remove />
                                                </IconButton>
                                                <span className="mx-4 text-xl text-gray-800">{item.quantity}</span>
                                                <IconButton onClick={() => changeQuantity(index, 1)} className="text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-full">
                                                    <Add />
                                                </IconButton>
                                            </Box>
                                            <p className="text-xl font-semibold text-gray-800 mt-4">${Number(item.price).toFixed(2)}</p>
                                        </Grid>
                                        <Grid item xs={3} className="text-right">
                                            <IconButton onClick={() => removeFromCart(index)} className="text-red-500 bg-red-100 hover:bg-red-200 rounded-full">
                                                <Delete />
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                    {index < cartItems.length - 1 && <Divider className="my-6" />}
                                </Box>
                            ))
                        )}
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper elevation={8} className="p-8 rounded-xl shadow-lg animate-slideUp" style={{ backgroundColor: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '20px' }}>
                        <h2 className="text-3xl font-bold text-gray-800 mb-8">Resumen</h2>
                        <Box className="mb-8">
                            <p className="text-xl font-semibold text-gray-800">Items: {cartItems.length}</p>
                            <p className="text-xl font-semibold text-gray-800">Envío: Gratis</p>
                            <p className="text-xl font-semibold text-gray-800">Impuestos: ${(calculateTotal() * 0.15).toFixed(2)}</p>
                            <p className="text-xl font-semibold text-gray-800">Descuentos: -$0.00</p>
                            <Divider className="my-6" />
                            <p className="text-2xl font-bold text-gray-800">Total: ${calculateTotal()}</p>
                        </Box>
                        <Button
                            variant="contained"
                            fullWidth
                            size="large"
                            component={Link}
                            to="/checkout"
                            style={{ backgroundColor: '#ab47bc', color: 'white', borderRadius: '30px', padding: '12px 0', fontWeight: 'bold', transform: 'scale(1)', transition: 'transform 0.3s' }}
                            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                        >
                            Finalizar Compra
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}

export default Cart;
