import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box, FormControl, InputLabel, Select, MenuItem, Paper } from '@mui/material';

function EditProduct() {
    const { id } = useParams();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [costPrice, setCostPrice] = useState(''); // Nuevo estado para cost_price
    const [stock, setStock] = useState('');
    const [image, setImage] = useState(null);
    const [iva] = useState(13); // IVA fijo al 13%
    const [discount, setDiscount] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/products/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const product = response.data;
                setName(product.name);
                setDescription(product.description);
                setCategory(product.category);
                setPrice(product.price);
                setCostPrice(product.cost_price); // Establecer cost_price
                setStock(product.stock);
                setDiscount(product.discount);
                setImage(product.image);
            } catch (error) {
                setMessage('Error al obtener los datos del producto');
                console.error('Error fetching product:', error);
            }
        };
        fetchProduct();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validaciones
        if (!name || !description || !category || !price || !stock || !costPrice) { // Añadir costPrice a las validaciones
            setMessage('Por favor, complete todos los campos requeridos.');
            return;
        }
        if (parseFloat(price) <= 0 || parseFloat(costPrice) <= 0) { // Añadir costPrice a las validaciones
            setMessage('El precio y el costo deben ser valores positivos.');
            return;
        }
        if (parseInt(stock) < 0) {
            setMessage('El stock no puede ser negativo.');
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('category', category);
        formData.append('price', price);
        formData.append('cost_price', costPrice); // Añadir cost_price al formData
        formData.append('stock', stock);
        formData.append('iva', iva); // IVA fijo al 13%
        formData.append('discount', discount);
        if (image) {
            formData.append('image', image);
        }
    
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${process.env.REACT_APP_API_URL}/products/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            setMessage('Producto actualizado con éxito');
            navigate('/products');
        } catch (error) {
            setMessage('Error al actualizar el producto');
            console.error('Error updating product:', error);
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
                        Editar Producto
                    </Typography>
                </Box>
                {message && <Typography color={message.includes('éxito') ? 'primary' : 'error'} variant="body2" style={{ marginTop: '20px' }}>{message}</Typography>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <TextField
                        label="Nombre"
                        fullWidth
                        margin="normal"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        variant="outlined"
                        InputLabelProps={{
                            shrink: true,
                            sx: { top: '8px', left: '12px' },
                        }}
                        InputProps={{
                            sx: { borderRadius: '20px' },
                        }}
                    />
                    <TextField
                        label="Descripción"
                        fullWidth
                        margin="normal"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        variant="outlined"
                        InputLabelProps={{
                            shrink: true,
                            sx: { top: '8px', left: '12px' },
                        }}
                        InputProps={{
                            sx: { borderRadius: '20px' },
                        }}
                    />
                    <FormControl fullWidth margin="normal" variant="outlined">
                        <InputLabel>Categoría</InputLabel>
                        <Select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                            label="Categoría"
                            sx={{ borderRadius: '20px' }}
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
                        required
                        variant="outlined"
                        InputLabelProps={{
                            shrink: true,
                            sx: { top: '8px', left: '12px' },
                        }}
                        InputProps={{
                            sx: { borderRadius: '20px' },
                        }}
                    />
                    <TextField
                        label="Costo"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={costPrice}
                        onChange={(e) => setCostPrice(e.target.value)} // Maneja el cambio de costPrice
                        required
                        variant="outlined"
                        InputLabelProps={{
                            shrink: true,
                            sx: { top: '8px', left: '12px' },
                        }}
                        InputProps={{
                            sx: { borderRadius: '20px' },
                        }}
                    />
                    <TextField
                        label="Stock"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        required
                        variant="outlined"
                        InputLabelProps={{
                            shrink: true,
                            sx: { top: '8px', left: '12px' },
                        }}
                        InputProps={{
                            sx: { borderRadius: '20px' },
                        }}
                    />
                    <TextField
                        label="Descuento"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                        required
                        variant="outlined"
                        InputLabelProps={{
                            shrink: true,
                            sx: { top: '8px', left: '12px' },
                        }}
                        InputProps={{
                            sx: { borderRadius: '20px' },
                        }}
                    />
                    <Typography variant="h6" gutterBottom>Precio Final: {calculateFinalPrice()}</Typography>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}
                        style={{ marginTop: '20px', marginBottom: '20px' }}
                        className="w-full"
                    />
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
                        Actualizar Producto
                    </Button>
                </form>
            </Paper>
        </Container>
    );
}

export default EditProduct;
