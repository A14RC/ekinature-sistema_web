import React from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';

const Contacto = () => {
  return (
    <Container className="py-5">
      <h2 className="text-center fw-bold mb-5 text-primary-custom">Contáctanos</h2>
      <Row>
        <Col md={6} className="mb-4">
          <Card className="h-100 border-0 shadow-sm bg-cream p-4">
            <h4 className="fw-bold mb-3">Información de Contacto</h4>
            <p className="mb-2">📧 <strong>Email:</strong> info@ekinature.com</p>
            <p className="mb-2">📱 <strong>WhatsApp:</strong> +593 99 999 9999</p>
            <p className="mb-2">📍 <strong>Ubicación:</strong> Quito, Ecuador</p>
            <hr />
            <p className="small text-muted">Atendemos pedidos a nivel nacional con envíos seguros. Horario de atención: Lunes a Viernes de 9:00 a 18:00.</p>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="border-0 shadow-sm p-4">
            <Form>
                <Form.Group className="mb-3">
                <Form.Label>Nombre Completo</Form.Label>
                <Form.Control type="text" placeholder="Tu nombre" />
                </Form.Group>
                <Form.Group className="mb-3">
                <Form.Label>Correo Electrónico</Form.Label>
                <Form.Control type="email" placeholder="nombre@ejemplo.com" />
                </Form.Group>
                <Form.Group className="mb-3">
                <Form.Label>Mensaje</Form.Label>
                <Form.Control as="textarea" rows={4} placeholder="¿En qué podemos ayudarte?" />
                </Form.Group>
                <Button className="btn-primary-custom w-100" onClick={(e) => e.preventDefault()}>Enviar Mensaje</Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Contacto;