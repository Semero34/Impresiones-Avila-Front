import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container,
    Typography,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    ListItemText,
    Grid,
} from '@mui/material';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    PointElement
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import 'tailwindcss/tailwind.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    PointElement
);

function InventoryReport() {
    const [products, setProducts] = useState([]);
    const [fields, setFields] = useState(['product_id', 'name', 'stock', 'price']);
    const [nameFilter, setNameFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [priceRange, setPriceRange] = useState([0, 10000]);
    const [availableFields] = useState(['product_id', 'name', 'stock', 'price', 'category']);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3001/products', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    const handleDownload = async () => {
        try {
            if (fields.length === 0) {
                alert('Por favor, selecciona al menos un campo.');
                return;
            }

            const token = localStorage.getItem('token');
            const queryString = new URLSearchParams({
                fields: fields.join(','),
                name: nameFilter,
                category: categoryFilter,
                price_min: priceRange[0],
                price_max: priceRange[1]
            }).toString();
            const response = await axios.get(`http://localhost:3001/generate-inventory-report?${queryString}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'inventory_report.pdf');
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error('Error downloading the report:', error);
        }
    };

    const handleFieldChange = (event) => {
        setFields(event.target.value);
    };

    const handleNameFilterChange = (event) => {
        setNameFilter(event.target.value);
    };

    const handleCategoryChange = (event) => {
        setCategoryFilter(event.target.value);
    };

    const handlePriceRangeChange = (event) => {
        const { value, name } = event.target;
        setPriceRange(prev => name === 'min' ? [value, prev[1]] : [prev[0], value]);
    };

    const getFilteredProducts = () => {
        return products.filter(product => 
            product.name?.toLowerCase().includes(nameFilter.toLowerCase()) &&
            product.category?.toLowerCase().includes(categoryFilter.toLowerCase()) &&
            product.price >= priceRange[0] &&
            product.price <= priceRange[1]
        );
    };

    const getChartData = () => {
        const stockCounts = products.reduce((acc, product) => {
            acc[product.name] = (acc[product.name] || 0) + product.stock;
            return acc;
        }, {});

        return {
            labels: Object.keys(stockCounts),
            datasets: [
                {
                    label: 'Stock por Producto',
                    data: Object.values(stockCounts),
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                },
            ],
        };
    };

    const getCategoryData = () => {
        const categoryCounts = products.reduce((acc, product) => {
            acc[product.category] = (acc[product.category] || 0) + 1;
            return acc;
        }, {});

        return {
            labels: Object.keys(categoryCounts),
            datasets: [
                {
                    label: 'Productos por Categoría',
                    data: Object.values(categoryCounts),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(153, 102, 255, 0.6)',
                        'rgba(255, 159, 64, 0.6)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1,
                },
            ],
        };
    };

    return (
        <Container maxWidth="lg">
            <Box mt={5}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Reporte de Inventario
                </Typography>
                <Box mb={3}>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Seleccionar Campos</InputLabel>
                        <Select
                            multiple
                            value={fields}
                            onChange={handleFieldChange}
                            renderValue={(selected) => selected.map(field => field.replace('_', ' ').toUpperCase()).join(', ')}
                            MenuProps={{
                                PaperProps: {
                                    style: {
                                        maxHeight: 200,
                                    },
                                },
                            }}
                        >
                            {availableFields.map((field) => (
                                <MenuItem key={field} value={field}>
                                    <Checkbox checked={fields.includes(field)} />
                                    <ListItemText primary={field.replace('_', ' ').toUpperCase()} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Buscar por Nombre"
                        variant="outlined"
                        value={nameFilter}
                        onChange={handleNameFilterChange}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Buscar por Categoría"
                        variant="outlined"
                        value={categoryFilter}
                        onChange={handleCategoryChange}
                    />
                    <Box display="flex" justifyContent="space-between" mt={2}>
                        <TextField
                            label="Precio Mínimo"
                            variant="outlined"
                            type="number"
                            name="min"
                            value={priceRange[0]}
                            onChange={handlePriceRangeChange}
                            fullWidth
                            margin="normal"
                            sx={{ mr: 2 }}
                        />
                        <TextField
                            label="Precio Máximo"
                            variant="outlined"
                            type="number"
                            name="max"
                            value={priceRange[1]}
                            onChange={handlePriceRangeChange}
                            fullWidth
                            margin="normal"
                            sx={{ ml: 2 }}
                        />
                    </Box>
                </Box>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleDownload}
                    style={{ marginBottom: '20px' }}
                >
                    Generar PDF
                </Button>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {fields.includes('product_id') && <TableCell>ID</TableCell>}
                                {fields.includes('name') && <TableCell>Nombre</TableCell>}
                                {fields.includes('stock') && <TableCell>Cantidad en Stock</TableCell>}
                                {fields.includes('price') && <TableCell>Precio</TableCell>}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {getFilteredProducts().map((product) => (
                                <TableRow key={product.product_id}>
                                    {fields.includes('product_id') && <TableCell>{product.product_id}</TableCell>}
                                    {fields.includes('name') && <TableCell>{product.name}</TableCell>}
                                    {fields.includes('stock') && <TableCell>{product.stock}</TableCell>}
                                    {fields.includes('price') && <TableCell>{product.price}</TableCell>}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box mt={5}>
                    <Typography variant="h5" component="h2" gutterBottom>
                        Visualización de Datos
                    </Typography>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                            <div className="relative h-72">
                                <Bar data={getChartData()} options={{ responsive: true, maintainAspectRatio: false }} />
                            </div>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <div className="relative h-72">
                                <Pie data={getCategoryData()} options={{ responsive: true, maintainAspectRatio: false }} />
                            </div>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
}

export default InventoryReport;
