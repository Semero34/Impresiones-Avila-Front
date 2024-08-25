import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Box, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

function Expenses() {
    const [expenses, setExpenses] = useState([]);
    const [newExpense, setNewExpense] = useState({ description: '', amount: '', date: '', category: '' });

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3001/expenses', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setExpenses(response.data);
            } catch (error) {
                console.error('Error fetching expenses:', error);
            }
        };

        fetchExpenses();
    }, []);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewExpense({ ...newExpense, [name]: value });
    };

    const handleAddExpense = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:3001/expenses', newExpense, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setExpenses([...expenses, newExpense]);
            setNewExpense({ description: '', amount: '', date: '', category: '' });
        } catch (error) {
            console.error('Error adding expense:', error);
        }
    };

    return (
        <Container maxWidth="md">
            <Box mt={5}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Gastos Operativos
                </Typography>
                <Box mb={3}>
                    <TextField
                        label="Descripción"
                        name="description"
                        fullWidth
                        margin="normal"
                        value={newExpense.description}
                        onChange={handleInputChange}
                    />
                    <TextField
                        label="Monto"
                        name="amount"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={newExpense.amount}
                        onChange={handleInputChange}
                    />
                    <TextField
                        label="Fecha"
                        name="date"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        margin="normal"
                        value={newExpense.date}
                        onChange={handleInputChange}
                    />
                    <TextField
                        label="Categoría"
                        name="category"
                        fullWidth
                        margin="normal"
                        value={newExpense.category}
                        onChange={handleInputChange}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddExpense}
                        style={{ marginTop: '20px' }}
                    >
                        Añadir Gasto
                    </Button>
                </Box>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Descripción</TableCell>
                                <TableCell>Monto</TableCell>
                                <TableCell>Fecha</TableCell>
                                <TableCell>Categoría</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {expenses.map((expense, index) => (
                                <TableRow key={index}>
                                    <TableCell>{expense.description}</TableCell>
                                    <TableCell>{expense.amount}</TableCell>
                                    <TableCell>{expense.date}</TableCell>
                                    <TableCell>{expense.category}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Container>
    );
}

export default Expenses;
