import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Table, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const SalesList = () => {
    const [sales, setSales] = useState([]);

    useEffect(() => {
        fetchSales();
    }, []);

    const fetchSales = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/sales`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSales(response.data);
        } catch (error) {
            console.error('Error fetching sales:', error);
        }
    };

    return (
        <Container className="mt-8" style={{ backgroundColor: '#F3E5F5', borderRadius: '15px', padding: '20px' }}>
            <h2 className="my-4">Lista de Ventas</h2>
            <Table striped bordered hover responsive className="shadow-lg" style={{ borderRadius: '15px', overflow: 'hidden' }}>
                <thead style={{ backgroundColor: '#7B1FA2', color: 'white' }}>
                    <tr>
                        <th>ID</th>
                        <th>Fecha</th>
                        <th>Monto Total</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {sales.length === 0 ? (
                        <tr>
                            <td colSpan="4" className="text-center">No hay ventas registradas.</td>
                        </tr>
                    ) : (
                        sales.map(sale => (
                            <tr key={sale.sale_id}>
                                <td>{sale.sale_id}</td>
                                <td>{sale.sale_date}</td>
                                <td>{sale.total_amount}</td>
                                <td>
                                    <Button variant="info" as={Link} to={`/sales/${sale.sale_id}`}>
                                        Detalles
                                    </Button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>
        </Container>
    );
};

export default SalesList;
