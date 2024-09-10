import React, { useState, useEffect } from 'react';
import { Container, Box, Grid, Button, Paper, IconButton, Divider, Alert, TextField, Modal } from '@mui/material';
import { Delete, Add, Remove, Bookmark, ClearAll, LocalOffer } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import 'tailwindcss/tailwind.css';

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [savedItems, setSavedItems] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    const [coupon, setCoupon] = useState('');
    const [discount, setDiscount] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [itemToRemove, setItemToRemove] = useState(null);

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

    const removeFromCart = () => {
        const updatedCart = cartItems.filter((_, i) => i !== itemToRemove);
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        setShowModal(false);
        window.dispatchEvent(new Event('cart-updated'));
    };

    const handleRemoveClick = (index) => {
        setItemToRemove(index);
        setShowModal(true);
    };

    const changeQuantity = (index, amount) => {
        const updatedCart = [...cartItems];
        const newQuantity = updatedCart[index].quantity + amount;

        if (newQuantity > 0 && newQuantity <= updatedCart[index].stock) {
            updatedCart[index].quantity = newQuantity;
            setCartItems(updatedCart);
            localStorage.setItem('cart', JSON.stringify(updatedCart));
            window.dispatchEvent(new Event('cart-updated'));

            if (newQuantity >= updatedCart[index].stock) {
                setAlertMessage(`¡Solo quedan ${updatedCart[index].stock} unidades de ${updatedCart[index].name}!`);
                setTimeout(() => setAlertMessage(''), 3000);
            }
        }
    };

    

    const saveForLater = (index) => {
        const itemToSave = cartItems[index];
        const updatedCart = cartItems.filter((_, i) => i !== index);
        setCartItems(updatedCart);
        setSavedItems([...savedItems, itemToSave]);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        localStorage.setItem('savedItems', JSON.stringify([...savedItems, itemToSave]));

        window.dispatchEvent(new Event('cart-updated'));
    };

    const emptyCart = () => {
        setCartItems([]);
        localStorage.setItem('cart', JSON.stringify([]));
        window.dispatchEvent(new Event('cart-updated'));
    };

    const applyCoupon = async () => {
        try {
            const response = await axios.post('/coupons/validate', { code: coupon });
            const { discount, code } = response.data;
    
            setDiscount(discount / 100);
            setAlertMessage(`¡Cupón aplicado! Descuento del ${discount}%`);
    
            // Guardar el descuento en el localStorage
            localStorage.setItem('discount', discount / 100);
    
            await axios.post('/coupons/use', { code });
        } catch (error) {
            setAlertMessage('Cupón inválido, expirado o sin uso disponible');
        }
        setTimeout(() => setAlertMessage(''), 3000);
   };
   
    const calculateTotal = () => {
        const total = cartItems.reduce((total, item) => total + Number(item.price) * item.quantity, 0);
        return (total - total * discount).toFixed(2);
    };

    return (
        <Container maxWidth="xl" className="py-16" style={{ minHeight: '100vh', backgroundColor: '#f3e5f5' }}>
            <Box className="text-center mb-12">
                <h1 className="text-5xl font-bold text-gray-800">Tu Carrito</h1>
            </Box>
            {alertMessage && (
                <Alert severity="warning" className="mb-8">{alertMessage}</Alert>
            )}
            <Grid container spacing={6}>
                <Grid item xs={12} md={8}>
                    <Paper elevation={8} className="p-8 rounded-xl shadow-lg animate-fadeIn" style={{ backgroundColor: '#ffffff', borderRadius: '20px' }}>
                        {cartItems.length === 0 ? (
                            <Box className="text-center">
                                <p className="text-2xl text-gray-700">No hay productos en el carrito.</p>
                            </Box>
                        ) : (
                            cartItems.map((item, index) => (
                                <Box key={index} className="mb-6">
                                    <Grid container spacing={4} alignItems="center">
                                        <Grid item xs={3}>
                                            <img src={item.image} alt={item.name} className="w-full h-40 rounded-lg object-cover shadow-md" />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <h2 className="text-3xl font-semibold text-gray-800">{item.name}</h2>
                                            <p className="text-gray-500 mt-2">{item.description}</p>
                                            <Box className="flex items-center mt-4">
                                                <IconButton onClick={() => changeQuantity(index, -1)} className="text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-full">
                                                    <Remove />
                                                </IconButton>
                                                <span className="mx-4 text-2xl text-gray-800">{item.quantity}</span>
                                                <IconButton onClick={() => changeQuantity(index, 1)} className="text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-full">
                                                    <Add />
                                                </IconButton>
                                            </Box>
                                            <p className="text-2xl font-semibold text-gray-800 mt-4">${Number(item.price).toFixed(2)}</p>
                                        </Grid>
                                        <Grid item xs={3} className="text-right">
                                            <IconButton onClick={() => saveForLater(index)} className="text-blue-500 bg-blue-100 hover:bg-blue-200 rounded-full mr-2">
                                                <Bookmark />
                                            </IconButton>
                                            <IconButton onClick={() => handleRemoveClick(index)} className="text-red-500 bg-red-100 hover:bg-red-200 rounded-full">
                                                <Delete />
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                    {index < cartItems.length - 1 && <Divider className="my-6" />}
                                </Box>
                            ))
                        )}
                        {cartItems.length > 0 && (
                            <Button
                                variant="contained"
                                color="secondary"
                                startIcon={<ClearAll />}
                                onClick={emptyCart}
                                className="mt-4"
                                style={{ backgroundColor: '#d32f2f', color: 'white', borderRadius: '20px', fontWeight: 'bold' }}
                            >
                                Vaciar Carrito
                            </Button>
                        )}
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper elevation={8} className="p-8 rounded-xl shadow-lg animate-slideUp" style={{ backgroundColor: '#ffffff', borderRadius: '20px' }}>
                        <h2 className="text-4xl font-bold text-gray-800 mb-8">Resumen</h2>
                        <Box className="mb-8">
                            <p className="text-xl font-semibold text-gray-800">Items: {cartItems.length}</p>
                            <p className="text-xl font-semibold text-gray-800">Envío: Gratis</p>
                            <p className="text-xl font-semibold text-gray-800">Impuestos: ${(calculateTotal() * 0.15).toFixed(2)}</p>
                            <p className="text-xl font-semibold text-gray-800">Descuentos: -$0.00</p>
                            <Divider className="my-6" />
                            <TextField
                                label="Código de cupón"
                                variant="outlined"
                                fullWidth
                                value={coupon}
                                onChange={(e) => setCoupon(e.target.value)}
                                InputProps={{
                                    endAdornment: (
                                        <IconButton onClick={applyCoupon}>
                                            <LocalOffer />
                                        </IconButton>
                                    ),
                                }}
                                className="mb-4"
                            />
                            <p className="text-3xl font-bold text-gray-800">Total: ${calculateTotal()}</p>
                        </Box>
                        <Button
                            variant="contained"
                            fullWidth
                            size="large"
                            component={Link}
                            to="/checkout"
                            style={{ backgroundColor: '#6A1B9A', color: 'white', borderRadius: '30px', padding: '14px 0', fontWeight: 'bold', transform: 'scale(1)', transition: 'transform 0.3s' }}
                            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                        >
                            Finalizar Compra
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
            {savedItems.length > 0 && (
                <Paper elevation={8} className="p-8 mt-10 rounded-xl shadow-lg" style={{ backgroundColor: '#ffffff', borderRadius: '20px' }}>
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Guardado para después</h2>
                    {savedItems.map((item, index) => (
                        <Box key={index} className="mb-4">
                            <Grid container spacing={4} alignItems="center">
                                <Grid item xs={3}>
                                    <img src={item.image} alt={item.name} className="w-full h-32 rounded-lg object-cover shadow-md" />
                                </Grid>
                                <Grid item xs={7}>
                                    <h2 className="text-2xl font-semibold text-gray-800">{item.name}</h2>
                                    <p className="text-xl text-gray-800 mt-2">${Number(item.price).toFixed(2)}</p>
                                </Grid>
                                <Grid item xs={2} className="text-right">
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => {
                                            setCartItems([...cartItems, item]);
                                            setSavedItems(savedItems.filter((_, i) => i !== index));
                                            localStorage.setItem('cart', JSON.stringify([...cartItems, item]));
                                            localStorage.setItem('savedItems', JSON.stringify(savedItems.filter((_, i) => i !== index)));
                                            window.dispatchEvent(new Event('cart-updated'));
                                        }}
                                    >
                                        Mover al carrito
                                    </Button>
                                </Grid>
                            </Grid>
                            {index < savedItems.length - 1 && <Divider className="my-4" />}
                        </Box>
                    ))}
                </Paper>
            )}
            <Modal
                open={showModal}
                onClose={() => setShowModal(false)}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <Box className="p-6 bg-white rounded-lg shadow-xl m-auto mt-20" style={{ maxWidth: '400px' }}>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">¿Eliminar producto?</h2>
                    <p className="text-gray-600 mb-4">¿Estás seguro de que quieres eliminar este producto del carrito?</p>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={removeFromCart}
                        style={{ marginRight: '10px' }}
                    >
                        Sí, eliminar
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => setShowModal(false)}
                    >
                        Cancelar
                    </Button>
                </Box>
            </Modal>
        </Container>
    );
}

export default Cart;
