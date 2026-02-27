import React from 'react';
import { Navbar, Nav, Container, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navigation = () => {
    const { cart } = useCart();
    // Suma total de productos
    const totalItems = cart.reduce((acc, item) => acc + (parseInt(item.cantidad) || 0), 0);

    return (
        <Navbar expand="lg" className="shadow-lg sticky-top" style={{ background: 'linear-gradient(90deg, #ffffff 0%, #f9f9f9 100%)', borderBottom: '3px solid #2e7d32' }}>
            <Container>
                <Navbar.Brand as={Link} to="/" className="fw-bold" style={{ color: '#1b5e20', fontSize: '1.8rem' }}>
                    🌿 EkiNature
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto align-items-center">
                        <Nav.Link as={Link} to="/" className="mx-2 fw-semibold" style={{ color: '#333', transition: 'color 0.3s' }} onMouseEnter={(e) => e.target.style.color = '#2e7d32'} onMouseLeave={(e) => e.target.style.color = '#333'}>Inicio</Nav.Link>
                        <Nav.Link as={Link} to="/productos" className="mx-2 fw-semibold" style={{ color: '#333', transition: 'color 0.3s' }} onMouseEnter={(e) => e.target.style.color = '#2e7d32'} onMouseLeave={(e) => e.target.style.color = '#333'}>Productos</Nav.Link>
                        <Nav.Link as={Link} to="/sobre-nosotros" className="mx-2 fw-semibold" style={{ color: '#333', transition: 'color 0.3s' }} onMouseEnter={(e) => e.target.style.color = '#2e7d32'} onMouseLeave={(e) => e.target.style.color = '#333'}>Nosotros</Nav.Link>
                        <Nav.Link as={Link} to="/contacto" className="mx-2 fw-semibold" style={{ color: '#333', transition: 'color 0.3s' }} onMouseEnter={(e) => e.target.style.color = '#2e7d32'} onMouseLeave={(e) => e.target.style.color = '#333'}>Contacto</Nav.Link>
                        <Nav.Link as={Link} to="/carrito" className="ms-4 d-flex align-items-center" style={{ position: 'relative' }}>
                            <span style={{ fontSize: '1.6rem' }}>🛒</span>
                            {totalItems > 0 && (
                                <Badge pill bg="success" style={{ position: 'absolute', top: '-8px', right: '-12px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                                    {totalItems}
                                </Badge>
                            )}
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Navigation;