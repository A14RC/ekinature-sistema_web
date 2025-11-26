import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import productService from '../services/productService';
import { useCart } from '../context/CartContext';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await productService.getAll();
        setProductos(data);
      } catch (error) {
        console.error("Error cargando productos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, []);

  return (
    <Container className="py-5">
      <h2 className="text-center fw-bold mb-4" style={{ color: 'var(--color-primary)' }}>
        Nuestros Productos
      </h2>
      
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status" variant="success" />
        </div>
      ) : (
        <Row className="g-4 justify-content-center">
          {productos.map((prod) => (
            <Col key={prod.id} md={6} lg={4}>
              <Card className="h-100 shadow-sm border-0 hover-effect">
                <div style={{ height: '250px', overflow: 'hidden', backgroundColor: '#f8f9fa' }} className="d-flex align-items-center justify-content-center">
                   <img 
                    src={`/img/${prod.imagen_url}`}
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/300x300/e8c465/1a3c1e?text=Sin+Foto"; }}
                    alt={prod.nombre}
                    className="img-fluid p-3"
                    style={{ maxHeight: '100%', objectFit: 'contain' }}
                   />
                </div>
                
                <Card.Body className="d-flex flex-column bg-white">
                  <Card.Title className="fw-bold text-primary-custom">{prod.nombre}</Card.Title>
                  <Card.Text className="text-muted flex-grow-1" style={{ fontSize: '0.9rem' }}>
                    {prod.descripcion}
                  </Card.Text>
                  
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <h4 className="mb-0 fw-bold text-success">${prod.precio}</h4>
                    <Button 
                      className="btn-primary-custom"
                      onClick={() => addToCart(prod)}
                    >
                      Añadir al Carrito 🛒
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Productos;