import React, { useState } from 'react';
import { Container, Table, Button, Card, Row, Col, ListGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import orderService from '../services/orderService';

const Carrito = () => {
  const { cart, removeFromCart, addToCart, clearCart, totalPrice } = useCart();
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  // --- LÓGICA FINANCIERA ---
  const COSTO_ENVIO = 3.50; // Tarifa plana (sE PUEDE EDITAR)
  const TASA_IVA = 0.15; // 15%
  
  // Cálculos matemáticos
  const subtotal = totalPrice;
  const iva = subtotal * TASA_IVA;
  const descuento = 0.00; // Aquí  se podra conectar un sistema de cupones a futuro
  const totalPagar = subtotal + iva + COSTO_ENVIO - descuento;

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setProcessing(true);

    try {
      // Envio el desglose exacto al backend
      const orderData = {
        items: cart,
        subtotal: subtotal.toFixed(2),
        iva: iva.toFixed(2),
        envio: COSTO_ENVIO.toFixed(2),
        descuento: descuento.toFixed(2),
        total: totalPagar.toFixed(2)
      };

      const response = await orderService.createOrder(orderData);
      
      alert(`¡Orden Recibida! 📄\nPedido #${response.pedidoId}\nTotal pagado: $${totalPagar.toFixed(2)}`);
      clearCart();
      navigate('/');

    } catch (error) {
      alert("Error al procesar el pedido.");
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
      <h2 className="mb-4 fw-bold text-center" style={{ color: 'var(--color-primary)' }}>Resumen de Compra</h2>
      <Row>
        {/* Tabla de Productos (Izquierda) */}
        <Col lg={8}>
          <Table responsive hover className="align-middle shadow-sm bg-white mb-4">
            <thead className="bg-light">
              <tr>
                <th>Producto</th>
                <th>Precio</th>
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
                       <img src={`/img/${item.imagen_url}`} alt={item.nombre} style={{ width: '50px', objectFit: 'contain', marginRight: '10px' }} onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/50"; }} />
                       <span className="fw-semibold text-primary-custom">{item.nombre}</span>
                    </div>
                  </td>
                  <td>${item.precio}</td>
                  <td className="text-center">
                    <div className="d-flex justify-content-center gap-2">
                        <span className="fw-bold border px-2 rounded">{item.quantity}</span>
                        <Button variant="outline-success" size="sm" onClick={() => addToCart(item)}>+</Button>
                    </div>
                  </td>
                  <td className="fw-bold">${(item.precio * item.quantity).toFixed(2)}</td>
                  <td><Button variant="outline-danger" size="sm" onClick={() => removeFromCart(item.id)}>🗑️</Button></td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>

        {/* Resumen Financiero (Derecha) */}
        <Col lg={4}>
          <Card className="shadow border-0 bg-cream">
            <Card.Body className="p-4">
              <h4 className="card-title fw-bold mb-4" style={{ color: 'var(--color-primary)' }}>Detalle de Pago</h4>
              
              <ListGroup variant="flush" className="bg-transparent mb-3">
                <ListGroup.Item className="d-flex justify-content-between bg-transparent border-0 px-0 py-1">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between bg-transparent border-0 px-0 py-1">
                  <span>IVA (15%):</span>
                  <span>${iva.toFixed(2)}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between bg-transparent border-0 px-0 py-1">
                  <span>Envío (Tarifa Plana):</span>
                  <span>${COSTO_ENVIO.toFixed(2)}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between bg-transparent border-0 px-0 py-1 text-success">
                  <span>Descuento:</span>
                  <span>-${descuento.toFixed(2)}</span>
                </ListGroup.Item>
              </ListGroup>
              
              <hr />
              
              <div className="d-flex justify-content-between mb-4 fw-bold fs-3 text-primary-custom">
                <span>Total Final:</span>
                <span>${totalPagar.toFixed(2)}</span>
              </div>
              
              <Button className="w-100 btn-primary-custom py-3 fs-5 shadow-sm" onClick={handleCheckout} disabled={processing}>
                {processing ? 'Procesando...' : 'Confirmar y Pagar'}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Carrito;