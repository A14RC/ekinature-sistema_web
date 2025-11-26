import { Link } from 'react-router-dom';
import { Navbar, Nav, Container, Badge } from 'react-bootstrap';
import { useCart } from '../context/CartContext';

const Navigation = () => {
  const { totalItems } = useCart();

  return (
    <Navbar expand="lg" className="bg-cream shadow-sm sticky-top py-3">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-4" style={{ color: 'var(--color-primary)' }}>
          EkiNature
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto align-items-center">
            {[
              { nombre: 'Inicio', ruta: '/' },
              { nombre: 'Sobre Nosotros', ruta: '/about' },
              { nombre: 'Productos', ruta: '/productos' },
              { nombre: 'Contacto', ruta: '/contacto' }
            ].map((item) => (
              <Nav.Link 
                key={item.nombre}
                as={Link} 
                to={item.ruta} 
                className="fw-medium mx-3" 
                style={{ color: 'var(--color-primary)' }}
              >
                {item.nombre}
              </Nav.Link>
            ))}
          </Nav>

          <Nav>
             <Nav.Link as={Link} to="/carrito" className="btn-primary-custom text-white px-4 shadow-sm position-relative">
                🛒 Mi Carrito
                {totalItems > 0 && (
                  <Badge 
                    bg="danger" 
                    pill 
                    className="position-absolute top-0 start-100 translate-middle"
                  >
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