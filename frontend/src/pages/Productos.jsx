import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/productos');
        setProductos(res.data);
      } catch (error) {
        console.error("Error cargando productos");
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, []);

  return (
    <div style={{ backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <div style={{ 
        background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)', 
        color: 'white', 
        padding: '60px 0',
        textAlign: 'center'
      }}>
        <Container>
          <h1 className="display-4 fw-bold mb-3">🛍️ Gama EkiNature</h1>
          <p style={{ fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            Descubre nuestros productos de control de plagas, diseñados para proteger tu hogar de manera segura y efectiva.
          </p>
        </Container>
      </div>

      <Container className="py-5">
        {loading ? (
          <div className="text-center py-5"><Spinner animation="border" variant="success" /></div>
        ) : (
          <Row className="g-4">
            {productos.map((prod) => (
              <Col key={prod.id} md={6} lg={4}>
                <Card className="h-100 border-0 shadow-lg" style={{ borderRadius: '25px', transition: 'transform 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f1f8e9 0%, #e8f5e9 100%)', padding: '20px', borderRadius: '25px 25px 0 0' }}>
                    <img 
                      src={prod.imagen_url.startsWith('http') ? prod.imagen_url : `/img/${prod.imagen_url}`}
                      alt={prod.nombre}
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                      onError={(e) => { e.target.src = "https://cdn-icons-png.flaticon.com/512/3039/3039039.png"; }}
                    />
                  </div>
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="fw-bold" style={{ color: '#1b5e20', fontSize: '1.2rem' }}>{prod.nombre}</Card.Title>
                    <Card.Text className="text-muted flex-grow-1" style={{ textAlign: 'justify', fontSize: '0.95rem' }}>{prod.descripcion}</Card.Text>
                    <div className="d-flex justify-content-between align-items-center mt-4">
                      <span className="fw-bold" style={{ color: '#2e7d32', fontSize: '1.5rem' }}>${parseFloat(prod.precio).toFixed(2)}</span>
                      <Button className="fw-bold" style={{ borderRadius: '12px', backgroundColor: '#4caf50', border: 'none' }} onClick={() => addToCart(prod)}>Añadir 🛒</Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
};

export default Productos;