import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, InputGroup, FormControl, DropdownButton, Dropdown, Button, Table, Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import '../styles/styles.css';

const ClientList = () => {
    const [clients, setClients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('All');
    const [filteredClients, setFilteredClients] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const clientsPerPage = 10;

    useEffect(() => {
        fetchClients();
    }, []);

    useEffect(() => {
        filterClients();
    }, [searchTerm, filter, clients]);

    const fetchClients = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3001/clients', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setClients(response.data);
            setFilteredClients(response.data);
        } catch (error) {
            console.error('Error fetching clients:', error);
        }
    };

    const filterClients = () => {
        const results = clients.filter(client =>
            client.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (filter === 'All' || client.client_type === filter)
        );
        setFilteredClients(results);
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:3001/clients/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setClients(clients.filter(client => client.client_id !== id));
            setFilteredClients(filteredClients.filter(client => client.client_id !== id));
        } catch (error) {
            console.error('Error deleting client:', error);
        }
    };

    const indexOfLastClient = currentPage * clientsPerPage;
    const indexOfFirstClient = indexOfLastClient - clientsPerPage;
    const currentClients = filteredClients.slice(indexOfFirstClient, indexOfLastClient);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <Container className="mt-8">
            <div className="text-center mb-6">
                <h4 className="text-2xl font-bold">Lista de Clientes</h4>
            </div>
            <div className="flex justify-between mb-4">
                <InputGroup className="w-1/2">
                    <FormControl
                        placeholder="Buscar cliente..."
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
                    <Dropdown.Item eventKey="client_type_1">Tipo de Cliente 1</Dropdown.Item>
                    <Dropdown.Item eventKey="client_type_2">Tipo de Cliente 2</Dropdown.Item>
                </DropdownButton>
                <Button variant="primary" as={Link} to="/add-client" className="bg-blue-500 text-white">
                    <AddIcon className="mr-2" /> Añadir Cliente
                </Button>
            </div>
            <Table striped bordered hover responsive className="shadow-lg">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Dirección</th>
                        <th>Información de Contacto</th>
                        <th>Tipo de Cliente</th>
                        <th>Saldo Pendiente</th>
                        <th>Número de Cédula</th>
                        <th>Correo Electrónico</th>
                        <th>Tipo de Cédula</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {currentClients.map((client) => (
                        <tr key={client.client_id}>
                            <td>{client.client_id}</td>
                            <td>{client.name}</td>
                            <td>{client.address}</td>
                            <td>{client.contact_info}</td>
                            <td>{client.client_type}</td>
                            <td>{client.pending_balance}</td>
                            <td>{client.identification_number}</td>
                            <td>{client.email}</td>
                            <td>{client.identification_type}</td>
                            <td className="flex justify-around">
                                <Button variant="link" as={Link} to={`/edit-client/${client.client_id}`} className="text-blue-500">
                                    <EditIcon />
                                </Button>
                                <Button variant="link" onClick={() => handleDelete(client.client_id)} className="text-red-500">
                                    <DeleteIcon />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Pagination className="justify-content-center mt-4">
                {[...Array(Math.ceil(filteredClients.length / clientsPerPage)).keys()].map(number => (
                    <Pagination.Item key={number + 1} active={number + 1 === currentPage} onClick={() => paginate(number + 1)}>
                        {number + 1}
                    </Pagination.Item>
                ))}
            </Pagination>
        </Container>
    );
};

export default ClientList;
