import { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import axios from 'axios';
import API_BASE_URL from '../api';

const Contacto = () => {
    const [datos, setDatos] = useState({ nombre: '', email: '', telefono: '', asunto: '', mensaje: '' });
    const [enviado, setEnviado] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_BASE_URL}/contacto`, datos);
            setEnviado(true);
            setDatos({ nombre: '', email: '', telefono: '', asunto: '', mensaje: '' });
        } catch (error) {
            alert("Error al enviar mensaje");
        }
    };

    return (
        <div style={{ backgroundColor: '#f9f9f9', minHeight: '100vh', paddingTop: '40px', paddingBottom: '40px' }}>
            <Container>
                <Row className="align-items-center mb-5">
                    <Col lg={6} className="mb-4 mb-lg-0">
                        <h1 className="display-4 fw-bold mb-4" style={{ color: '#1b5e20' }}>💬 Contáctanos</h1>
                        <p style={{ fontSize: '1.1rem', color: '#555', lineHeight: '1.8', marginBottom: '30px' }}>
                            ¿Tienes preguntas sobre EkiNature? Estamos aquí para ayudarte. Envíanos un mensaje y nos pondremos en contacto lo antes posible.
                        </p>
                        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                            <h4 className="fw-bold mb-4" style={{ color: '#2e7d32' }}>ℹ️ Información de Contacto</h4>
                            <div className="mb-3">
                                <p style={{ fontSize: '1.1rem', margin: '0 0 5px 0' }}>📍 <strong>Ubicación</strong></p>
                                <p style={{ color: '#666', margin: 0 }}>Valle de los Chillos, Quito 🇪🇨</p>
                            </div>
                            <div className="mb-3">
                                <p style={{ fontSize: '1.1rem', margin: '0 0 5px 0' }}>📞 <strong>Teléfono</strong></p>
                                <p style={{ color: '#666', margin: 0 }}>+593 9 0000 0000</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '1.1rem', margin: '0 0 5px 0' }}>📧 <strong>Email</strong></p>
                                <p style={{ color: '#666', margin: 0 }}>info@ekinature.com</p>
                            </div>
                        </div>
                    </Col>
                    <Col lg={6}>
                        <Card className="border-0 shadow-lg p-5" style={{ borderRadius: '25px', backgroundColor: 'white' }}>
                            {enviado && <Alert variant="success" className="mb-4">✅ ¡Mensaje enviado con éxito! Pronto nos contactaremos contigo.</Alert>}
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-semibold" style={{ color: '#333' }}>Nombre Completo</Form.Label>
                                    <Form.Control 
                                        required 
                                        value={datos.nombre} 
                                        onChange={e => setDatos({...datos, nombre: e.target.value})}
                                        style={{ borderRadius: '10px', padding: '10px', borderColor: '#ddd' }}
                                        placeholder="Tu nombre"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-semibold" style={{ color: '#333' }}>Email</Form.Label>
                                    <Form.Control 
                                        type="email" 
                                        required 
                                        value={datos.email} 
                                        onChange={e => setDatos({...datos, email: e.target.value})}
                                        style={{ borderRadius: '10px', padding: '10px', borderColor: '#ddd' }}
                                        placeholder="tu@email.com"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-semibold" style={{ color: '#333' }}>Teléfono de Contacto</Form.Label>
                                    <Form.Control 
                                        required 
                                        value={datos.telefono} 
                                        onChange={e => setDatos({...datos, telefono: e.target.value})}
                                        style={{ borderRadius: '10px', padding: '10px', borderColor: '#ddd' }}
                                        placeholder="Ej: 0991234567"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-semibold" style={{ color: '#333' }}>Asunto</Form.Label>
                                    <Form.Control 
                                        required 
                                        value={datos.asunto} 
                                        onChange={e => setDatos({...datos, asunto: e.target.value})}
                                        style={{ borderRadius: '10px', padding: '10px', borderColor: '#ddd' }}
                                        placeholder="¿Cuál es tu pregunta?"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-semibold" style={{ color: '#333' }}>Mensaje</Form.Label>
                                    <Form.Control 
                                        as="textarea" 
                                        rows={4} 
                                        required 
                                        value={datos.mensaje} 
                                        onChange={e => setDatos({...datos, mensaje: e.target.value})}
                                        style={{ borderRadius: '10px', padding: '10px', borderColor: '#ddd' }}
                                        placeholder="Cuéntanos más detalles..."
                                    />
                                </Form.Group>
                                <Button className="w-100 py-3 fw-bold" size="lg" type="submit" style={{ borderRadius: '12px', backgroundColor: '#2e7d32', border: 'none' }}>
                                    📤 Enviar Consulta
                                </Button>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Contacto;