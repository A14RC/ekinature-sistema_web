import { Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';

const Navigation = () => {
  return (
    // 'sticky-top' mantiene el menú visible al bajar (mejor usabilidad)
    // 'shadow-sm' da un borde sutil elegante
    <Navbar expand="lg" className="bg-cream shadow-sm sticky-top py-3">
      <Container>
        {/* LOGO: Enlace directo al inicio */}
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-4" style={{ color: 'var(--color-primary)' }}>
          EkiNature
        </Navbar.Brand>

        {/* Botón hamburguesa para móviles (limpio y funcional) */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        {/* Enlaces de navegación */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto align-items-center">
            {/* Usamos map para evitar repetir código y mantenerlo limpio */}
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

          {/* Botón de Carrito destacado */}
          <Nav>
             <Nav.Link as={Link} to="/carrito" className="btn-primary-custom text-white px-4 shadow-sm">
                🛒 Mi Carrito
             </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;