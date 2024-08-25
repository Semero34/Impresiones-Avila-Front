import React, { useState } from 'react';
import axios from 'axios';

const InvoiceForm = () => {
  const [cliente, setCliente] = useState({
    nombre: '',
    identificacion: '',
    correo: ''
  });
  const [productos, setProductos] = useState([
    { descripcion: '', cantidad: 1, precio: 0 }
  ]);
  const [loading, setLoading] = useState(false);

  const handleClienteChange = (e) => {
    const { name, value } = e.target;
    setCliente({ ...cliente, [name]: value });
  };

  const handleProductoChange = (index, e) => {
    const { name, value } = e.target;
    const newProductos = [...productos];
    newProductos[index][name] = value;
    setProductos(newProductos);
  };

  const agregarProducto = () => {
    setProductos([...productos, { descripcion: '', cantidad: 1, precio: 0 }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('/api/generate-invoice', { cliente, productos });
      alert('Factura generada y enviada exitosamente');
    } catch (error) {
      alert('Error al generar la factura');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Datos del Cliente</h2>
      <div>
        <label>Nombre:</label>
        <input type="text" name="nombre" value={cliente.nombre} onChange={handleClienteChange} required />
      </div>
      <div>
        <label>Identificación:</label>
        <input type="text" name="identificacion" value={cliente.identificacion} onChange={handleClienteChange} required />
      </div>
      <div>
        <label>Correo:</label>
        <input type="email" name="correo" value={cliente.correo} onChange={handleClienteChange} required />
      </div>

      <h2>Productos</h2>
      {productos.map((producto, index) => (
        <div key={index}>
          <label>Descripción:</label>
          <input type="text" name="descripcion" value={producto.descripcion} onChange={(e) => handleProductoChange(index, e)} required />
          <label>Cantidad:</label>
          <input type="number" name="cantidad" value={producto.cantidad} onChange={(e) => handleProductoChange(index, e)} required min="1" />
          <label>Precio:</label>
          <input type="number" name="precio" value={producto.precio} onChange={(e) => handleProductoChange(index, e)} required min="0" step="0.01" />
        </div>
      ))}
      <button type="button" onClick={agregarProducto}>Agregar Producto</button>
      <button type="submit" disabled={loading}>{loading ? 'Generando...' : 'Generar Factura'}</button>
    </form>
  );
};

export default InvoiceForm;
