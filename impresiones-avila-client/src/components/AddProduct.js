import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, Box, TextField, Button, Paper, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function AddProduct() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [costPrice, setCostPrice] = useState(''); // Nuevo estado para cost_price
    const [stock, setStock] = useState('');
    const [image, setImage] = useState(null);
    const [iva] = useState(13); // IVA fijo al 13%
    const [discount, setDiscount] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validaciones
        if (!name || !description || !category || !price || !stock || !costPrice) { // Asegúrate de validar cost_price
            setErrorMessage('Por favor, complete todos los campos requeridos.');
            return;
        }
        if (parseFloat(price) <= 0 || parseFloat(costPrice) <= 0) { // Asegúrate de validar cost_price
            setErrorMessage('El precio y el costo deben ser valores positivos.');
            return;
        }
        if (parseInt(stock) < 0) {
            setErrorMessage('El stock no puede ser negativo.');
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('category', category);
        formData.append('price', price);
        formData.append('cost_price', costPrice); // Añadir cost_price al formData
        formData.append('stock', stock);
        formData.append('iva', iva);
        formData.append('discount', discount);
        if (image) {
            formData.append('image', image);
        }

        try {
            const token = localStorage.getItem('token');
            await axios.post('${process.env.REACT_APP_API_URL}/products', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            navigate('/products');
        } catch (error) {
            console.error('Error adding product:', error);
            setErrorMessage('Ocurrió un error al agregar el producto.');
        }
    };

    const calculateFinalPrice = () => {
        const finalPrice = (parseFloat(price) - parseFloat(discount) + (parseFloat(price) * iva / 100)).toFixed(2);
        return finalPrice;
    };

    return (
        <Container maxWidth="sm" className="min-h-screen flex items-center justify-center">
            <Paper elevation={6} className="p-8 rounded-lg">
                <Box mb={5} textAlign="center">
                    <Typography variant="h4" component="h1" gutterBottom>
                        Agregar Producto
                    </Typography>
                </Box>
                {errorMessage && <Typography color="error">{errorMessage}</Typography>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <TextField
                        label="Nombre"
                        fullWidth
                        margin="normal"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
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
                        label="Descripción"
                        fullWidth
                        margin="normal"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
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
                    <FormControl fullWidth margin="normal" variant="outlined">
                        <InputLabel>Categoría</InputLabel>
                        <Select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            label="Categoría"
                            sx={{
                                borderRadius: '20px',
                            }}
                        >
                            <MenuItem value="Electrónica">Electrónica</MenuItem>
                            <MenuItem value="Ropa">Ropa</MenuItem>
                            <MenuItem value="Hogar">Hogar</MenuItem>
                            <MenuItem value="Juguetes">Juguetes</MenuItem>
                            {/* Añade más categorías según sea necesario */}
                        </Select>
                    </FormControl>
                    <TextField
                        label="Precio"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
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
                        label="Costo"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={costPrice}
                        onChange={(e) => setCostPrice(e.target.value)} // Maneja el cambio de cost_price
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
                        label="Stock"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
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
                        label="Descuento"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
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
                    <Typography variant="h6" gutterBottom>Precio Final: {calculateFinalPrice()}</Typography>
                    <Button
                        variant="contained"
                        component="label"
                        fullWidth
                        sx={{
                            mt: 2,
                            bgcolor: 'purple',
                            color: 'white',
                            borderRadius: '20px',
                        }}
                    >
                        Subir Imagen
                        <input
                            type="file"
                            hidden
                            onChange={handleImageChange}
                        />
                    </Button>
                    <Button 
                        type="submit" 
                        variant="contained" 
                        color="primary" 
                        fullWidth 
                        sx={{ 
                            mt: 2, 
                            mb: 2, 
                            bgcolor: 'purple', 
                            color: 'white',
                            borderRadius: '20px' 
                        }}
                    >
                        Agregar
                    </Button>
                </form>
            </Paper>
        </Container>
    );
}

export default AddProduct;
