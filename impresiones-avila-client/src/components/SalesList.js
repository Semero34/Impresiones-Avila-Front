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
            const response = await axios.get('http://localhost:3001/sales', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSales(response.data);
        } catch (error) {
            console.error('Error fetching sales:', error);
        }
    };

    return (
        <Container>
            <h2 className="my-4">Lista de Ventas</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Fecha</th>
                        <th>Monto Total</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {sales.map(sale => (
                        <tr key={sale.sale_id}>
                            <td>{sale.sale_id}</td>
                            <td>{sale.sale_date}</td>
                            <td>{sale.total_amount}</td>
                            <td>
                                <Button variant="info" as={Link} to={`/sales/${sale.sale_id}`}>Detalles</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default SalesList;
