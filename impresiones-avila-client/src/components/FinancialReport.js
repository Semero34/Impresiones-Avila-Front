import React, { useState, useEffect, useRef } from 'react';
import { Container, Typography, Box, Grid, Paper, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Bar, Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement } from 'chart.js';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement);

function FinancialReport() {
    const [financialData, setFinancialData] = useState({});
    const [dateRange, setDateRange] = useState({ start: '', end: '' });

    // Create refs for charts
    const revenueChartRef = useRef(null);
    const expensesChartRef = useRef(null);
    const comparisonChartRef = useRef(null);

    useEffect(() => {
        fetchFinancialData();
    }, []);

    const fetchFinancialData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3001/generate-financial-report', {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    start_date: dateRange.start || '2024-01-01', // Cambia estas fechas a un valor por defecto si es necesario
                    end_date: dateRange.end || '2024-12-31',
                }
            });
            setFinancialData(response.data);
        } catch (error) {
            console.error('Error fetching financial data:', error);
        }
    };

    const generatePDF = () => {
        const doc = new jsPDF();
        let yPosition = 10;

        // Add title
        doc.text('Reporte Financiero', 20, yPosition);
        yPosition += 10;

        // Add table with financial data
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
                yPosition = data.cursor.y; // Update yPosition to the end of the table
            },
        });

        // Add revenue by category chart as image
        if (revenueChartRef.current) {
            const revenueChartImage = revenueChartRef.current.toBase64Image();
            if (yPosition + 100 > doc.internal.pageSize.height - 10) {
                doc.addPage(); // Add a new page if there isn't enough space
                yPosition = 10;
            }
            doc.addImage(revenueChartImage, 'PNG', 20, yPosition, 160, 90);
            yPosition += 100;
        }

        // Add expenses by category chart as image
        if (expensesChartRef.current) {
            const expensesChartImage = expensesChartRef.current.toBase64Image();
            if (yPosition + 100 > doc.internal.pageSize.height - 10) {
                doc.addPage(); // Add a new page if there isn't enough space
                yPosition = 10;
            }
            doc.addImage(expensesChartImage, 'PNG', 20, yPosition, 160, 90);
            yPosition += 100;
        }

        // Add comparison chart as image
        if (comparisonChartRef.current) {
            const comparisonChartImage = comparisonChartRef.current.toBase64Image();
            if (yPosition + 100 > doc.internal.pageSize.height - 10) {
                doc.addPage(); // Add a new page if there isn't enough space
                yPosition = 10;
            }
            doc.addImage(comparisonChartImage, 'PNG', 20, yPosition, 160, 90);
        }

        doc.save('reporte_financiero.pdf');
    };

    const revenueByCategoryData = {
        labels: financialData.revenueByCategory ? financialData.revenueByCategory.map(item => item.category) : [],
        datasets: [{
            label: 'Ingresos por Categoría',
            data: financialData.revenueByCategory ? financialData.revenueByCategory.map(item => item.revenue) : [],
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
        }],
    };

    const expensesByCategoryData = {
        labels: financialData.expensesByCategory ? financialData.expensesByCategory.map(item => item.category) : [],
        datasets: [{
            label: 'Gastos por Categoría',
            data: financialData.expensesByCategory ? financialData.expensesByCategory.map(item => item.total_expense) : [],
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
        }],
    };

    const lineChartData = {
        labels: ['Período Anterior', 'Período Actual'],
        datasets: [
            {
                label: 'Ingresos',
                data: [financialData.previousRevenue, financialData.revenue],
                fill: false,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
            },
            {
                label: 'Costo de Ventas',
                data: [financialData.previousCostOfGoodsSold, financialData.costOfGoodsSold],
                fill: false,
                backgroundColor: 'rgba(255, 159, 64, 0.6)',
                borderColor: 'rgba(255, 159, 64, 1)',
            },
            {
                label: 'Utilidad Neta',
                data: [financialData.previousNetIncome, financialData.netIncome],
                fill: false,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
            }
        ],
    };

    return (
        <Container maxWidth="lg">
            <Box mt={5}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Reporte Financiero
                </Typography>
                {financialData.revenue !== undefined ? (
                    <>
                        <Button variant="contained" color="primary" onClick={generatePDF} style={{ marginBottom: '20px' }}>
                            Descargar PDF
                        </Button>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Concepto</TableCell>
                                        <TableCell>Monto</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Ingresos</TableCell>
                                        <TableCell>{financialData.revenue}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Costo de Ventas</TableCell>
                                        <TableCell>{financialData.costOfGoodsSold}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Utilidad Bruta</TableCell>
                                        <TableCell>{financialData.grossProfit}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Gastos Operativos</TableCell>
                                        <TableCell>{financialData.operatingExpenses}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Utilidad Neta</TableCell>
                                        <TableCell>{financialData.netIncome}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Grid container spacing={3} mt={5}>
                            <Grid item xs={12} sm={6} md={4}>
                                <Paper elevation={3} style={{ padding: '10px' }}>
                                    <Typography variant="h6" gutterBottom>Ingresos por Categoría</Typography>
                                    <div style={{ height: '200px' }}>
                                        <Bar ref={revenueChartRef} data={revenueByCategoryData} options={{ responsive: true, maintainAspectRatio: false }} />
                                    </div>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <Paper elevation={3} style={{ padding: '10px' }}>
                                    <Typography variant="h6" gutterBottom>Gastos por Categoría</Typography>
                                    <div style={{ height: '200px' }}>
                                        <Bar ref={expensesChartRef} data={expensesByCategoryData} options={{ responsive: true, maintainAspectRatio: false }} />
                                    </div>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={12} md={4}>
                                <Paper elevation={3} style={{ padding: '10px' }}>
                                    <Typography variant="h6" gutterBottom>Comparación de Períodos</Typography>
                                    <div style={{ height: '200px' }}>
                                        <Line ref={comparisonChartRef} data={lineChartData} options={{ responsive: true, maintainAspectRatio: false }} />
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
