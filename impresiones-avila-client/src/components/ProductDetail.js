import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'tailwindcss/tailwind.css';

const ProductDetail = () => {
    const { productId } = useParams();
    const [quantity, setQuantity] = useState(1);
    const [product, setProduct] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProduct(productId);
    }, [productId]);

    const fetchProduct = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:3001/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProduct(response.data);
        } catch (error) {
            console.error('Error fetching product:', error);
            setError('Error fetching product details');
        }
    };

    const handleAddToCart = () => {
        try {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const existingProductIndex = cart.findIndex((item) => item.product_id === product.product_id);

            if (existingProductIndex !== -1) {
                cart[existingProductIndex].quantity += parseInt(quantity);
            } else {
                cart.push({ ...product, quantity: parseInt(quantity) });
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            window.dispatchEvent(new Event('cart-updated'));
        } catch (error) {
            console.error('Error adding to cart:', error);
            setError('Error adding to cart');
        }
    };

    if (error) {
        return <div className="text-center">{error}</div>;
    }

    if (!product) {
        return <div className="text-center">Loading...</div>;
    }

    return (
        <Container className="my-5">
            <Row className="justify-content-center">
                <Col md={10} lg={8} className="bg-white p-6 rounded-lg shadow-md">
                    <Row>
                        <Col md={6} className="text-center">
                            <img
                                src={product.image || '/images/default_product.jpg'}
                                alt={product.name}
                                className="rounded-lg shadow-md max-w-full h-auto product-image"
                            />
                        </Col>
                        <Col md={6} className="d-flex flex-column justify-content-center">
                            <h1 className="text-4xl font-bold mb-6">{product.name}</h1>
                            <p className="text-3xl text-gray-800 mb-4">${product.price}</p>
                            <p className="text-gray-600 mb-6">{product.description}</p>
                            <div className="mb-5">
                                <label className="block text-gray-700 mb-2">Cantidad</label>
                                <Form.Control
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    min="1"
                                    className="w-32 p-3 border border-gray-300 rounded-md"
                                />
                            </div>
                            <Button
                                onClick={handleAddToCart}
                                className="bg-gray-800 text-white font-semibold py-3 px-5 rounded-full hover:bg-gray-900 transition-all"
                                style={{ backgroundColor: '#333', borderColor: '#333' }}
                            >
                                Añadir al Carrito
                            </Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
};

export default ProductDetail;
