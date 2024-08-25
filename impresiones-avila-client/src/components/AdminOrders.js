import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Box, Grid, Paper, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [pendingOrders, setPendingOrders] = useState([]);
    const [approvedOrders, setApprovedOrders] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get('http://localhost:3001/admin/orders', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            setOrders(response.data);
            setPendingOrders(response.data.filter(order => order.status === 'processing'));
            setApprovedOrders(response.data.filter(order => order.status === 'completed'));
        })
        .catch(error => {
            console.error('Error fetching orders:', error);
        });
    }, []);

    const handleOpenDialog = (order) => {
        setSelectedOrder(order);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedOrder(null);
    };

    const handleApprove = () => {
        if (!selectedOrder) return;
    
        const token = localStorage.getItem('token'); // Verifica que obtienes el token aquí
        console.log('Token:', token); // Verifica si el token está siendo capturado correctamente
    
        if (!token) {
            console.error('Token is missing or undefined');
            return;
        }
    
        axios.put(`http://localhost:3001/admin/orders/${selectedOrder.order_id}/approve`, {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            const updatedOrders = orders.map(order => 
                order.order_id === selectedOrder.order_id ? { ...order, status: 'completed' } : order
            );
            setOrders(updatedOrders);
            setPendingOrders(updatedOrders.filter(order => order.status === 'processing'));
            setApprovedOrders(updatedOrders.filter(order => order.status === 'completed'));
            handleCloseDialog();
        })
        .catch(error => {
            console.error('Error approving order:', error);
        });
    };
    
    return (
        <Container maxWidth="lg" className="mt-12">
            <Box className="text-center mb-12">
                <Typography variant="h4" className="font-bold">
                    Administrar Órdenes
                </Typography>
            </Box>
            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <Typography variant="h5" className="font-bold mb-4">
                        Órdenes Pendientes
                    </Typography>
                    <Grid container spacing={3}>
                        {pendingOrders.length === 0 ? (
                            <Grid item xs={12} className="text-center">
                                <Typography variant="h6">No hay órdenes pendientes.</Typography>
                            </Grid>
                        ) : (
                            pendingOrders.map((order) => (
                                <Grid item xs={12} key={order.order_id}>
                                    <Paper elevation={3} className="p-6 rounded-lg shadow-md bg-white">
                                        <Typography variant="h6" className="font-bold mb-2">Orden #{order.order_id}</Typography>
                                        <Typography variant="body2" className="text-gray-500 mb-2">Cliente ID: {order.client_id}</Typography>
                                        <Typography variant="body2" className="text-gray-500 mb-2">Total: ${order.total_amount}</Typography>
                                        <Typography variant="body2" className="text-gray-500 mb-2">Estado: {order.status}</Typography>
                                        <Button 
                                            variant="contained" 
                                            color="primary" 
                                            onClick={() => handleOpenDialog(order)} 
                                            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
                                        >
                                            Aprobar Orden
                                        </Button>
                                        <Button 
                                            variant="contained" 
                                            color="secondary" 
                                            onClick={() => navigate(`/admin/order/${order.order_id}`)} 
                                            className="mt-4 ml-4 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md"
                                        >
                                            Ver Detalles
                                        </Button>
                                    </Paper>
                                </Grid>
                            ))
                        )}
                    </Grid>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="h5" className="font-bold mb-4">
                        Órdenes Completadas
                    </Typography>
                    <Grid container spacing={3}>
                        {approvedOrders.length === 0 ? (
                            <Grid item xs={12} className="text-center">
                                <Typography variant="h6">No hay órdenes aprobadas.</Typography>
                            </Grid>
                        ) : (
                            approvedOrders.map((order) => (
                                <Grid item xs={12} key={order.order_id}>
                                    <Paper elevation={3} className="p-6 rounded-lg shadow-md bg-white">
                                        <Typography variant="h6" className="font-bold mb-2">Orden #{order.order_id}</Typography>
                                        <Typography variant="body2" className="text-gray-500 mb-2">Cliente ID: {order.client_id}</Typography>
                                        <Typography variant="body2" className="text-gray-500 mb-2">Total: ${order.total_amount}</Typography>
                                        <Typography variant="body2" className="text-gray-500 mb-2">Estado: {order.status}</Typography>
                                        <Typography variant="body2" className="text-gray-500 mb-2">Estado de Pago: {order.payment_status || 'No Confirmado'}</Typography>
                                        <Button 
                                            variant="contained" 
                                            color="secondary" 
                                            onClick={() => navigate(`/admin/order/${order.order_id}`)} 
                                            className="mt-4 ml-4 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md"
                                        >
                                            Ver Detalles
                                        </Button>
                                    </Paper>
                                </Grid>
                            ))
                        )}
                    </Grid>
                </Grid>
            </Grid>
            
            {/* Dialog to confirm approval */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="confirm-dialog-title"
                aria-describedby="confirm-dialog-description"
            >
                <DialogTitle id="confirm-dialog-title">Confirmar Aprobación</DialogTitle>
                <DialogContent>
                    <DialogContentText id="confirm-dialog-description">
                        ¿Estás seguro de que quieres aprobar esta orden?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">
                        Cancelar
                    </Button>
                    <Button onClick={handleApprove} color="primary" autoFocus>
                        Aprobar
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default AdminOrders;
