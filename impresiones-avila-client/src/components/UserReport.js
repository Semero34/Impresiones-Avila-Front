import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container,
    Typography,
    Box,
    Grid,
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
    CircularProgress,
} from '@mui/material';
import { Bar } from 'react-chartjs-2';
import 'tailwindcss/tailwind.css';

function UserReport() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fields, setFields] = useState(['user_id', 'username', 'email', 'created_at', 'role', 'status']);
    const [filters, setFilters] = useState({
        username: '',
        role: '',
        status: '',
        startDate: '',
        endDate: '',
    });
    const [availableFields] = useState(['user_id', 'username', 'email', 'created_at', 'role', 'status', 'last_login']);
    
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('${process.env.REACT_APP_API_URL}/users', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFieldChange = (event) => {
        setFields(event.target.value);
    };

    const handleFilterChange = (field) => (event) => {
        setFilters({ ...filters, [field]: event.target.value });
    };

    const handleDownload = async (format) => {
        try {
            const token = localStorage.getItem('token');
            const queryString = new URLSearchParams({
                fields: fields.join(','),
                ...filters,
            }).toString();

            const response = await axios.get(`${process.env.REACT_APP_API_URL}/generate-user-report?${queryString}&format=${format}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `user_report.${format}`);
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error('Error downloading report:', error);
        }
    };

    const getFilteredUsers = () => {
        return users.filter((user) => {
            const matchesUsername = user.username.toLowerCase().includes(filters.username.toLowerCase());
            const matchesRole = filters.role === '' || user.role === filters.role;
            const matchesStatus = filters.status === '' || user.status === filters.status;
            const matchesStartDate = filters.startDate === '' || new Date(user.created_at) >= new Date(filters.startDate);
            const matchesEndDate = filters.endDate === '' || new Date(user.created_at) <= new Date(filters.endDate);
            return matchesUsername && matchesRole && matchesStatus && matchesStartDate && matchesEndDate;
        });
    };

    const getChartData = () => {
        const roles = users.reduce((acc, user) => {
            acc[user.role] = (acc[user.role] || 0) + 1;
            return acc;
        }, {});

        return {
            labels: Object.keys(roles),
            datasets: [
                {
                    label: 'Usuarios por Rol',
                    data: Object.values(roles),
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
                    Reporte de Usuarios
                </Typography>
                {loading ? (
                    <CircularProgress />
                ) : (
                    <>
                        <Box mb={3}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6} md={3}>
                                    <TextField
                                        fullWidth
                                        margin="normal"
                                        label="Buscar por Nombre"
                                        variant="outlined"
                                        value={filters.username}
                                        onChange={handleFilterChange('username')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <FormControl fullWidth margin="normal">
                                        <InputLabel>Filtrar por Rol</InputLabel>
                                        <Select
                                            value={filters.role}
                                            onChange={handleFilterChange('role')}
                                        >
                                            <MenuItem value=""><em>Todos</em></MenuItem>
                                            <MenuItem value="admin">Administrador</MenuItem>
                                            <MenuItem value="user">Usuario</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <FormControl fullWidth margin="normal">
                                        <InputLabel>Filtrar por Estado</InputLabel>
                                        <Select
                                            value={filters.status}
                                            onChange={handleFilterChange('status')}
                                        >
                                            <MenuItem value=""><em>Todos</em></MenuItem>
                                            <MenuItem value="active">Activo</MenuItem>
                                            <MenuItem value="inactive">Inactivo</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <TextField
                                        label="Fecha de Inicio"
                                        type="date"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        value={filters.startDate}
                                        onChange={handleFilterChange('startDate')}
                                        fullWidth
                                        margin="normal"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <TextField
                                        label="Fecha de Fin"
                                        type="date"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        value={filters.endDate}
                                        onChange={handleFilterChange('endDate')}
                                        fullWidth
                                        margin="normal"
                                    />
                                </Grid>
                            </Grid>

                            <FormControl fullWidth margin="normal">
                                <InputLabel>Seleccionar Campos</InputLabel>
                                <Select
                                    multiple
                                    value={fields}
                                    onChange={handleFieldChange}
                                    renderValue={(selected) =>
                                        selected.map((field) => field.replace('_', ' ').toUpperCase()).join(', ')
                                    }
                                >
                                    {availableFields.map((field) => (
                                        <MenuItem key={field} value={field}>
                                            <Checkbox checked={fields.includes(field)} />
                                            <ListItemText primary={field.replace('_', ' ').toUpperCase()} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>

                        <Grid container spacing={2}>
                            <Grid item>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleDownload('pdf')}
                                >
                                    Descargar PDF
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => handleDownload('csv')}
                                >
                                    Descargar CSV
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={() => handleDownload('xlsx')}
                                >
                                    Descargar Excel
                                </Button>
                            </Grid>
                        </Grid>

                        <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        {fields.includes('user_id') && <TableCell>ID</TableCell>}
                                        {fields.includes('username') && <TableCell>Nombre de usuario</TableCell>}
                                        {fields.includes('email') && <TableCell>Email</TableCell>}
                                        {fields.includes('created_at') && <TableCell>Fecha de creación</TableCell>}
                                        {fields.includes('role') && <TableCell>Rol</TableCell>}
                                        {fields.includes('status') && <TableCell>Estado</TableCell>}
                                        {fields.includes('last_login') && <TableCell>Último Login</TableCell>}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {getFilteredUsers().map((user) => (
                                        <TableRow key={user.user_id}>
                                            {fields.includes('user_id') && <TableCell>{user.user_id}</TableCell>}
                                            {fields.includes('username') && <TableCell>{user.username}</TableCell>}
                                            {fields.includes('email') && <TableCell>{user.email}</TableCell>}
                                            {fields.includes('created_at') && <TableCell>{user.created_at}</TableCell>}
                                            {fields.includes('role') && <TableCell>{user.role}</TableCell>}
                                            {fields.includes('status') && <TableCell>{user.status}</TableCell>}
                                            {fields.includes('last_login') && <TableCell>{user.last_login}</TableCell>}
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
                    </>
                )}
            </Box>
        </Container>
    );
}

export default UserReport;
