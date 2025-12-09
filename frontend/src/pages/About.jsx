import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const About = () => {
  return (
    <Container className="py-5">
      <Row className="justify-content-center text-center mb-5">
        <Col lg={8}>
          <h1 className="fw-bold text-primary-custom mb-3">Nuestra Misión</h1>
          <p className="lead text-muted">
            En EkiNature, nos dedicamos a crear hogares libres de plagas sin comprometer la salud de tu familia ni el medio ambiente.
          </p>
        </Col>
      </Row>
      <Row className="g-4 align-items-center">
        <Col md={6}>
            <div className="bg-light p-5 text-center rounded shadow-sm" style={{minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                {/* Placeholder para imagen */}
                <span className="text-muted">Imagen Institucional / Laboratorio</span>
            </div>
        </Col>
        <Col md={6}>
          <div>
            <h3 className="fw-bold mb-3 text-primary-custom">¿Por qué EkiNature?</h3>
            <p>Nacimos de la necesidad de encontrar una alternativa a los insecticidas tóxicos tradicionales. Nuestra fórmula en gel combina eficacia profesional con ingredientes biodegradables.</p>
            <ul className="list-unstyled mt-3">
                <li className="mb-2">✅ <strong>Seguridad:</strong> Seguro para mascotas y niños.</li>
                <li className="mb-2">✅ <strong>Ecología:</strong> Ingredientes amigables con el entorno.</li>
                <li className="mb-2">✅ <strong>Eficacia:</strong> Resultados comprobados en laboratorio.</li>
            </ul>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default About;