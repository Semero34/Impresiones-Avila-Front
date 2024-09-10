import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, InputGroup, FormControl, DropdownButton, Dropdown, Button, Table, Pagination, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import '../styles/styles.css';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('All');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;
    const [showModal, setShowModal] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        filterUsers();
    }, [searchTerm, filter, users]);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(response.data);
            setFilteredUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const filterUsers = () => {
        const results = users.filter(user =>
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (filter === 'All' || user.role === filter)
        );
        setFilteredUsers(results);
    };

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${process.env.REACT_APP_API_URL}/users/${userIdToDelete}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(users.filter(user => user.user_id !== userIdToDelete));
            setFilteredUsers(filteredUsers.filter(user => user.user_id !== userIdToDelete));
            setShowModal(false);
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <Container className="mt-8" style={{ backgroundColor: '#F3E5F5', borderRadius: '15px', padding: '20px' }}>
            <div className="text-center mb-6">
                <h4 className="text-2xl font-bold" style={{ color: '#4A007E' }}>Usuarios</h4>
            </div>
            <div className="flex justify-between mb-4">
                <InputGroup className="w-1/2">
                    <FormControl
                        placeholder="Buscar usuario..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ borderRadius: '20px', borderColor: '#8E24AA' }}
                    />
                </InputGroup>
                <DropdownButton
                    title={filter}
                    variant="outline-secondary"
                    id="input-group-dropdown-1"
                    onSelect={(e) => setFilter(e)}
                    style={{ borderRadius: '20px' }}
                >
                    <Dropdown.Item eventKey="All">Todos</Dropdown.Item>
                    <Dropdown.Item eventKey="admin">Administrador</Dropdown.Item>
                    <Dropdown.Item eventKey="user">Usuario</Dropdown.Item>
                </DropdownButton>
            </div>
            <Table striped bordered hover responsive className="shadow-lg" style={{ borderRadius: '15px', overflow: 'hidden' }}>
                <thead style={{ backgroundColor: '#7B1FA2', color: 'white' }}>
                    <tr>
                        <th>ID</th>
                        <th>Nombre de usuario</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {currentUsers.map((user) => (
                        <tr key={user.user_id}>
                            <td>{user.user_id}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td className="flex justify-around">
                                <Button variant="link" as={Link} to={`/edit-user/${user.user_id}`} style={{ color: '#8E24AA' }}>
                                    <EditIcon />
                                </Button>
                                <Button variant="link" onClick={() => { setShowModal(true); setUserIdToDelete(user.user_id); }} style={{ color: '#D32F2F' }}>
                                    <DeleteIcon />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Pagination className="justify-content-center mt-4">
                {[...Array(Math.ceil(filteredUsers.length / usersPerPage)).keys()].map(number => (
                    <Pagination.Item key={number + 1} active={number + 1 === currentPage} onClick={() => paginate(number + 1)}>
                        {number + 1}
                    </Pagination.Item>
                ))}
            </Pagination>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Eliminación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    ¿Estás seguro de que deseas eliminar este usuario?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Eliminar
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default UserList;
