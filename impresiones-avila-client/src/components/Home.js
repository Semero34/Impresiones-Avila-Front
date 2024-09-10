import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Parallax } from 'react-parallax';
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'tailwindcss/tailwind.css';

function Home() {
    const [products, setProducts] = useState([]);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
        });
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get('${process.env.REACT_APP_API_URL}/products', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            setProducts(response.data);
        })
        .catch(error => {
            console.error('Error fetching products:', error);
        });
    }, []);

    const handleAddToCart = (product) => {
        try {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const existingProductIndex = cart.findIndex(item => item.product_id === product.product_id);

            if (existingProductIndex !== -1) {
                cart[existingProductIndex].quantity += 1;
            } else {
                cart.push({ ...product, quantity: 1 });
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            window.dispatchEvent(new Event('cart-updated'));
            alert('Producto agregado al carrito');
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    return (
        <div className="w-full min-h-screen flex flex-col bg-gradient-to-b from-purple-500 via-pink-500 to-red-500 text-white">
            {/* Hero Section */}
            <Parallax
                bgImage="/images/your-background-image.jpg"
                strength={400}
            >
                <section className="relative h-screen flex items-center justify-center text-center">
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <div className="relative z-10 container mx-auto">
                        <h1 className="text-6xl font-extrabold mb-4 drop-shadow-lg" data-aos="fade-up">Llevamos tus ideas al papel</h1>
                        <p className="text-2xl mb-6 font-light" data-aos="fade-up" data-aos-delay="300">Especialistas en impresiones de alta calidad para todo tipo de negocios.</p>
                        <Link to="/contacto" data-aos="fade-up" data-aos-delay="600">
                            <button className="bg-white text-black font-semibold text-lg px-8 py-3 rounded-full shadow-lg hover:bg-gray-200 transition-all duration-300">
                                Contáctanos
                            </button>
                        </Link>
                    </div>
                </section>
            </Parallax>

            {/* About Us Section */}
            <section className="spad py-16 bg-white text-gray-800" data-aos="fade-up">
                <div className="container mx-auto">
                    <div className="flex flex-wrap">
                        <div className="w-full md:w-1/2 mb-8 md:mb-0">
                            <div className="about-text">
                                <div className="section-title">
                                    <span className="text-pink-500 text-lg">Sobre Nosotros</span>
                                    <h2 className="text-4xl font-bold mt-2">Impresiones Avila</h2>
                                </div>
                                <p className="text-lg mt-4">
                                    Impresiones Avila es líder en soluciones de impresión de alta calidad. Nos apasiona brindar productos que superen las expectativas de nuestros clientes, asegurando que cada proyecto sea un éxito.
                                </p>
                                <p className="text-lg mt-4">
                                    Desde impresiones personalizadas hasta grandes tiradas, cubrimos todas tus necesidades con tecnología avanzada y un servicio al cliente excepcional.
                                </p>
                                <Link to="/about" className="inline-block bg-purple-700 text-white py-2 px-6 rounded-full mt-4 shadow-lg hover:shadow-xl transition duration-300">Leer Más</Link>
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 flex flex-wrap">
                            <div className="w-1/2 p-2" data-aos="zoom-in">
                                <img src="/images/pexels-sebastian-velandia-183845690-11671898.jpg" alt="Sobre Nosotros" className="rounded-lg shadow-lg hover:scale-105 transition-transform duration-300" />
                            </div>
                            <div className="w-1/2 p-2" data-aos="zoom-in" data-aos-delay="200">
                                <img src="/images/pexels-pixabay-210126.jpg" alt="Sobre Nosotros" className="rounded-lg shadow-lg hover:scale-105 transition-transform duration-300" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="spad py-16 bg-gray-100 text-gray-800">
                <div className="container mx-auto text-center">
                    <div className="section-title" data-aos="fade-up">
                        <span className="text-pink-500 text-lg">Lo que Hacemos</span>
                        <h2 className="text-4xl font-bold mt-2">Nuestros Servicios</h2>
                    </div>
                    <div className="flex flex-wrap justify-center mt-8">
                        <div className="w-full md:w-1/3 p-4" data-aos="fade-right">
                            <div className="service-item p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <i className="flaticon-036-parking text-4xl text-pink-500 mb-4"></i>
                                <h4 className="text-xl font-semibold">Impresiones Digitales</h4>
                                <p className="mt-2">Ofrecemos impresiones digitales de alta calidad para cualquier proyecto que tengas en mente.</p>
                            </div>
                        </div>
                        <div className="w-full md:w-1/3 p-4" data-aos="fade-up">
                            <div className="service-item p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <i className="flaticon-033-dinner text-4xl text-pink-500 mb-4"></i>
                                <h4 className="text-xl font-semibold">Diseño Gráfico</h4>
                                <p className="mt-2">Nuestro equipo de diseño gráfico está listo para transformar tus ideas en realidad.</p>
                            </div>
                        </div>
                        <div className="w-full md:w-1/3 p-4" data-aos="fade-left">
                            <div className="service-item p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <i className="flaticon-026-bed text-4xl text-pink-500 mb-4"></i>
                                <h4 className="text-xl font-semibold">Impresión en Gran Formato</h4>
                                <p className="mt-2">Perfecto para carteles, banners, y cualquier proyecto que requiera un gran impacto visual.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Products Section */}
            <section className="text-center py-16 bg-gray-100 text-gray-800">
            <div className="container mx-auto">
                <div className="section-title mb-8" data-aos="fade-up">
                    <h2 className="text-4xl font-extrabold text-gray-900">Nuestros Productos</h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
                    {products.slice(0, showAll ? products.length : 3).map((product) => (
                        <div 
                            key={product.product_id} 
                            className="relative bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-500 hover:shadow-2xl" 
                            data-aos="fade-up"
                        >
                            <img 
                                src={product.image || '/images/placeholder.jpg'} 
                                alt={product.name} 
                                className="w-full h-64 object-cover rounded-t-xl transition-transform duration-500 hover:scale-110" 
                            />
                            <div className="p-6 flex flex-col flex-grow z-10">
                                <h3 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h3>
                                <p className="text-gray-600 mb-4 flex-grow">{product.description || "Descripción breve del producto."}</p>
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-gray-800 text-xl font-semibold">${product.price}</p>
                                    <div className="flex space-x-2">
                                        <Link 
                                            to={`/product-detail/${product.product_id}`} 
                                            className="bg-purple-600 text-white py-2 px-6 rounded-full hover:bg-purple-700 transition duration-300 text-center z-20"
                                        >
                                            Ver Más
                                        </Link>
                                        <button 
                                            onClick={() => handleAddToCart(product)} 
                                            className="bg-purple-600 text-white py-2 px-6 rounded-full hover:bg-purple-700 transition duration-300 text-center z-20"
                                        >
                                            Comprar
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute inset-0 bg-black bg-opacity-60 text-white opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-0">
                                <p className="text-center text-lg p-4">{product.description || "Descripción breve del producto."}</p>
                            </div>
                        </div>
                    ))}
                </div>
                
                {products.length > 3 && (
                    <div className="mt-8">
                        {showAll ? (
                            <button 
                                onClick={() => setShowAll(false)} 
                                className="bg-purple-600 text-white py-2 px-6 rounded-full shadow-lg hover:shadow-2xl hover:bg-purple-700 transition duration-300"
                            >
                                Ver Menos
                            </button>
                        ) : (
                            <button 
                                onClick={() => setShowAll(true)} 
                                className="bg-purple-600 text-white py-2 px-6 rounded-full shadow-lg hover:shadow-2xl hover:bg-purple-700 transition duration-300"
                            >
                                Ver Más
                            </button>
                        )}
                    </div>
                )}
            </div>
        </section>
            {/* Blog Section */}
            <section className="blog-section spad py-16 bg-gradient-to-b from-gray-100 to-white text-gray-800">
                <div className="container mx-auto">
                    <div className="section-title text-center" data-aos="fade-up">
                        <span className="text-pink-500 text-lg">Noticias y Eventos</span>
                        <h2 className="text-4xl font-bold mt-2">Nuestro Blog & Eventos</h2>
                    </div>
                    <div className="flex flex-wrap justify-center mt-8">
                        <div className="w-full md:w-1/3 p-4" data-aos="fade-right">
                            <div className="blog-item bg-cover bg-center h-64 rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300" style={{ backgroundImage: 'url(/images/blog-1.jpg)' }}>
                                <div className="bi-text p-6 bg-black bg-opacity-50 text-white">
                                    <span className="b-tag block mb-2">Consejos</span>
                                    <h4 className="text-xl font-bold mb-2">Cómo maximizar el impacto de tus impresiones</h4>
                                    <Link to="/blog/maximizar-impacto" className="text-gray-300 hover:text-white transition duration-300">Leer más</Link>
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:w-1/3 p-4" data-aos="fade-up">
                            <div className="blog-item bg-cover bg-center h-64 rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300" style={{ backgroundImage: 'url(/images/blog-2.jpg)' }}>
                                <div className="bi-text p-6 bg-black bg-opacity-50 text-white">
                                    <span className="b-tag block mb-2">Innovación</span>
                                    <h4 className="text-xl font-bold mb-2">Últimas tendencias en impresión digital</h4>
                                    <Link to="/blog/tendencias-impresion" className="text-gray-300 hover:text-white transition duration-300">Leer más</Link>
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:w-1/3 p-4" data-aos="fade-left">
                            <div className="blog-item bg-cover bg-center h-64 rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300" style={{ backgroundImage: 'url(/images/blog-3.jpg)' }}>
                                <div className="bi-text p-6 bg-black bg-opacity-50 text-white">
                                    <span className="b-tag block mb-2">Eventos</span>
                                    <h4 className="text-xl font-bold mb-2">Nuestro stand en la Expo Print 2024</h4>
                                    <Link to="/blog/expo-print-2024" className="text-gray-300 hover:text-white transition duration-300">Leer más</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>        
        </div>
    );
}

export default Home;
