import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Alert, Card } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'tailwindcss/tailwind.css';
import { FaHeart, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const ProductDetail = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1);
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState('');
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [reviewSuccessMessage, setReviewSuccessMessage] = useState('');
    const [averageRating, setAverageRating] = useState(0);
    const [likes, setLikes] = useState({});
    const [visibleReviews, setVisibleReviews] = useState(3); // Mostrar solo 3 reseñas al principio

    useEffect(() => {
        fetchProduct(productId);
        fetchReviews(productId);
    }, [productId]);

    const fetchProduct = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProduct(response.data);
        } catch (error) {
            console.error('Error fetching product:', error);
            setError('Error fetching product details');
        }
    };

    const fetchReviews = async (id) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/reviews/${id}`);
            const reviewsData = response.data;
            setReviews(reviewsData);

            const avgRating = reviewsData.reduce((sum, review) => sum + review.rating, 0) / reviewsData.length;
            setAverageRating(avgRating.toFixed(1));

            // Initialize likes state based on the reviews
            const initialLikes = {};
            reviewsData.forEach((review) => {
                initialLikes[review.review_id] = false; // Start with no likes
            });
            setLikes(initialLikes);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            setError('Error fetching reviews');
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
            setSuccessMessage('Producto agregado al carrito');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error('Error adding to cart:', error);
            setError('Error adding to cart');
        }
    };

    const handleAddReview = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.post('/reviews', { product_id: productId, review_content: newReview, rating }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNewReview('');
            setRating(0);
            fetchReviews(productId);
            setReviewSuccessMessage('Reseña agregada con éxito');
            setTimeout(() => setReviewSuccessMessage(''), 3000);
        } catch (error) {
            console.error('Error adding review:', error);
            setError('Error adding review');
        }
    };

    const handleLike = (reviewId) => {
        setLikes((prevLikes) => ({
            ...prevLikes,
            [reviewId]: !prevLikes[reviewId], // Toggle like state
        }));
    };

    const getLikeCount = (reviewId) => {
        return likes[reviewId] ? 1 : 0;
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            stars.push(
                <span
                    key={i}
                    className={`cursor-pointer text-2xl transition-colors duration-200 ${
                        i < (hoverRating || rating) ? 'text-yellow-400' : 'text-gray-400'
                    }`}
                    onMouseEnter={() => setHoverRating(i + 1)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(i + 1)}
                >
                    ★
                </span>
            );
        }
        return stars;
    };

    const loadMoreReviews = () => {
        setVisibleReviews((prevVisible) => prevVisible + 3); // Mostrar 3 reseñas adicionales
    };

    const showLessReviews = () => {
        setVisibleReviews(3); // Volver a mostrar solo las primeras 3 reseñas
    };

    if (error) {
        return <div className="text-center text-red-600">{error}</div>;
    }

    if (!product) {
        return <div className="text-center">Cargando...</div>;
    }

    return (
        <Container className="my-10">
            {successMessage && (
                <Row className="justify-content-center mb-4">
                    <Col md={10} lg={8}>
                        <Alert variant="success" onClose={() => setSuccessMessage('')} dismissible>
                            {successMessage}
                        </Alert>
                    </Col>
                </Row>
            )}
            <Row className="justify-content-center">
                <Col md={10} lg={8} className="bg-white p-6 rounded-lg shadow-xl transition-shadow duration-300 hover:shadow-2xl">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-purple-600 mb-4 hover:text-purple-800 transition duration-300"
                        style={{ textDecoration: 'none', fontSize: '1rem' }}
                    >
                        &larr; Volver
                    </button>
                    <Row>
                        <Col md={6} className="text-center">
                            <img
                                src={product.image || '/images/default_product.jpg'}
                                alt={product.name}
                                className="rounded-lg shadow-md max-w-full h-auto transition-transform duration-500 hover:scale-105"
                            />
                        </Col>
                        <Col md={6} className="d-flex flex-column justify-content-center">
                            <h1 className="text-5xl font-extrabold mb-6 text-purple-900">{product.name}</h1>
                            <p className="text-4xl text-gray-800 mb-4">${product.price}</p>
                            <p className="text-gray-600 mb-6">{product.description}</p>
                            <p className="text-lg font-bold mb-4">
                                Calificación Promedio: {averageRating} / 5 {renderStars(Math.round(averageRating))}
                            </p>
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
                            <button
                                onClick={handleAddToCart}
                                className="bg-purple-600 text-white font-semibold py-3 px-5 rounded-full hover:bg-purple-700 transition-all transform hover:scale-105"
                            >
                                Añadir al Carrito
                            </button>
                        </Col>
                    </Row>
                    <Row className="mt-5">
                        <Col md={12}>
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Reseñas</h2>
                            {reviews.length === 0 ? (
                                <p className="text-gray-600">No hay reseñas para este producto aún.</p>
                            ) : (
                                reviews.slice(0, visibleReviews).map((review) => (
                                    <Card key={review.review_id} className="mb-3 shadow-sm hover:shadow-md transition-shadow border border-gray-200 rounded-lg p-4">
                                        <Card.Body>
                                            <Card.Title className="font-bold text-lg">{review.username}</Card.Title>
                                            <Card.Text className="text-gray-700">{review.review_content}</Card.Text>
                                            <Card.Footer className="text-muted flex items-center justify-between">
                                                <div>{renderStars(review.rating)}</div>
                                                <div className="flex items-center">
                                                    <FaHeart
                                                        className={`cursor-pointer text-2xl ${
                                                            likes[review.review_id] ? 'text-red-500' : 'text-gray-400'
                                                        }`}
                                                        onClick={() => handleLike(review.review_id)}
                                                    />
                                                    <span className="ml-2 text-gray-600">{getLikeCount(review.review_id)}</span>
                                                    <small className="text-gray-500 ml-3">
                                                        {new Date(review.created_at).toLocaleDateString()}
                                                    </small>
                                                </div>
                                            </Card.Footer>
                                        </Card.Body>
                                    </Card>
                                ))
                            )}

                            {visibleReviews < reviews.length ? (
                                <button
                                    onClick={loadMoreReviews}
                                    className="text-purple-600 text-sm hover:text-purple-800 transition duration-300 hover:underline"
                                >
                                    Mostrar más reseñas
                                </button>
                            ) : (
                                <button
                                    onClick={showLessReviews}
                                    className="text-gray-600 text-sm hover:text-gray-800 transition duration-300 hover:underline"
                                >
                                    Mostrar menos reseñas
                                </button>
                            )}
                            <h3 className="mt-5 text-2xl font-bold">Agregar Reseña</h3>
                            {reviewSuccessMessage && (
                                <Alert variant="success" onClose={() => setReviewSuccessMessage('')} dismissible>
                                    {reviewSuccessMessage}
                                </Alert>
                            )}
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={newReview}
                                onChange={(e) => setNewReview(e.target.value)}
                                placeholder="Escribe tu comentario aquí"
                                className="my-3 p-3 border border-gray-300 rounded-md"
                            />
                            <div className="flex items-center mb-4">
                                {renderStars(rating)}
                                <span className="ml-3 text-gray-500">Calificación: {rating} / 5</span>
                            </div>
                            <button
                                onClick={handleAddReview}
                                className="bg-purple-600 text-white font-semibold py-3 px-5 rounded-full mt-3 hover:bg-purple-700 transition-all transform hover:scale-105"
                            >
                                Enviar Reseña
                            </button>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
};

export default ProductDetail;

