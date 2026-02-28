import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import API_BASE_URL from '../api';

const Productos = () => {
    const [productos, setProductos] = useState([]);
    const { addToCart } = useCart();

    useEffect(() => {
        const cargarProductos = async () => {
            try {
                const respuesta = await axios.get(`${API_BASE_URL}/productos`);
                setProductos(respuesta.data);
            } catch (error) {
                console.error("Error al cargar los productos de la base de datos");
            }
        };
        cargarProductos();
    }, []);

    return (
        <div style={{ backgroundColor: '#f9f9f9', minHeight: '100vh', paddingTop: '40px', paddingBottom: '60px' }}>
            <Container>
                <div className="text-center mb-5">
                    <h2 className="fw-bold" style={{ color: '#1b5e20', fontSize: '2.5rem' }}>Nuestros Productos</h2>
                    <p className="text-muted" style={{ fontSize: '1.1rem' }}>Soluciones profesionales para el control de plagas</p>
                </div>
                
                <Row className="g-4">
                    {productos.map(producto => (
                        <Col md={4} key={producto.id}>
                            <Card className="h-100 border-0 shadow-sm" style={{ borderRadius: '20px', overflow: 'hidden', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                                <div style={{ height: '250px', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                                    <Card.Img 
                                        variant="top" 
                                        src={producto.imagen_url ? `https://ekinature-backend.onrender.com${producto.imagen_url}` : '/img/default-placeholder.png'} 
                                        style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                                    />
                                </div>
                                <Card.Body className="d-flex flex-column p-4">
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <Card.Title className="fw-bold mb-0" style={{ color: '#2e7d32', fontSize: '1.25rem' }}>{producto.nombre}</Card.Title>
                                        <Badge bg={producto.stock > 0 ? "success" : "danger"} style={{ borderRadius: '10px' }}>
                                            {producto.stock > 0 ? `Stock: ${producto.stock}` : 'Agotado'}
                                        </Badge>
                                    </div>
                                    <Card.Text className="text-muted mb-4" style={{ flexGrow: 1, fontSize: '0.95rem' }}>
                                        {producto.descripcion}
                                    </Card.Text>
                                    <div className="d-flex justify-content-between align-items-center mt-auto">
                                        <h3 className="fw-bold mb-0" style={{ color: '#1b5e20' }}>${producto.precio}</h3>
                                        <Button 
                                            onClick={() => addToCart({...producto, cantidad: 1})}
                                            disabled={producto.stock <= 0}
                                            style={{ backgroundColor: '#2e7d32', border: 'none', borderRadius: '10px', padding: '10px 20px' }}
                                            className="fw-bold shadow-sm"
                                        >
                                            {producto.stock > 0 ? '+ Agregar' : 'Sin Stock'}
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
                
                {productos.length === 0 && (
                    <div className="text-center p-5 text-muted">
                        <h4>No hay productos disponibles en este momento.</h4>
                    </div>
                )}
            </Container>
        </div>
    );
};

export default Productos;