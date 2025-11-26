import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import heroImage from '../assets/hero-gel.png'; // Asegurate que la imagen exista

const Home = () => {
  return (
    <div className="home-page">
      {/* --- HERO SECTION --- */}
      <section className="hero-section py-5">
        <Container>
          <Row className="align-items-center flex-column-reverse flex-lg-row">
            {/* Columna de Texto */}
            <Col lg={6} className="text-center text-lg-start mb-5 mb-lg-0">
              <h1 className="display-4 fw-bold mb-3" style={{ color: 'var(--color-primary)' }}>
                CONTROL NATURAL <br /> DE PLAGAS
              </h1>
              <p className="lead mb-4 fs-5" style={{ color: '#4a4a4a' }}>
                Protege tu hogar de cucarachas y hormigas de forma segura y ecológica.
                Nuestra fórmula ofrece una solución efectiva sin dañar a tu familia.
              </p>
              
              <div className="d-flex gap-3 justify-content-center justify-content-lg-start">
                <Link to="/productos" className="btn btn-accent-custom px-4 py-2 shadow-sm rounded-pill">
                  VER BENEFICIOS
                </Link>
                <Link to="/contacto" className="btn btn-outline-success px-4 py-2 rounded-pill">
                  CONTÁCTANOS
                </Link>
              </div>
            </Col>

            {/* Columna de Imagen */}
            <Col lg={6} className="text-center">
              {/* Se añade img-fluid para respuesta movil y animacion suave */}
              <img 
                src={heroImage} 
                alt="Gel Insecticida Miga" 
                className="img-fluid"
                style={{ maxHeight: '500px', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.15))' }}
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* --- SECCION DE BENEFICIOS --- */}
      <section className="benefits-section py-5 bg-white">
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold" style={{ color: 'var(--color-primary)' }}>Sobre Miga!</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '700px' }}>
              Miga! es un insecticida en gel diseñado para eliminar plagas de manera efectiva 
              y con bajo impacto ambiental.
            </p>
          </div>

          <Row className="g-4">
            {/* Tarjeta 1 */}
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm text-center p-4 bg-cream">
                <Card.Body>
                  <div className="display-4 mb-3 text-success">✔</div>
                  <Card.Title className="fw-bold">100% Efectivo</Card.Title>
                  <Card.Text>
                    Elimina cucarachas y hormigas con precisión desde la primera aplicación.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            {/* Tarjeta 2 */}
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm text-center p-4 bg-cream">
                <Card.Body>
                  <div className="display-4 mb-3 text-success">✚</div>
                  <Card.Title className="fw-bold">Baja Toxicidad</Card.Title>
                  <Card.Text>
                    Seguro para niños, adultos y animales de compañía gracias a su composición natural.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            {/* Tarjeta 3 */}
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm text-center p-4 bg-cream">
                <Card.Body>
                  <div className="display-4 mb-3 text-success">🍃</div>
                  <Card.Title className="fw-bold">Ingredientes Naturales</Card.Title>
                  <Card.Text>
                    Nuestros productos son biodegradables y no emiten malos olores.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Home;