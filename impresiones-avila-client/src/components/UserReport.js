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

function UserReport() {
    const [users, setUsers] = useState([]);
    const [fields, setFields] = useState(['user_id', 'username', 'email', 'created_at', 'role']);
    const [usernameFilter, setUsernameFilter] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [availableFields] = useState(['user_id', 'username', 'email', 'created_at', 'role']);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3001/users', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
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
                username: usernameFilter,
                role: roleFilter,
                start_date: dateRange.start,
                end_date: dateRange.end
            }).toString();
            const response = await axios.get(`http://localhost:3001/generate-user-report?${queryString}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'user_report.pdf');
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error('Error downloading the report:', error);
        }
    };

    const handleFieldChange = (event) => {
        setFields(event.target.value);
    };

    const handleUsernameFilterChange = (event) => {
        setUsernameFilter(event.target.value);
    };

    const handleRoleFilterChange = (event) => {
        setRoleFilter(event.target.value);
    };

    const handleDateRangeChange = (field) => (event) => {
        setDateRange({ ...dateRange, [field]: event.target.value });
    };

    const getFilteredUsers = () => {
        return users.filter(user => {
            const usernameMatch = user.username.toLowerCase().includes(usernameFilter.toLowerCase());
            const roleMatch = roleFilter === '' || user.role === roleFilter;
            const startDateMatch = dateRange.start === '' || new Date(user.created_at) >= new Date(dateRange.start);
            const endDateMatch = dateRange.end === '' || new Date(user.created_at) <= new Date(dateRange.end);
            return usernameMatch && roleMatch && startDateMatch && endDateMatch;
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
                    label: 'User Roles',
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
                        label="Buscar por Nombre de Usuario"
                        variant="outlined"
                        value={usernameFilter}
                        onChange={handleUsernameFilterChange}
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Filtrar por Rol</InputLabel>
                        <Select
                            value={roleFilter}
                            onChange={handleRoleFilterChange}
                        >
                            <MenuItem value=""><em>Todos</em></MenuItem>
                            <MenuItem value="admin">Administrador</MenuItem>
                            <MenuItem value="user">Usuario</MenuItem>
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
                                {fields.includes('username') && <TableCell>Nombre de usuario</TableCell>}
                                {fields.includes('email') && <TableCell>Email</TableCell>}
                                {fields.includes('created_at') && <TableCell>Fecha de creación</TableCell>}
                                {fields.includes('role') && <TableCell>Rol</TableCell>}
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

export default UserReport;
