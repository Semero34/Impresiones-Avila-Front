import React from 'react';
import { Container, Typography, Box, Button, Card, CardContent, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import { FaChartLine, FaBox, FaUsers, FaMoneyBillWave, FaUserFriends } from 'react-icons/fa';

const reportCategories = [
    { title: "Ventas", link: "/reportes/ventas", icon: <FaChartLine className="text-blue-500 text-4xl mb-4" /> },
    { title: "Inventario", link: "/reportes/inventario", icon: <FaBox className="text-green-500 text-4xl mb-4" /> },
    { title: "Usuarios", link: "/reportes/usuarios", icon: <FaUsers className="text-purple-500 text-4xl mb-4" /> },
    { title: "Financieros", link: "/reportes/financieros", icon: <FaMoneyBillWave className="text-yellow-500 text-4xl mb-4" /> },
    { title: "Clientes", link: "/reportes/clientes", icon: <FaUserFriends className="text-red-500 text-4xl mb-4" /> },
];

function ReportCategories() {
    return (
        <Container maxWidth="md" className="mt-8">
            <Box mt={5}>
                <Typography variant="h4" component="h1" gutterBottom align="center" className="text-3xl font-bold">
                    Categorías de Reportes
                </Typography>
                <Grid container spacing={3} justifyContent="center">
                    {reportCategories.map((report, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card variant="outlined" className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white rounded-lg">
                                <CardContent className="flex flex-col items-center p-6">
                                    {report.icon}
                                    <Typography variant="h5" component="h2" gutterBottom align="center" className="text-xl font-semibold mb-4">
                                        {report.title}
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        component={Link}
                                        to={report.link}
                                        fullWidth
                                        className="bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300 py-2 rounded-md"
                                    >
                                        Ver Reporte
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Container>
    );
}

export default ReportCategories;
