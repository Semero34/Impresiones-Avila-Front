import React, { useState, useEffect, useRef } from 'react';
import { Container, Typography, Box, Grid, Paper, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Select, MenuItem } from '@mui/material';
import { Bar, Line, Pie } from 'react-chartjs-2';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { MonetizationOn, TrendingUp, ShowChart } from '@mui/icons-material';

function FinancialReport() {
    const [financialData, setFinancialData] = useState({});
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [departmentFilter, setDepartmentFilter] = useState('all');
    const [thresholdAlerts, setThresholdAlerts] = useState([]);

    const revenueChartRef = useRef(null);
    const expensesChartRef = useRef(null);
    const comparisonChartRef = useRef(null);
    const netIncomeChartRef = useRef(null);
    const costDistributionChartRef = useRef(null);

    useEffect(() => {
        fetchFinancialData();
    }, [departmentFilter]);

    const fetchFinancialData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('${process.env.REACT_APP_API_URL}/generate-financial-report', {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    start_date: dateRange.start || '2024-01-01',
                    end_date: dateRange.end || '2024-12-31',
                    department: departmentFilter
                }
            });
            setFinancialData(response.data);
            checkThresholds(response.data);
        } catch (error) {
            console.error('Error fetching financial data:', error);
        }
    };

    const checkThresholds = (data) => {
        const alerts = [];
        if (data.netIncome < 10000) {
            alerts.push('La utilidad neta está por debajo del umbral esperado.');
        }
        if (data.revenue < 50000) {
            alerts.push('Los ingresos están por debajo del umbral.');
        }
        setThresholdAlerts(alerts);
    };

    const generatePDF = () => {
        const doc = new jsPDF();
        let yPosition = 10;

        // Título
        doc.text('Reporte Financiero', 20, yPosition);
        yPosition += 10;

        // Tabla con datos financieros
        doc.autoTable({
            startY: yPosition,
            head: [['Concepto', 'Monto']],
            body: [
                ['Ingresos', financialData.revenue],
                ['Costo de Ventas', financialData.costOfGoodsSold],
                ['Utilidad Bruta', financialData.grossProfit],
                ['Gastos Operativos', financialData.operatingExpenses],
                ['Utilidad Neta', financialData.netIncome],
            ],
            margin: { top: 20 },
            didDrawPage: (data) => {
                yPosition = data.cursor.y;
            },
        });

        // Gráficos como imágenes
        if (revenueChartRef.current) {
            const revenueChartImage = revenueChartRef.current.toBase64Image();
            if (yPosition + 100 > doc.internal.pageSize.height - 10) {
                doc.addPage();
                yPosition = 10;
            }
            doc.addImage(revenueChartImage, 'PNG', 20, yPosition, 160, 90);
            yPosition += 100;
        }

        doc.save('reporte_financiero.pdf');
    };

    const exportExcel = () => {
        const ws = XLSX.utils.json_to_sheet([
            { Concepto: 'Ingresos', Monto: financialData.revenue },
            { Concepto: 'Costo de Ventas', Monto: financialData.costOfGoodsSold },
            { Concepto: 'Utilidad Bruta', Monto: financialData.grossProfit },
            { Concepto: 'Gastos Operativos', Monto: financialData.operatingExpenses },
            { Concepto: 'Utilidad Neta', Monto: financialData.netIncome },
        ]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Reporte Financiero');
        XLSX.writeFile(wb, 'reporte_financiero.xlsx');
    };

    const exportCSV = () => {
        const csvData = [
            ['Concepto', 'Monto'],
            ['Ingresos', financialData.revenue],
            ['Costo de Ventas', financialData.costOfGoodsSold],
            ['Utilidad Bruta', financialData.grossProfit],
            ['Gastos Operativos', financialData.operatingExpenses],
            ['Utilidad Neta', financialData.netIncome],
        ];
        const csvString = csvData.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'reporte_financiero.csv');
        document.body.appendChild(link);
        link.click();
    };

    const revenueByCategoryData = {
        labels: financialData.revenueByCategory ? financialData.revenueByCategory.map(item => item.category) : [],
        datasets: [{
            label: 'Ingresos por Categoría',
            data: financialData.revenueByCategory ? financialData.revenueByCategory.map(item => item.revenue) : [],
            backgroundColor: ['#6A5ACD', '#9370DB', '#7B68EE', '#BA55D3', '#8A2BE2'],
        }],
    };

    // Gráfico de utilidad neta mensual
    const netIncomeMonthlyData = {
        labels: financialData.monthlyNetIncome ? financialData.monthlyNetIncome.map(item => item.month) : [],
        datasets: [{
            label: 'Utilidad Neta Mensual',
            data: financialData.monthlyNetIncome ? financialData.monthlyNetIncome.map(item => item.netIncome) : [],
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
        }],
    };

    // Distribución de costos por categoría
    const costDistributionData = {
        labels: financialData.costByCategory ? financialData.costByCategory.map(item => item.category) : [],
        datasets: [{
            label: 'Costos por Categoría',
            data: financialData.costByCategory ? financialData.costByCategory.map(item => item.cost) : [],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
        }],
    };

    // Gráfico de líneas para ingresos y gastos operativos
    const lineChartData = {
        labels: ['Período Anterior', 'Período Actual'],
        datasets: [
            {
                label: 'Ingresos',
                data: [financialData.previousRevenue, financialData.revenue],
                fill: false,
                backgroundColor: 'rgba(106, 90, 205, 0.6)',
                borderColor: 'rgba(106, 90, 205, 1)',
            },
            {
                label: 'Gastos Operativos',
                data: [financialData.previousOperatingExpenses, financialData.operatingExpenses],
                fill: false,
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
            }
        ],
    };

    return (
        <Container maxWidth="lg">
            <Box mt={5}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Reporte Financiero
                </Typography>

                <Box mb={3}>
                    <TextField
                        label="Fecha de Inicio"
                        type="date"
                        value={dateRange.start}
                        onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Fecha de Fin"
                        type="date"
                        value={dateRange.end}
                        onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        fullWidth
                        margin="normal"
                    />
                    <Select
                        label="Filtrar por Departamento"
                        value={departmentFilter}
                        onChange={(e) => setDepartmentFilter(e.target.value)}
                        fullWidth
                        margin="normal"
                    >
                        <MenuItem value="all">Todos los Departamentos</MenuItem>
                        <MenuItem value="ventas">Ventas</MenuItem>
                        <MenuItem value="logistica">Logística</MenuItem>
                        <MenuItem value="produccion">Producción</MenuItem>
                    </Select>
                </Box>

                {thresholdAlerts.length > 0 && (
                    <Box mb={3}>
                        {thresholdAlerts.map((alert, index) => (
                            <Paper elevation={3} key={index} style={{ padding: '10px', backgroundColor: '#ffcccc', marginBottom: '10px' }}>
                                <Typography variant="body1" color="error">
                                    {alert}
                                </Typography>
                            </Paper>
                        ))}
                    </Box>
                )}

                <Grid container spacing={3} mb={3}>
                    <Grid item xs={12} sm={6} md={4}>
                        <Paper elevation={3} style={{ padding: '20px', backgroundColor: financialData.netIncome > 0 ? '#d4edda' : '#f8d7da', borderRadius: '10px', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)' }}>
                            <Typography variant="h6" color={financialData.netIncome > 0 ? 'green' : 'red'}><MonetizationOn /> Utilidad Neta</Typography>
                            <Typography variant="h4">{financialData.netIncome}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Paper elevation={3} style={{ padding: '20px', backgroundColor: financialData.revenue > 0 ? '#d4edda' : '#f8d7da', borderRadius: '10px', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)' }}>
                            <Typography variant="h6" color={financialData.revenue > 0 ? 'green' : 'red'}><TrendingUp /> Ingresos</Typography>
                            <Typography variant="h4">{financialData.revenue}</Typography>
                        </Paper>
                    </Grid>
                </Grid>

                {financialData.revenue !== undefined ? (
                    <>
                        <Button variant="contained" color="primary" onClick={generatePDF} style={{ marginBottom: '20px', borderRadius: '20px', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)' }}>
                            Descargar PDF
                        </Button>
                        <Button variant="contained" color="success" onClick={exportExcel} style={{ marginBottom: '20px', marginLeft: '10px', borderRadius: '20px', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)' }}>
                            Descargar Excel
                        </Button>
                        <Button variant="contained" color="secondary" onClick={exportCSV} style={{ marginBottom: '20px', marginLeft: '10px', borderRadius: '20px', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)' }}>
                            Descargar CSV
                        </Button>

                        {/* Tabla estilizada */}
                        <TableContainer component={Paper} style={{ marginTop: '20px', borderRadius: '15px', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)' }}>
                            <Table>
                                <TableHead style={{ backgroundColor: '#f5f5f5' }}>
                                    <TableRow>
                                        <TableCell style={{ fontWeight: 'bold', color: '#555', textAlign: 'center' }}>Concepto</TableCell>
                                        <TableCell style={{ fontWeight: 'bold', color: '#555', textAlign: 'center' }}>Monto</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow hover style={{ cursor: 'pointer', transition: 'background-color 0.3s' }}>
                                        <TableCell style={{ textAlign: 'center', padding: '15px' }}>Ingresos</TableCell>
                                        <TableCell style={{ textAlign: 'center', padding: '15px' }}>{financialData.revenue}</TableCell>
                                    </TableRow>
                                    <TableRow hover style={{ cursor: 'pointer', transition: 'background-color 0.3s' }}>
                                        <TableCell style={{ textAlign: 'center', padding: '15px' }}>Costo de Ventas</TableCell>
                                        <TableCell style={{ textAlign: 'center', padding: '15px' }}>{financialData.costOfGoodsSold}</TableCell>
                                    </TableRow>
                                    <TableRow hover style={{ cursor: 'pointer', transition: 'background-color 0.3s' }}>
                                        <TableCell style={{ textAlign: 'center', padding: '15px' }}>Utilidad Bruta</TableCell>
                                        <TableCell style={{ textAlign: 'center', padding: '15px' }}>{financialData.grossProfit}</TableCell>
                                    </TableRow>
                                    <TableRow hover style={{ cursor: 'pointer', transition: 'background-color 0.3s' }}>
                                        <TableCell style={{ textAlign: 'center', padding: '15px' }}>Gastos Operativos</TableCell>
                                        <TableCell style={{ textAlign: 'center', padding: '15px' }}>{financialData.operatingExpenses}</TableCell>
                                    </TableRow>
                                    <TableRow hover style={{ cursor: 'pointer', transition: 'background-color 0.3s' }}>
                                        <TableCell style={{ textAlign: 'center', padding: '15px' }}>Utilidad Neta</TableCell>
                                        <TableCell style={{ textAlign: 'center', padding: '15px' }}>{financialData.netIncome}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Grid container spacing={3} mt={5}>
                            <Grid item xs={12} sm={6} md={4}>
                                <Paper elevation={3} style={{ padding: '10px', borderRadius: '15px', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)' }}>
                                    <Typography variant="h6" gutterBottom><MonetizationOn /> Ingresos por Categoría</Typography>
                                    <div style={{ height: '200px' }}>
                                        <Pie ref={revenueChartRef} data={revenueByCategoryData} options={{ responsive: true, maintainAspectRatio: false }} />
                                    </div>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={12} md={4}>
                                <Paper elevation={3} style={{ padding: '10px', borderRadius: '15px', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)' }}>
                                    <Typography variant="h6" gutterBottom><ShowChart /> Comparación de Períodos</Typography>
                                    <div style={{ height: '200px' }}>
                                        <Line ref={comparisonChartRef} data={lineChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                                    </div>
                                </Paper>
                            </Grid>

                            <Grid item xs={12} sm={6} md={4}>
                                <Paper elevation={3} style={{ padding: '10px', borderRadius: '15px', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)' }}>
                                    <Typography variant="h6" gutterBottom>Utilidad Neta Mensual</Typography>
                                    <div style={{ height: '200px' }}>
                                        <Bar ref={netIncomeChartRef} data={netIncomeMonthlyData} options={{ responsive: true, maintainAspectRatio: false }} />
                                    </div>
                                </Paper>
                            </Grid>

                            <Grid item xs={12} sm={6} md={4}>
                                <Paper elevation={3} style={{ padding: '10px', borderRadius: '15px', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)' }}>
                                    <Typography variant="h6" gutterBottom>Distribución de Costos por Categoría</Typography>
                                    <div style={{ height: '200px' }}>
                                        <Pie ref={costDistributionChartRef} data={costDistributionData} options={{ responsive: true, maintainAspectRatio: false }} />
                                    </div>
                                </Paper>
                            </Grid>
                        </Grid>
                    </>
                ) : (
                    <Typography variant="h6" color="textSecondary" align="center">
                        No se encontraron datos para el rango de fechas seleccionado.
                    </Typography>
                )}
            </Box>
        </Container>
    );
}

export default FinancialReport;
