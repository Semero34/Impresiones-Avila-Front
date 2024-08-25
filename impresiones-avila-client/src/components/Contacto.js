import React from 'react';

function Contacto() {
    return (
        <div className="w-full min-h-screen flex flex-col" style={{ backgroundColor: '#f3e5f5' }}>
            {/* Hero Section */}
            <div className="relative bg-cover bg-center h-96 mb-12" style={{ backgroundImage: 'url(/images/contact-hero.jpg)' }}>
                <div className="absolute inset-0" style={{ backgroundColor: '#d7bde2', opacity: '0.8' }}></div>
                <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white">
                    <h1 className="text-6xl md:text-7xl font-extrabold mb-4 drop-shadow-lg" style={{ color: '#4a235a' }}>Contáctanos</h1>
                    <p className="text-xl md:text-2xl" style={{ color: '#6c3483' }}>Estamos aquí para ayudarte. ¡Ponte en contacto con nosotros!</p>
                </div>
            </div>

            {/* Información de Contacto */}
            <section className="py-16 px-8 text-center">
                <h2 className="text-5xl font-bold mb-12" style={{ color: '#4a235a' }}>Información de Contacto</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div className="p-8" style={{ backgroundColor: '#ffffff', borderRadius: '20px', boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)', transition: '0.3s', transform: 'hover:scale(1.05)' }}>
                        <h3 className="text-3xl font-bold mb-4" style={{ color: '#6c3483' }}>Oficina Principal</h3>
                        <p className="text-lg" style={{ color: '#4a235a' }}>123 Calle Falsa, Ciudad, País</p>
                        <p className="text-lg" style={{ color: '#4a235a' }}>Teléfono: +123 456 7890</p>
                        <p className="text-lg" style={{ color: '#4a235a' }}>Email: info@impresionesavila.com</p>
                    </div>
                    <div className="p-8" style={{ backgroundColor: '#ffffff', borderRadius: '20px', boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)', transition: '0.3s', transform: 'hover:scale(1.05)' }}>
                        <h3 className="text-3xl font-bold mb-4" style={{ color: '#6c3483' }}>Horario de Atención</h3>
                        <p className="text-lg" style={{ color: '#4a235a' }}>Lunes - Viernes: 9:00 AM - 6:00 PM</p>
                        <p className="text-lg" style={{ color: '#4a235a' }}>Sábado: 10:00 AM - 2:00 PM</p>
                        <p className="text-lg" style={{ color: '#4a235a' }}>Domingo: Cerrado</p>
                    </div>
                    <div className="p-8" style={{ backgroundColor: '#ffffff', borderRadius: '20px', boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)', transition: '0.3s', transform: 'hover:scale(1.05)' }}>
                        <h3 className="text-3xl font-bold mb-4" style={{ color: '#6c3483' }}>Redes Sociales</h3>
                        <p className="text-lg" style={{ color: '#4a235a' }}>Facebook: @ImpresionesAvila</p>
                        <p className="text-lg" style={{ color: '#4a235a' }}>Twitter: @ImpAvila</p>
                        <p className="text-lg" style={{ color: '#4a235a' }}>Instagram: @impresiones_avila</p>
                    </div>
                </div>
            </section>

            {/* Formulario de Contacto */}
            <section className="py-16 px-8 text-center" style={{ backgroundColor: '#ffffff', borderRadius: '20px', boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)', marginBottom: '4rem' }}>
                <h2 className="text-5xl font-bold mb-12" style={{ color: '#4a235a' }}>Envíanos un Mensaje</h2>
                <form className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex flex-col">
                        <label htmlFor="nombre" className="text-lg font-semibold mb-2" style={{ color: '#6c3483' }}>Nombre Completo</label>
                        <input type="text" id="nombre" className="w-full p-4 rounded-lg border-none focus:ring-2 placeholder-gray-400" style={{ backgroundColor: '#f3e5f5', focusRingColor: '#d7bde2' }} placeholder="Nombre Completo" />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="email" className="text-lg font-semibold mb-2" style={{ color: '#6c3483' }}>Email</label>
                        <input type="email" id="email" className="w-full p-4 rounded-lg border-none focus:ring-2 placeholder-gray-400" style={{ backgroundColor: '#f3e5f5', focusRingColor: '#d7bde2' }} placeholder="Email" />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="telefono" className="text-lg font-semibold mb-2" style={{ color: '#6c3483' }}>Teléfono</label>
                        <input type="text" id="telefono" className="w-full p-4 rounded-lg border-none focus:ring-2 placeholder-gray-400" style={{ backgroundColor: '#f3e5f5', focusRingColor: '#d7bde2' }} placeholder="Teléfono" />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="asunto" className="text-lg font-semibold mb-2" style={{ color: '#6c3483' }}>Asunto</label>
                        <input type="text" id="asunto" className="w-full p-4 rounded-lg border-none focus:ring-2 placeholder-gray-400" style={{ backgroundColor: '#f3e5f5', focusRingColor: '#d7bde2' }} placeholder="Asunto" />
                    </div>
                    <div className="col-span-full">
                        <label htmlFor="mensaje" className="text-lg font-semibold mb-2" style={{ color: '#6c3483' }}>Mensaje</label>
                        <textarea id="mensaje" rows="6" className="w-full p-4 rounded-lg border-none focus:ring-2 placeholder-gray-400" style={{ backgroundColor: '#f3e5f5', focusRingColor: '#d7bde2' }} placeholder="Escribe tu mensaje aquí..."></textarea>
                    </div>
                    <div className="col-span-full text-center">
                        <button type="submit" className="text-lg px-12 py-4 rounded-full shadow-xl transition-all duration-300 transform hover:scale-105" style={{ backgroundColor: '#d7bde2', color: '#4a235a' }}>Enviar Mensaje</button>
                    </div>
                </form>
            </section>

            {/* Mapa de Ubicación */}
            <section className="py-16 px-8 text-center">
                <h2 className="text-5xl font-bold mb-12" style={{ color: '#4a235a' }}>Nuestra Ubicación</h2>
                <div className="w-full h-96">
                    <iframe 
                        title="Ubicación de Impresiones Avila"
                        className="w-full h-full rounded-lg shadow-xl"
                        frameBorder="0"
                        style={{ border: 0 }}
                        src="https://www.google.com/maps/embed/v1/place?q=123%20Calle%20Falsa,%20Ciudad,%20Pa%C3%ADs&key=TU_API_KEY"
                        allowFullScreen>
                    </iframe>
                </div>
            </section>

            {/* Sección de Preguntas Frecuentes */}
            <section className="py-16 px-8 text-center" style={{ backgroundColor: '#f3e5f5', borderRadius: '20px', boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)' }}>
                <h2 className="text-5xl font-bold mb-12" style={{ color: '#4a235a' }}>Preguntas Frecuentes</h2>
                <div className="max-w-4xl mx-auto">
                    <details className="mb-4">
                        <summary className="text-lg font-semibold mb-2 cursor-pointer" style={{ color: '#6c3483' }}>¿Cuáles son los tiempos de entrega?</summary>
                        <p style={{ color: '#4a235a' }}>Los tiempos de entrega varían según el tipo de producto y cantidad solicitada. Generalmente, el tiempo de producción es de 3-5 días hábiles.</p>
                    </details>
                    <details className="mb-4">
                        <summary className="text-lg font-semibold mb-2 cursor-pointer" style={{ color: '#6c3483' }}>¿Ofrecen servicios de diseño?</summary>
                        <p style={{ color: '#4a235a' }}>Sí, contamos con un equipo de diseñadores gráficos que puede ayudarte a crear el diseño perfecto para tus necesidades.</p>
                    </details>
                    <details className="mb-4">
                        <summary className="text-lg font-semibold mb-2 cursor-pointer" style={{ color: '#6c3483' }}>¿Cuál es el método de pago?</summary>
                        <p style={{ color: '#4a235a' }}>Aceptamos pagos con tarjeta de crédito, PayPal, transferencias bancarias y Sinpe Móvil.</p>
                    </details>
                    <details>
                        <summary className="text-lg font-semibold mb-2 cursor-pointer" style={{ color: '#6c3483' }}>¿Cómo puedo realizar un pedido?</summary>
                        <p style={{ color: '#4a235a' }}>Puedes realizar un pedido a través de nuestra página web o visitando nuestra oficina principal.</p>
                    </details>
                </div>
            </section>
        </div>
    );
}

export default Contacto;
