import React from 'react';
import { Link } from 'react-router-dom'; // Asegúrate de importar Link

function AboutUs() {
    return (
        <div className="w-full min-h-screen flex flex-col" style={{ backgroundColor: '#f3e5f5' }}>
            {/* Hero Section */}
            <div className="relative bg-cover bg-center h-screen mb-12" style={{ backgroundImage: 'url(/images/pexels-mccutcheon-1174952.jpg)' }}>
                <div className="absolute inset-0" style={{ backgroundColor: '#d7bde2', opacity: '0.8' }}></div>
                <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white">
                    <h1 className="text-6xl md:text-7xl font-extrabold mb-4 drop-shadow-lg" style={{ color: '#4a235a' }}>Acerca de Nosotros</h1>
                    <p className="text-xl md:text-2xl mb-6" style={{ color: '#6c3483' }}>Comprometidos con la excelencia en cada impresión.</p>
                </div>
            </div>

            {/* About Us Section */}
            <section className="flex-grow text-center mb-16 px-8" style={{ color: '#4a235a' }}>
                <h2 className="text-5xl font-bold mb-12" style={{ color: '#6c3483' }}>Nuestra Historia</h2>
                <p className="text-lg leading-relaxed mb-12" style={{ color: '#4a235a' }}>
                    Fundada en 1995, Impresiones Ávila ha sido un pilar en la industria de la impresión. Desde nuestros humildes comienzos como una pequeña imprenta local, hemos crecido exponencialmente, expandiendo nuestros servicios y alcanzando a clientes en toda la región. Con más de 25 años de experiencia, hemos perfeccionado nuestra técnica y mejorado continuamente nuestra tecnología para garantizar que cada proyecto que manejamos se realice con la más alta calidad.
                </p>

                <h2 className="text-5xl font-bold mb-12" style={{ color: '#6c3483' }}>Nuestro Equipo</h2>
                <p className="text-lg leading-relaxed mb-12" style={{ color: '#4a235a' }}>
                    Nuestro equipo está compuesto por profesionales dedicados que tienen una pasión por la impresión y el diseño. Cada miembro de nuestro equipo aporta un conjunto único de habilidades y experiencias, permitiéndonos ofrecer soluciones creativas y efectivas para cada cliente. Nos enorgullece contar con un equipo que trabaja en conjunto para cumplir con las expectativas de nuestros clientes y superar sus expectativas.
                </p>

                <h2 className="text-5xl font-bold mb-12" style={{ color: '#6c3483' }}>Nuestras Instalaciones</h2>
                <p className="text-lg leading-relaxed mb-12" style={{ color: '#4a235a' }}>
                    En Impresiones Ávila, creemos que la calidad comienza con el equipo adecuado. Es por eso que nuestras instalaciones están equipadas con las últimas tecnologías en impresión. Contamos con prensas digitales y offset de última generación, lo que nos permite manejar proyectos de cualquier tamaño y complejidad. Además, nos aseguramos de que nuestros procesos sean lo más ecológicos posible, utilizando tintas y papeles sostenibles para reducir nuestro impacto ambiental.
                </p>

                <h2 className="text-5xl font-bold mb-12" style={{ color: '#6c3483' }}>Nuestros Valores</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-8" style={{ backgroundColor: '#ffffff', borderRadius: '20px', boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)', transition: '0.3s', transform: 'hover:scale(1.05)' }}>
                        <h3 className="text-2xl font-bold mb-4" style={{ color: '#6c3483' }}>Compromiso</h3>
                        <p style={{ color: '#4a235a' }}>
                            Nos comprometemos a ofrecer la mejor calidad en todos nuestros servicios, asegurándonos de que cada cliente quede satisfecho con el resultado final.
                        </p>
                    </div>
                    <div className="p-8" style={{ backgroundColor: '#ffffff', borderRadius: '20px', boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)', transition: '0.3s', transform: 'hover:scale(1.05)' }}>
                        <h3 className="text-2xl font-bold mb-4" style={{ color: '#6c3483' }}>Innovación</h3>
                        <p style={{ color: '#4a235a' }}>
                            Innovamos continuamente para mantenernos a la vanguardia de la tecnología en impresión, permitiéndonos ofrecer soluciones únicas y creativas.
                        </p>
                    </div>
                    <div className="p-8" style={{ backgroundColor: '#ffffff', borderRadius: '20px', boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)', transition: '0.3s', transform: 'hover:scale(1.05)' }}>
                        <h3 className="text-2xl font-bold mb-4" style={{ color: '#6c3483' }}>Responsabilidad</h3>
                        <p style={{ color: '#4a235a' }}>
                            Nos tomamos en serio nuestra responsabilidad con el medio ambiente, implementando prácticas sostenibles en todas nuestras operaciones.
                        </p>
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="text-center py-16 rounded-lg shadow-inner" style={{ backgroundColor: '#ab47bc', color: 'white' }}>
                <h2 className="text-5xl font-bold mb-12">Únete a Nuestra Historia</h2>
                <p className="text-lg leading-relaxed mb-12" style={{ color: '#f3e5f5' }}>
                    Ya sea que necesites imprimir tarjetas de presentación, folletos, carteles o cualquier otro tipo de material impreso, en Impresiones Ávila estamos aquí para ayudarte. Nos encantaría formar parte de tu próximo proyecto y demostrarte por qué somos la mejor opción en la industria de la impresión.
                </p>
                <Link to="/contacto">
                    <button className="font-semibold text-lg px-8 py-3 rounded-full shadow-xl transition-all duration-300 transform hover:scale-105" style={{ backgroundColor: 'white', color: '#ab47bc' }}>
                        Contáctanos Hoy
                    </button>
                </Link>
            </section>
        </div>
    );
}

export default AboutUs;
