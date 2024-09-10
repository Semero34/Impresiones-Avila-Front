import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, InputGroup, FormControl, DropdownButton, Dropdown, Button, Table, Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import '../styles/styles.css';

function SupplierList() {
    const [suppliers, setSuppliers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('All');
    const [filteredSuppliers, setFilteredSuppliers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const suppliersPerPage = 10;

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/suppliers`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setSuppliers(response.data);
                setFilteredSuppliers(response.data);
            } catch (error) {
                console.error('Error fetching suppliers:', error);
            }
        };

        fetchSuppliers();
    }, []);

    useEffect(() => {
        const results = suppliers.filter(supplier =>
            supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (filter === 'All' || supplier.payment_terms === filter)
        );
        setFilteredSuppliers(results);
    }, [searchTerm, filter, suppliers]);

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${process.env.REACT_APP_API_URL}/suppliers/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setSuppliers(suppliers.filter(supplier => supplier.supplier_id !== id));
            setFilteredSuppliers(filteredSuppliers.filter(supplier => supplier.supplier_id !== id));
        } catch (error) {
            console.error('Error deleting supplier:', error);
        }
    };

    const indexOfLastSupplier = currentPage * suppliersPerPage;
    const indexOfFirstSupplier = indexOfLastSupplier - suppliersPerPage;
    const currentSuppliers = filteredSuppliers.slice(indexOfFirstSupplier, indexOfLastSupplier);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <Container className="mt-8" style={{ backgroundColor: '#F3E5F5', borderRadius: '15px', padding: '20px' }}>
            <div className="text-center mb-6">
                <h4 className="text-2xl font-bold">Proveedores</h4>
            </div>
            <div className="d-flex justify-content-between mb-4">
                <InputGroup className="w-50">
                    <FormControl
                        placeholder="Buscar proveedor..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </InputGroup>
                <DropdownButton
                    title={filter}
                    variant="outline-secondary"
                    id="input-group-dropdown-1"
                    onSelect={(e) => setFilter(e)}
                >
                    <Dropdown.Item eventKey="All">Todos</Dropdown.Item>
                    <Dropdown.Item eventKey="Net 30">Net 30</Dropdown.Item>
                    <Dropdown.Item eventKey="Net 60">Net 60</Dropdown.Item>
                </DropdownButton>
                <Button variant="primary" as={Link} to="/add-supplier" className="bg-blue-500 text-white">
                    <AddIcon className="mr-2" /> Añadir Proveedor
                </Button>
            </div>
            <Table striped bordered hover responsive className="shadow-lg" style={{ borderRadius: '15px', overflow: 'hidden' }}>
                <thead style={{ backgroundColor: '#7B1FA2', color: 'white' }}>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Contacto</th>
                        <th>Dirección</th>
                        <th>Términos de Pago</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {currentSuppliers.map((supplier) => (
                        <tr key={supplier.supplier_id}>
                            <td>{supplier.supplier_id}</td>
                            <td>{supplier.name}</td>
                            <td>{supplier.contact}</td>
                            <td>{supplier.address}</td>
                            <td>{supplier.payment_terms}</td>
                            <td className="d-flex justify-content-around">
                                <Button variant="link" as={Link} to={`/edit-supplier/${supplier.supplier_id}`} className="text-blue-500">
                                    <EditIcon />
                                </Button>
                                <Button variant="link" onClick={() => handleDelete(supplier.supplier_id)} className="text-red-500">
                                    <DeleteIcon />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Pagination className="justify-content-center mt-4">
                {[...Array(Math.ceil(filteredSuppliers.length / suppliersPerPage)).keys()].map(number => (
                    <Pagination.Item key={number + 1} active={number + 1 === currentPage} onClick={() => paginate(number + 1)}>
                        {number + 1}
                    </Pagination.Item>
                ))}
            </Pagination>
        </Container>
    );
}

export default SupplierList;
