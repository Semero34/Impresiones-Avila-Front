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
} from '@mui/material';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import 'tailwindcss/tailwind.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function SalesReport() {
    const [sales, setSales] = useState([]);
    const [fields, setFields] = useState(['invoice_id', 'description', 'quantity', 'unit_price']);
    const [descriptionFilter, setDescriptionFilter] = useState('');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [availableFields] = useState(['invoice_id', 'description', 'quantity', 'unit_price']);

    useEffect(() => {
        const fetchSales = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/sales`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setSales(response.data);
            } catch (error) {
                console.error('Error fetching sales:', error);
            }
        };

        fetchSales();
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
                description: descriptionFilter,
                start_date: dateRange.start,
                end_date: dateRange.end
            }).toString();
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/generate-sales-report?${queryString}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'sales_report.pdf');
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error('Error downloading the report:', error);
        }
    };

    const handleFieldChange = (event) => {
        setFields(event.target.value);
    };

    const handleDescriptionFilterChange = (event) => {
        setDescriptionFilter(event.target.value);
    };

    const handleDateRangeChange = (field) => (event) => {
        setDateRange({ ...dateRange, [field]: event.target.value });
    };

    const getFilteredSales = () => {
        return sales.filter(sale => {
            const descriptionMatch = sale.description?.toLowerCase().includes(descriptionFilter.toLowerCase());
            const startDateMatch = dateRange.start === '' || new Date(sale.issue_date) >= new Date(dateRange.start);
            const endDateMatch = dateRange.end === '' || new Date(sale.issue_date) <= new Date(dateRange.end);
            return descriptionMatch && startDateMatch && endDateMatch;
        });
    };

    const getChartData = () => {
        const productCounts = sales.reduce((acc, sale) => {
            acc[sale.description] = (acc[sale.description] || 0) + sale.quantity;
            return acc;
        }, {});

        return {
            labels: Object.keys(productCounts),
            datasets: [
                {
                    label: 'Ventas por Producto',
                    data: Object.values(productCounts),
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                },
            ],
        };
    };

    return (
        <Container maxWidth="lg">
            <Box mt={5}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Reporte de Ventas
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
                        label="Buscar por Descripción"
                        variant="outlined"
                        value={descriptionFilter}
                        onChange={handleDescriptionFilterChange}
                    />
                    <Box display="flex" justifyContent="space-between">
                        <TextField
                            label="Fecha de Inicio"
                            type="date"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={dateRange.start}
                            onChange={handleDateRangeChange('start')}
                            fullWidth
                            margin="normal"
                        />
                        <Box mx={2}></Box>
                        <TextField
                            label="Fecha de Fin"
                            type="date"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={dateRange.end}
                            onChange={handleDateRangeChange('end')}
                            fullWidth
                            margin="normal"
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
                                {fields.includes('invoice_id') && <TableCell>ID</TableCell>}
                                {fields.includes('description') && <TableCell>Descripción</TableCell>}
                                {fields.includes('quantity') && <TableCell>Cantidad</TableCell>}
                                {fields.includes('unit_price') && <TableCell>Precio Unitario</TableCell>}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {getFilteredSales().map((sale) => (
                                <TableRow key={sale.invoice_id}>
                                    {fields.includes('invoice_id') && <TableCell>{sale.invoice_id}</TableCell>}
                                    {fields.includes('description') && <TableCell>{sale.description}</TableCell>}
                                    {fields.includes('quantity') && <TableCell>{sale.quantity}</TableCell>}
                                    {fields.includes('unit_price') && <TableCell>{sale.unit_price}</TableCell>}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box mt={5}>
                    <Typography variant="h5" component="h2" gutterBottom>
                        Visualización de Datos
                    </Typography>
                    <div className="relative h-96">
                        <Bar data={getChartData()} options={{ responsive: true, maintainAspectRatio: false }} />
                    </div>
                </Box>
            </Box>
        </Container>
    );
}

export default SalesReport;
