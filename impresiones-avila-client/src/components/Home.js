import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import 'tailwindcss/tailwind.css';

function Home() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get('http://localhost:3001/products', {
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

    return (
        <div className="w-full min-h-screen flex flex-col" style={{ backgroundColor: '#f3e5f5', paddingBottom: '2rem' }}>
            {/* Hero Section */}
            <div className="relative bg-cover bg-center h-screen mb-12" style={{ backgroundImage: 'url(/images/blue-1188343_1280.jpg)', backgroundBlendMode: 'overlay', backgroundColor: '#f8bbd0' }}>
                <div className="absolute inset-0 bg-[#f8bbd0] bg-opacity-80"></div>
                <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white">
                    <h1 className="text-6xl md:text-7xl font-extrabold mb-4 drop-shadow-lg">Llevamos tus ideas al papel</h1>
                    <p className="text-xl md:text-2xl mb-6">Especialistas en impresiones de alta calidad para todo tipo de negocios.</p>
                    <Link to="/contacto">
                        <button className="bg-[#ab47bc] text-white font-semibold text-lg px-8 py-3 rounded-full shadow-xl hover:bg-[#9c27b0] transition-all duration-300 transform hover:scale-105">
                            Contáctanos
                        </button>
                    </Link>
                </div>
            </div>

            {/* Featured Products Section */}
            <section className="text-center mb-16 px-8">
                <h2 className="text-5xl font-bold mb-12 text-gray-800">Nuestros Productos</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-10">
                    {products.length === 0 ? (
                        <div className="col-span-full text-center">
                            <p className="text-lg text-gray-700">No hay productos disponibles.</p>
                        </div>
                    ) : (
                        products.map((product) => (
                            <div key={product.product_id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                <img src={product.image ? product.image : '/images/image.png'} alt={product.name} className="w-full h-64 object-cover rounded-t-xl"/>
                                <div className="p-6 flex flex-col flex-grow">
                                    <h3 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h3>
                                    <p className="text-gray-600 mb-4 flex-grow">{product.description}</p>
                                    <div className="flex items-center justify-between mb-4">
                                    {product.stock === 0 ? (
                    <p className="text-red-600 text-xl font-semibold">Agotado</p>
                ) : (
                    <p className="text-gray-800 text-xl font-semibold">${product.price}</p>
                )}
                                        <div className="flex">
                                            <Link to={`/product-detail/${product.product_id}`} className="bg-[#ab47bc] text-white py-2 px-6 rounded-full hover:bg-[#9c27b0] transition duration-300 text-center mr-2">
                                                Ver Más
                                            </Link>
                                            <Link 
    to={`/product-detail/${product.product_id}`} 
    className={`bg-[#8e24aa] text-white py-2 px-6 rounded-full transition duration-300 text-center ${product.stock === 0 ? 'cursor-not-allowed opacity-50' : 'hover:bg-[#7b1fa2] hover:scale-105'}`} 
    style={{ pointerEvents: product.stock === 0 ? 'none' : 'auto' }}
>
    Comprar
</Link>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="bg-[#f3e5f5] py-16 text-center mb-16 px-8 rounded-xl shadow-lg">
                <h2 className="text-5xl font-bold mb-12 text-gray-800">¿Por qué elegirnos?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="p-8 bg-white rounded-lg shadow-md transform hover:scale-105 transition duration-300">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Calidad Superior</h3>
                        <p className="text-gray-600">Utilizamos la mejor tecnología para garantizar la calidad en cada impresión.</p>
                    </div>
                    <div className="p-8 bg-white rounded-lg shadow-md transform hover:scale-105 transition duration-300">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Entrega Rápida</h3>
                        <p className="text-gray-600">Cumplimos con tus plazos de entrega, sin comprometer la calidad.</p>
                    </div>
                    <div className="p-8 bg-white rounded-lg shadow-md transform hover:scale-105 transition duration-300">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Atención Personalizada</h3>
                        <p className="text-gray-600">Nuestro equipo está disponible para ayudarte a elegir la mejor solución para tus necesidades.</p>
                    </div>
                </div>
            </section>

            {/* Portfolio Section */}
            <section className="text-center mb-16 px-8">
                <h2 className="text-5xl font-bold mb-12 text-gray-800">Nuestros Trabajos Recientes</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                        <img src="/images/image.png" alt="Portfolio 1" className="w-full h-48 object-cover rounded-t-xl"/>
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Proyecto 1</h3>
                            <p className="text-gray-600">Descripción breve del proyecto realizado.</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                        <img src="/images/image.png" alt="Portfolio 2" className="w-full h-48 object-cover rounded-t-xl"/>
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Proyecto 2</h3>
                            <p className="text-gray-600">Descripción breve del proyecto realizado.</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                        <img src="/images/image.png" alt="Portfolio 3" className="w-full h-48 object-cover rounded-t-xl"/>
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Proyecto 3</h3>
                            <p className="text-gray-600">Descripción breve del proyecto realizado.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="bg-[#ab47bc] text-white text-center py-16 rounded-lg shadow-inner">
                <h2 className="text-5xl font-bold mb-12">Reserva tu Impresión Ahora</h2>
                <form className="max-w-lg mx-auto">
                    <div className="mb-4">
                        <input type="text" className="w-full p-4 rounded-lg border-none focus:ring-2 focus:ring-[#9c27b0] placeholder-white bg-[#7b1fa2] transition duration-300" placeholder="Nombre Completo" />
                    </div>
                    <div className="mb-4">
                        <input type="email" className="w-full p-4 rounded-lg border-none focus:ring-2 focus:ring-[#9c27b0] placeholder-white bg-[#7b1fa2] transition duration-300" placeholder="Email" />
                    </div>
                    <div className="mb-4">
                        <input type="text" className="w-full p-4 rounded-lg border-none focus:ring-2 focus:ring-[#9c27b0] placeholder-white bg-[#7b1fa2] transition duration-300" placeholder="Teléfono" />
                    </div>
                    <button type="submit" className="bg-[#8e24aa] text-white font-semibold text-lg px-8 py-3 rounded-full shadow-xl hover:bg-[#7b1fa2] hover:scale-105 transition-all duration-300">Enviar</button>
                </form>
            </section>
        </div>
    );
}

export default Home;
