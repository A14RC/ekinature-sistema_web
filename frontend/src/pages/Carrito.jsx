import React, { useState } from 'react';
import { Container, Table, Button, Card, Row, Col, Form, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import orderService from '../services/orderService';

const Carrito = () => {
  const { cart, removeFromCart, addToCart, decreaseQuantity, clearCart, totalPrice } = useCart();
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  
  const [formData, setFormData] = useState({
    nombre: '',
    cedula: '',
    telefono: '',
    direccion: ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const COSTO_ENVIO = 3.50;
  const TASA_IVA = 0.15;
  const subtotal = totalPrice;
  const iva = subtotal * TASA_IVA;
  const totalPagar = subtotal + iva + COSTO_ENVIO;

  const handleCheckout = async (e) => {
    e.preventDefault(); // Evitar recarga del form
    if (cart.length === 0) return;

    setProcessing(true);

    try {
      // Preparamos el paquete completo para el Backend
      const orderData = {
        items: cart,
        subtotal: subtotal.toFixed(2),
        iva: iva.toFixed(2),
        envio: COSTO_ENVIO.toFixed(2),
        total: totalPagar.toFixed(2),
        cliente: formData // <--- Enviamos los datos del formulario HU9
      };

      const response = await orderService.createOrder(orderData);
      
      alert(`¡Pedido Realizado con Éxito! 🚚\nOrden #${response.pedidoId}\nNos pondremos en contacto al: ${formData.telefono}`);
      clearCart();
      navigate('/');

    } catch (error) {
      alert("Error al procesar el pedido. Verifica la conexión.");
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  if (cart.length === 0) return (
      <Container className="py-5 text-center">
        <h2 className="mb-4">Tu carrito está vacío 😔</h2>
        <Link to="/productos" className="btn btn-primary-custom px-4">Ir a comprar</Link>
      </Container>
  );

  return (
    <Container className="py-5">
      <h2 className="mb-5 fw-bold text-center text-primary-custom">Finalizar Compra</h2>
      
      <Row className="g-5">
        {/* COLUMNA IZQUIERDA: FORMULARIO DE DATOS */}
        <Col lg={7}>
          <Card className="shadow-sm border-0 mb-4">
            <Card.Header className="bg-white py-3">
              <h5 className="mb-0 fw-bold">1. Datos de Envío y Facturación</h5>
            </Card.Header>
            <Card.Body className="p-4">
              <Form id="checkoutForm" onSubmit={handleCheckout}>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Label>Nombre Completo</Form.Label>
                    <Form.Control type="text" name="nombre" required placeholder="Ej: Juan Pérez" onChange={handleInputChange} />
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Label>Cédula / RUC</Form.Label>
                    <Form.Control type="text" name="cedula" required placeholder="Ej: 171..." onChange={handleInputChange} />
                  </Col>
                </Row>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Label>Teléfono Celular</Form.Label>
                    <Form.Control type="tel" name="telefono" required placeholder="Ej: 099..." onChange={handleInputChange} />
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Label>Ciudad</Form.Label>
                    <Form.Control type="text" placeholder="Quito" readOnly className="bg-light" />
                  </Col>
                </Row>
                <div className="mb-3">
                  <Form.Label>Dirección Exacta de Entrega</Form.Label>
                  <Form.Control as="textarea" rows={2} name="direccion" required placeholder="Calle principal, secundaria, número de casa..." onChange={handleInputChange} />
                </div>
              </Form>
            </Card.Body>
          </Card>

          <h5 className="fw-bold mb-3">2. Revisión de Productos</h5>
          <Table responsive hover className="align-middle shadow-sm bg-white">
            <thead className="bg-light">
              <tr>
                <th>Producto</th>
                <th className="text-center">Cant.</th>
                <th>Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="d-flex align-items-center">
                       <img src={`/img/${item.imagen_url}`} alt={item.nombre} style={{ width: '40px', objectFit: 'contain', marginRight: '10px' }} onError={(e)=>{e.target.onerror=null;e.target.src="https://placehold.co/40"}}/>
                       <span className="fw-semibold text-primary-custom" style={{fontSize: '0.9rem'}}>{item.nombre}</span>
                    </div>
                  </td>
                  <td className="text-center">
                    {/* BOTONES DE CANTIDAD */}
                    <div className="d-flex justify-content-center align-items-center gap-2">
                        <Button variant="outline-secondary" size="sm" onClick={() => decreaseQuantity(item.id)} disabled={item.quantity <= 1}>-</Button>
                        <span className="fw-bold px-2">{item.quantity}</span>
                        <Button variant="outline-success" size="sm" onClick={() => addToCart(item)}>+</Button>
                    </div>
                  </td>
                  <td className="fw-bold">${(item.precio * item.quantity).toFixed(2)}</td>
                  <td><Button variant="link" className="text-danger p-0" onClick={() => removeFromCart(item.id)}>✕</Button></td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>

        {/* COLUMNA DERECHA: RESUMEN Y PAGO */}
        <Col lg={5}>
          <Card className="shadow border-0 bg-cream sticky-top" style={{ top: '100px' }}>
            <Card.Body className="p-4">
              <h4 className="card-title fw-bold mb-4 text-primary-custom">Resumen de Pago</h4>
              
              <div className="d-flex justify-content-between mb-2"><span>Subtotal:</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="d-flex justify-content-between mb-2"><span>IVA (15%):</span><span>${iva.toFixed(2)}</span></div>
              <div className="d-flex justify-content-between mb-3"><span>Envío:</span><span>${COSTO_ENVIO.toFixed(2)}</span></div>
              
              <hr />
              
              <div className="d-flex justify-content-between mb-4 fw-bold fs-3 text-primary-custom">
                <span>Total:</span><span>${totalPagar.toFixed(2)}</span>
              </div>
              
              {/* El botón está fuera del form, pero usa el atributo form="checkoutForm" para disparar el submit */}
              <Button 
                className="w-100 btn-primary-custom py-3 fs-5 shadow-sm" 
                type="submit" 
                form="checkoutForm" 
                disabled={processing}
              >
                {processing ? 'Registrando Pedido...' : 'Confirmar Pedido'}
              </Button>
              <p className="text-center mt-3 text-muted small">🔒 Pago seguro contra entrega o transferencia.</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Carrito;