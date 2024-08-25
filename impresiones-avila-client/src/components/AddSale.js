import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography, Box, Paper } from '@mui/material';

function AddSale() {
    const [saleDate, setSaleDate] = useState('');
    const [totalAmount, setTotalAmount] = useState('');
    const [items, setItems] = useState([{ description: '', quantity: 0, unit_price: 0 }]);
    const [message, setMessage] = useState('');

    const handleAddSale = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:3001/sales', { sale_date: saleDate, total_amount: totalAmount, items }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setMessage('Sale added successfully');
        } catch (error) {
            setMessage('Failed to add sale');
            console.error('Error adding sale:', error);
        }
    };

    const handleItemChange = (index, event) => {
        const newItems = items.map((item, i) => {
            if (i !== index) return item;
            return { ...item, [event.target.name]: event.target.value };
        });
        setItems(newItems);
    };

    const handleAddItem = () => {
        setItems([...items, { description: '', quantity: 0, unit_price: 0 }]);
    };

    return (
        <Container maxWidth="sm" className="min-h-screen flex items-center justify-center">
            <Paper elevation={6} className="p-8 rounded-lg">
                <Box mb={5} textAlign="center">
                    <Typography variant="h4" component="h1" gutterBottom>
                        Add Sale
                    </Typography>
                </Box>
                <form onSubmit={handleAddSale} className="space-y-4">
                    <TextField
                        fullWidth
                        label="Sale Date"
                        type="date"
                        value={saleDate}
                        onChange={(e) => setSaleDate(e.target.value)}
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
                            },
                        }}
                    />
                    <TextField
                        fullWidth
                        label="Total Amount"
                        type="number"
                        value={totalAmount}
                        onChange={(e) => setTotalAmount(e.target.value)}
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
                            },
                        }}
                    />
                    <Typography variant="h6" component="h2" gutterBottom>
                        Items
                    </Typography>
                    {items.map((item, index) => (
                        <Box mb={2} key={index}>
                            <TextField
                                fullWidth
                                label="Description"
                                name="description"
                                value={item.description}
                                onChange={(e) => handleItemChange(index, e)}
                                variant="outlined"
                                sx={{ mb: 2 }}
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
                                label="Quantity"
                                name="quantity"
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handleItemChange(index, e)}
                                variant="outlined"
                                sx={{ mb: 2 }}
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
                                label="Unit Price"
                                name="unit_price"
                                type="number"
                                value={item.unit_price}
                                onChange={(e) => handleItemChange(index, e)}
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
                                    },
                                }}
                            />
                        </Box>
                    ))}
                    <Box display="flex" justifyContent="space-between" mt={3}>
                        <Button 
                            variant="outlined" 
                            color="primary" 
                            onClick={handleAddItem}
                            sx={{
                                borderRadius: '20px',
                                borderColor: 'purple',
                                color: 'purple',
                                '&:hover': {
                                    backgroundColor: 'purple',
                                    color: 'white',
                                },
                            }}
                        >
                            Add Item
                        </Button>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            type="submit"
                            sx={{ 
                                borderRadius: '20px',
                                bgcolor: 'purple',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: 'darkPurple',
                                },
                            }}
                        >
                            Add Sale
                        </Button>
                    </Box>
                </form>
                {message && <Typography color={message.includes('successfully') ? 'primary' : 'error'} variant="body2" style={{ marginTop: '20px' }}>{message}</Typography>}
            </Paper>
        </Container>
    );
}

export default AddSale;
