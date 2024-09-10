import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, InputGroup, FormControl, DropdownButton, Dropdown, Button, Table, Pagination, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import '../styles/styles.css';

function ProductList() {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('All');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(10);
    const [showConfirm, setShowConfirm] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('${process.env.REACT_APP_API_URL}/products', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setProducts(response.data);
                setFilteredProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        const results = products.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (filter === 'All' || product.category === filter)
        );
        setFilteredProducts(results);
    }, [searchTerm, filter, products]);

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${process.env.REACT_APP_API_URL}/products/${productToDelete}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setProducts(products.filter(product => product.product_id !== productToDelete));
            setFilteredProducts(filteredProducts.filter(product => product.product_id !== productToDelete));
            setShowConfirm(false);
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <Container  className="mt-8" style={{ backgroundColor: '#F3E5F5', borderRadius: '15px', padding: '20px' }}>
            <div className="text-center mb-6">
                <h4 className="text-2xl font-bold">Productos</h4>
            </div>
            <div className="flex justify-between mb-4">
                <InputGroup className="w-1/2">
                    <FormControl
                        placeholder="Buscar producto..."
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
                    <Dropdown.Item eventKey="Category1">Categoría 1</Dropdown.Item>
                    <Dropdown.Item eventKey="Category2">Categoría 2</Dropdown.Item>
                </DropdownButton>
                <Button variant="primary" as={Link} to="/add-product" className="bg-blue-500 text-white">
                    <AddIcon className="mr-2" /> Añadir Producto
                </Button>
            </div>
            <Table striped bordered hover responsive className="shadow-lg" style={{ borderRadius: '15px', overflow: 'hidden' }}>
    <thead style={{ backgroundColor: '#7B1FA2', color: 'white' }}>
        <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Costo</th> {/* Nuevo campo para mostrar el costo */}
            <th>Descuento</th>
            <th>IVA</th>
            <th>Precio Final</th>
            <th>Stock</th>
            <th>Categoría</th>
            <th>Acciones</th>
        </tr>
    </thead>
    <tbody>
        {currentProducts.map((product) => (
            <tr key={product.product_id}>
                <td>{product.product_id}</td>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>{product.price}</td>
                <td>{product.cost_price}</td> {/* Mostrar cost_price */}
                <td>{product.discount}</td>
                <td>{product.iva}</td>
                <td>{product.final_price}</td>
                <td>{product.stock}</td>
                <td>{product.category}</td>
                <td className="flex justify-around">
                    <Button variant="link" as={Link} to={`/edit-product/${product.product_id}`} className="text-blue-500">
                        <EditIcon />
                    </Button>
                    <Button variant="link" onClick={() => { setProductToDelete(product.product_id); setShowConfirm(true); }} className="text-red-500">
                        <DeleteIcon />
                    </Button>
                </td>
            </tr>
        ))}
    </tbody>
</Table>
            <Pagination className="justify-content-center mt-4">
                {[...Array(Math.ceil(filteredProducts.length / productsPerPage)).keys()].map(number => (
                    <Pagination.Item key={number + 1} active={number + 1 === currentPage} onClick={() => paginate(number + 1)}>
                        {number + 1}
                    </Pagination.Item>
                ))}
            </Pagination>

            <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmación</Modal.Title>
                </Modal.Header>
                <Modal.Body>¿Estás seguro de que quieres eliminar este producto?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirm(false)}>Cancelar</Button>
                    <Button variant="danger" onClick={handleDelete}>Eliminar</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default ProductList;
