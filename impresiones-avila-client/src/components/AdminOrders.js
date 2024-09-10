import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container, Typography, Box, Grid, Paper, Button, Dialog, DialogTitle, DialogContent,
    DialogContentText, DialogActions, TextField, MenuItem, Pagination, Collapse, IconButton, Checkbox, Fab, Chip
} from '@mui/material';
import { ExpandMore, ExpandLess, Check } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [selectedOrders, setSelectedOrders] = useState([]);
    const ordersPerPage = 5;

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = () => {
        const token = localStorage.getItem('token');
        axios.get('http://localhost:3001/admin/orders', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                setOrders(response.data);
                setFilteredOrders(response.data);
            })
            .catch(error => {
                console.error('Error fetching orders:', error);
            });
    };

    useEffect(() => {
        applyFilters();
    }, [statusFilter, searchQuery]);

    const applyFilters = () => {
        let filtered = orders;

        if (statusFilter !== 'all') {
            filtered = filtered.filter(order => order.status === statusFilter);
        }

        if (searchQuery) {
            filtered = filtered.filter(order =>
                order.order_id.toString().includes(searchQuery) ||
                order.client_id.toString().includes(searchQuery)
            );
        }

        setFilteredOrders(filtered);
        setCurrentPage(1);  // Reset to first page whenever filters change
    };

    const handleStatusFilterChange = (event) => {
        setStatusFilter(event.target.value);
    };

    const handleSearchQueryChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleExpandClick = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    const handleSelectOrder = (orderId) => {
        setSelectedOrders((prevSelected) => 
            prevSelected.includes(orderId) 
                ? prevSelected.filter(id => id !== orderId) 
                : [...prevSelected, orderId]
        );
    };

    const handleApproveSelected = () => {
        const token = localStorage.getItem('token');
        const approvalPromises = selectedOrders.map(orderId => 
            axios.put(`${process.env.REACT_APP_API_URL}/admin/orders/${orderId}/approve`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
        );

        Promise.all(approvalPromises)
            .then(() => {
                fetchOrders(); // Refetch orders to reflect updates
                setSelectedOrders([]);
            })
            .catch(error => {
                console.error('Error approving selected orders:', error);
            });
    };

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

        const token = localStorage.getItem('token');

        axios.put(`${process.env.REACT_APP_API_URL}/admin/orders/${selectedOrder.order_id}/approve`, {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                const updatedOrders = orders.map(order =>
                    order.order_id === selectedOrder.order_id ? { ...order, status: 'completed' } : order
                );
                setOrders(updatedOrders);
                applyFilters();
                handleCloseDialog();
            })
            .catch(error => {
                console.error('Error approving order:', error);
            });
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const getPaginatedOrders = () => {
        const indexOfLastOrder = currentPage * ordersPerPage;
        const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
        return filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
    };

    const getStatusChip = (status) => {
        switch (status) {
            case 'processing':
                return <Chip label="Pendiente" color="warning" />;
            case 'completed':
                return <Chip label="Completada" color="success" />;
            default:
                return <Chip label="Desconocido" color="default" />;
        }
    };

    return (
        <Container maxWidth="lg" className="mt-12">
            <Box className="text-center mb-8">
                <Typography variant="h4" className="font-bold">
                    Administrar Órdenes
                </Typography>
            </Box>

            <Box className="mb-6 p-4" style={{ backgroundColor: '#f3e5f5', borderRadius: '12px' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <TextField
                            label="Buscar por ID o Cliente"
                            variant="outlined"
                            fullWidth
                            value={searchQuery}
                            onChange={handleSearchQueryChange}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            select
                            label="Filtrar por Estado"
                            variant="outlined"
                            fullWidth
                            value={statusFilter}
                            onChange={handleStatusFilterChange}
                        >
                            <MenuItem value="all">Todos</MenuItem>
                            <MenuItem value="processing">Pendientes</MenuItem>
                            <MenuItem value="completed">Completadas</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleApproveSelected}
                            disabled={selectedOrders.length === 0}
                            fullWidth
                            sx={{
                                backgroundColor: '#6A1B9A',
                                color: 'white',
                                fontWeight: 'bold',
                                padding: '10px',
                                borderRadius: '25px',
                                boxShadow: '0px 10px 20px rgba(106, 27, 154, 0.4)',
                                '&:hover': {
                                    backgroundColor: '#4A148C',
                                    transform: 'translateY(-3px)',
                                },
                            }}
                        >
                            Aprobar Seleccionadas
                        </Button>
                    </Grid>
                </Grid>
            </Box>

            <Grid container spacing={4}>
                {getPaginatedOrders().length === 0 ? (
                    <Grid item xs={12} className="text-center">
                        <Typography variant="h6">No hay órdenes que coincidan con los filtros aplicados.</Typography>
                    </Grid>
                ) : (
                    getPaginatedOrders().map((order) => (
                        <Grid item xs={12} key={order.order_id}>
                            <Paper
                                elevation={4}
                                className="p-6 rounded-lg shadow-lg"
                                sx={{
                                    backgroundColor: '#ffffff',
                                    borderRadius: '12px',
                                    transition: 'transform 0.3s ease-in-out',
                                    '&:hover': {
                                        transform: 'translateY(-5px)',
                                        boxShadow: '0px 15px 30px rgba(0, 0, 0, 0.1)',
                                    },
                                }}
                            >
                                <Box display="flex" alignItems="center" justifyContent="space-between">
                                    <Box display="flex" alignItems="center">
                                        <Checkbox
                                            checked={selectedOrders.includes(order.order_id)}
                                            onChange={() => handleSelectOrder(order.order_id)}
                                        />
                                        <Typography variant="h6" className="font-bold">
                                            Orden #{order.order_id}
                                        </Typography>
                                    </Box>
                                    {getStatusChip(order.status)}
                                    <IconButton onClick={() => handleExpandClick(order.order_id)}>
                                        {expandedOrder === order.order_id ? <ExpandLess /> : <ExpandMore />}
                                    </IconButton>
                                </Box>
                                <Collapse in={expandedOrder === order.order_id} timeout="auto" unmountOnExit>
                                    <Box mt={2} sx={{ animation: 'fadeIn 0.5s' }}>
                                        <Typography variant="body2" className="text-gray-500 mb-2">Cliente ID: {order.client_id}</Typography>
                                        <Typography variant="body2" className="text-gray-500 mb-2">Total: ${order.total_amount}</Typography>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleOpenDialog(order)}
                                            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
                                            sx={{
                                                backgroundColor: '#6A1B9A',
                                                color: 'white',
                                                fontWeight: 'bold',
                                                borderRadius: '20px',
                                                '&:hover': {
                                                    backgroundColor: '#4A148C',
                                                },
                                            }}
                                        >
                                            Aprobar Orden
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => navigate(`/admin/order/${order.order_id}`)}
                                            className="mt-4 ml-4 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md"
                                            sx={{
                                                backgroundColor: '#9E9E9E',
                                                color: 'white',
                                                fontWeight: 'bold',
                                                borderRadius: '20px',
                                                '&:hover': {
                                                    backgroundColor: '#616161',
                                                },
                                            }}
                                        >
                                            Ver Detalles
                                        </Button>
                                    </Box>
                                </Collapse>
                            </Paper>
                        </Grid>
                    ))
                )}
            </Grid>

            {filteredOrders.length > ordersPerPage && (
                <Box display="flex" justifyContent="center" mt={4}>
                    <Pagination
                        count={Math.ceil(filteredOrders.length / ordersPerPage)}
                        page={currentPage}
                        onChange={handlePageChange}
                        color="primary"
                        sx={{
                            '& .MuiPaginationItem-root': {
                                color: '#6A1B9A',
                            },
                            '& .MuiPaginationItem-root.Mui-selected': {
                                backgroundColor: '#6A1B9A',
                                color: 'white',
                            },
                        }}
                    />
                </Box>
            )}

            <Fab
                color="primary"
                aria-label="approve"
                onClick={handleApproveSelected}
                disabled={selectedOrders.length === 0}
                sx={{
                    position: 'fixed',
                    bottom: '16px',
                    right: '16px',
                    backgroundColor: '#6A1B9A',
                    '&:hover': {
                        backgroundColor: '#4A148C',
                    },
                    boxShadow: '0px 10px 20px rgba(106, 27, 154, 0.4)',
                }}
            >
                <Check />
            </Fab>

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
