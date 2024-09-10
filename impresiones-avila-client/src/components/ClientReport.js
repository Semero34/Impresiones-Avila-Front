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
import { Bar } from 'react-chartjs-2';
import 'tailwindcss/tailwind.css';

function ClientReport() {
    const [clients, setClients] = useState([]);
    const [fields, setFields] = useState(['user_id', 'name', 'address', 'contact_info', 'client_type']);
    const [nameFilter, setNameFilter] = useState('');
    const [clientTypeFilter, setClientTypeFilter] = useState('');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [availableFields] = useState(['user_id', 'name', 'address', 'contact_info', 'client_type']);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('${process.env.REACT_APP_API_URL}/clients', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setClients(response.data);
            } catch (error) {
                console.error('Error fetching clients:', error);
            }
        };

        fetchClients();
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
                client_type: clientTypeFilter,
                start_date: dateRange.start,
                end_date: dateRange.end
            }).toString();
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/generate-client-report?${queryString}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'client_report.pdf');
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

    const handleClientTypeFilterChange = (event) => {
        setClientTypeFilter(event.target.value);
    };

    const handleDateRangeChange = (field) => (event) => {
        setDateRange({ ...dateRange, [field]: event.target.value });
    };

    const getFilteredClients = () => {
        return clients.filter(client => {
            const nameMatch = client.name.toLowerCase().includes(nameFilter.toLowerCase());
            const clientTypeMatch = clientTypeFilter === '' || client.client_type === clientTypeFilter;
            const startDateMatch = dateRange.start === '' || new Date(client.created_at) >= new Date(dateRange.start);
            const endDateMatch = dateRange.end === '' || new Date(client.created_at) <= new Date(dateRange.end);
            return nameMatch && clientTypeMatch && startDateMatch && endDateMatch;
        });
    };

    const getChartData = () => {
        const clientTypes = clients.reduce((acc, client) => {
            acc[client.client_type] = (acc[client.client_type] || 0) + 1;
            return acc;
        }, {});

        return {
            labels: Object.keys(clientTypes),
            datasets: [
                {
                    label: 'Tipos de Cliente',
                    data: Object.values(clientTypes),
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
                    Reporte de Clientes
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
                        label="Buscar por Nombre de Cliente"
                        variant="outlined"
                        value={nameFilter}
                        onChange={handleNameFilterChange}
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Filtrar por Tipo de Cliente</InputLabel>
                        <Select
                            value={clientTypeFilter}
                            onChange={handleClientTypeFilterChange}
                        >
                            <MenuItem value=""><em>Todos</em></MenuItem>
                            <MenuItem value="Tipo 1">Tipo 1</MenuItem>
                            <MenuItem value="Tipo 2">Tipo 2</MenuItem>
                        </Select>
                    </FormControl>
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
                                {fields.includes('user_id') && <TableCell>ID</TableCell>}
                                {fields.includes('name') && <TableCell>Nombre de Cliente</TableCell>}
                                {fields.includes('address') && <TableCell>Dirección</TableCell>}
                                {fields.includes('contact_info') && <TableCell>Información de Contacto</TableCell>}
                                {fields.includes('client_type') && <TableCell>Tipo de Cliente</TableCell>}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {getFilteredClients().map((client) => (
                                <TableRow key={client.user_id}>
                                    {fields.includes('user_id') && <TableCell>{client.user_id}</TableCell>}
                                    {fields.includes('name') && <TableCell>{client.name}</TableCell>}
                                    {fields.includes('address') && <TableCell>{client.address}</TableCell>}
                                    {fields.includes('contact_info') && <TableCell>{client.contact_info}</TableCell>}
                                    {fields.includes('client_type') && <TableCell>{client.client_type}</TableCell>}
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

export default ClientReport;
