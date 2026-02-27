import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div style={{ position: 'relative', backgroundColor: '#fff' }}>
            {/* Acceso Administrativo Oculto */}
            <Link to="/login" style={{ position: 'absolute', top: '15px', right: '15px', opacity: 0.1, zIndex: 10 }}>
                <img src="https://cdn-icons-png.flaticon.com/512/892/892926.png" alt="admin" width="20" />
            </Link>

            {/* SECCIÓN 1: Hero Impactante */}
            <div style={{ 
                background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #388e3c 100%)',
                color: 'white', 
                padding: '80px 0',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute',
                    top: '-50px',
                    right: '-50px',
                    width: '300px',
                    height: '300px',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '50%'
                }}></div>
                <Container style={{ position: 'relative', zIndex: 2 }}>
                    <Row className="align-items-center">
                        <Col lg={6} className="mb-4 mb-lg-0">
                            <h1 className="display-3 fw-bold mb-4">
                                🛡️ Adiós a las Plagas
                            </h1>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: '300', marginBottom: '30px' }}>
                                Solución efectiva, segura y sin compromiso
                            </h2>
                            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '30px' }}>
                                EkiNature es el gel insecticida revolucionario que erradica plagas en 24-48 horas sin fumigaciones ni olores desagradables. Diseñado especialmente para Quito.
                            </p>
                            <div className="d-flex gap-3">
                                <Button as={Link} to="/productos" size="lg" className="fw-bold px-5" style={{ backgroundColor: '#4caf50', border: 'none' }}>
                                    Comprar Ahora 🛒
                                </Button>
                                <Button as={Link} to="/sobre-nosotros" variant="outline-light" size="lg" className="fw-bold px-5">
                                    Saber Más 📚
                                </Button>
                            </div>
                        </Col>
                        <Col lg={6} className="d-none d-lg-block text-center">
                            <div style={{
                                fontSize: '150px',
                                animation: 'float 3s ease-in-out infinite',
                                textShadow: '0 0 30px rgba(255,255,255,0.3)'
                            }}>
                                🐜🌱
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* SECCIÓN 2: Beneficios Principales - Tarjetas Impactantes */}
            <Container className="py-5">
                <div className="text-center mb-5">
                    <h2 className="fw-bold display-5" style={{ color: '#1b5e20', marginBottom: '20px' }}>
                        ⚡ Beneficios Inmediatos
                    </h2>
                    <p style={{ fontSize: '1.1rem', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
                        Descubre por qué miles de quitoños confían en EkiNature
                    </p>
                </div>
                <Row>
                    <Col md={4} className="mb-4">
                        <Card className="h-100 border-0 shadow-lg" style={{ borderRadius: '20px', background: 'linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%)', transition: 'transform 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                            <Card.Body className="p-4">
                                <div style={{ fontSize: '3.5rem', marginBottom: '15px', textAlign: 'center' }}>⏱️</div>
                                <h5 className="fw-bold text-center" style={{ color: '#2e7d32', marginBottom: '15px' }}>Acción Rápida</h5>
                                <p style={{ textAlign: 'justify', color: '#555', lineHeight: '1.6' }}>
                                    Resultados visibles en 24-48 horas. El gel actúa de manera rápida y eficiente, eliminando colonias completas desde el núcleo. 🎯
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4} className="mb-4">
                        <Card className="h-100 border-0 shadow-lg" style={{ borderRadius: '20px', background: 'linear-gradient(135deg, #f1f8e9 0%, #e8f5e9 100%)', transition: 'transform 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                            <Card.Body className="p-4">
                                <div style={{ fontSize: '3.5rem', marginBottom: '15px', textAlign: 'center' }}>👶</div>
                                <h5 className="fw-bold text-center" style={{ color: '#2e7d32', marginBottom: '15px' }}>Seguridad Certificada</h5>
                                <p style={{ textAlign: 'justify', color: '#555', lineHeight: '1.6' }}>
                                    100% seguro para niños y mascotas. No requiere desalojar el hogar. Fórmula con ingredientes de grado alimenticio. ✅
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4} className="mb-4">
                        <Card className="h-100 border-0 shadow-lg" style={{ borderRadius: '20px', background: 'linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%)', transition: 'transform 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                            <Card.Body className="p-4">
                                <div style={{ fontSize: '3.5rem', marginBottom: '15px', textAlign: 'center' }}>💨</div>
                                <h5 className="fw-bold text-center" style={{ color: '#2e7d32', marginBottom: '15px' }}>Sin Olor</h5>
                                <p style={{ textAlign: 'justify', color: '#555', lineHeight: '1.6' }}>
                                    Adiós a los olores desagradables de fumigaciones. EkiNature es inodoro e invisible. Vive normalmente. 😊
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* SECCIÓN 3: Comparativa con alternativas */}
            <div style={{ backgroundColor: '#f9f9f9', padding: '60px 0' }}>
                <Container>
                    <h2 className="fw-bold text-center mb-5" style={{ color: '#1b5e20', fontSize: '2rem' }}>
                        🔥 ¿Por qué EkiNature es mejor?
                    </h2>
                    <Row>
                        <Col md={6} className="mb-4">
                            <Card className="border-0 shadow" style={{ borderRadius: '15px', borderLeft: '5px solid #ff6b6b' }}>
                                <Card.Body className="p-4">
                                    <h5 className="fw-bold mb-3" style={{ color: '#ff6b6b' }}>❌ Fumigación Tradicional</h5>
                                    <ul style={{ color: '#555', lineHeight: '1.8' }}>
                                        <li>Desalojo obligatorio de 3-4 horas</li>
                                        <li>Olor tóxico insoportable</li>
                                        <li>Requiere protección especial</li>
                                        <li>Contaminación ambiental</li>
                                        <li>Efectos secundarios en respiración</li>
                                        <li>Alto costo recurrente</li>
                                    </ul>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={6} className="mb-4">
                            <Card className="border-0 shadow" style={{ borderRadius: '15px', borderLeft: '5px solid #4caf50' }}>
                                <Card.Body className="p-4">
                                    <h5 className="fw-bold mb-3" style={{ color: '#4caf50' }}>✅ EkiNature Gel</h5>
                                    <ul style={{ color: '#555', lineHeight: '1.8' }}>
                                        <li>Aplicación en minutos, sin desalojar</li>
                                        <li>Totalmente inodoro</li>
                                        <li>Seguro manejable sin equipo</li>
                                        <li>100% biodegradable</li>
                                        <li>Sin efectos secundarios</li>
                                        <li>Protección 3 meses por aplicación</li>
                                    </ul>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>

            <div className="text-center mt-5 mb-5">
    <Button 
        as={Link} 
        to="/productos" 
        size="lg" 
        className="fw-bold px-5 py-3 shadow-lg" 
        style={{ backgroundColor: '#2e7d32', border: 'none', borderRadius: '15px', fontSize: '1.2rem' }}
    >
        🛒 ADQUIRIR EKINATURE GEL AHORA
    </Button>
</div>

            {/* SECCIÓN 4: Cómo funciona */}
            <Container className="py-5">
                <h2 className="fw-bold text-center mb-5" style={{ color: '#1b5e20', fontSize: '2rem' }}>
                    🧬 Tecnología de Efecto Dominó
                </h2>
                <Row className="align-items-center">
                    <Col lg={6} className="mb-4 mb-lg-0">
                        <div style={{ backgroundColor: '#f1f8e9', padding: '40px', borderRadius: '20px' }}>
                            <div className="mb-4">
                                <h5 style={{ color: '#2e7d32', fontWeight: 'bold' }}>1. 🎯 Atracción</h5>
                                <p>Las feromonas atraen a los insectos al gel</p>
                            </div>
                            <div className="mb-4">
                                <h5 style={{ color: '#2e7d32', fontWeight: 'bold' }}>2. 🍴 Ingestión</h5>
                                <p>El insecto ingiere el producto letal</p>
                            </div>
                            <div className="mb-4">
                                <h5 style={{ color: '#2e7d32', fontWeight: 'bold' }}>3. 📤 Trasporte</h5>
                                <p>Lo transporta al núcleo de la colonia</p>
                            </div>
                            <div>
                                <h5 style={{ color: '#2e7d32', fontWeight: 'bold' }}>4. 💥 Erradicación</h5>
                                <p>Elimina toda la colonia en cascada</p>
                            </div>
                        </div>
                    </Col>
                    <Col lg={6}>
                        <Card className="border-0 shadow-lg" style={{ borderRadius: '20px', background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)', color: 'white' }}>
                            <Card.Body className="p-5">
                                <h4 className="fw-bold mb-4">🔬 Precisión Científica</h4>
                                <p style={{ lineHeight: '1.8', marginBottom: '20px' }}>
                                    EkiNature utiliza una combinación de feromonas sintéticas y principios activos que garantizan la erradicación total sin afectar a humanos ni mascotas.
                                </p>
                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                    <li className="mb-2">✓ Probado en laboratorio</li>
                                    <li className="mb-2">✓ 3 meses de protección activa</li>
                                    <li className="mb-2">✓ Eficacia comprobada 98%</li>
                                    <li>✓ Certificado Pet-Friendly</li>
                                </ul>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* SECCIÓN 5: Testimonios/Estadísticas */}
            <div style={{ backgroundColor: '#e8f5e9', padding: '60px 0' }}>
                <Container>
                    <Row className="text-center">
                        <Col md={4} className="mb-4">
                            <h2 className="fw-bold" style={{ color: '#1b5e20', fontSize: '2.5rem' }}>
                                98%
                            </h2>
                            <p style={{ color: '#555', fontSize: '1.1rem' }}>
                                Eficacia comprobada
                            </p>
                        </Col>
                        <Col md={4} className="mb-4">
                            <h2 className="fw-bold" style={{ color: '#1b5e20', fontSize: '2.5rem' }}>
                                +5000
                            </h2>
                            <p style={{ color: '#555', fontSize: '1.1rem' }}>
                                Clientes satisfechos en Quito
                            </p>
                        </Col>
                        <Col md={4} className="mb-4">
                            <h2 className="fw-bold" style={{ color: '#1b5e20', fontSize: '2.5rem' }}>
                                3 meses
                            </h2>
                            <p style={{ color: '#555', fontSize: '1.1rem' }}>
                                De protección continua
                            </p>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* SECCIÓN 6: Usos principales */}
            <Container className="py-5">
                <h2 className="fw-bold text-center mb-5" style={{ color: '#1b5e20', fontSize: '2rem' }}>
                    🏢 Ideal Para
                </h2>
                <Row>
                    <Col md={6} lg={3} className="mb-4">
                        <Card className="border-0 shadow text-center h-100" style={{ borderRadius: '15px', backgroundColor: '#f1f8e9' }}>
                            <Card.Body className="p-4">
                                <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🏠</div>
                                <h6 className="fw-bold" style={{ color: '#2e7d32' }}>Hogares</h6>
                                <p style={{ fontSize: '0.9rem', color: '#666' }}>Seguro en tu familia</p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={6} lg={3} className="mb-4">
                        <Card className="border-0 shadow text-center h-100" style={{ borderRadius: '15px', backgroundColor: '#e8f5e9' }}>
                            <Card.Body className="p-4">
                                <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🍽️</div>
                                <h6 className="fw-bold" style={{ color: '#2e7d32' }}>Restaurantes</h6>
                                <p style={{ fontSize: '0.9rem', color: '#666' }}>Certificado alimenticio</p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={6} lg={3} className="mb-4">
                        <Card className="border-0 shadow text-center h-100" style={{ borderRadius: '15px', backgroundColor: '#f1f8e9' }}>
                            <Card.Body className="p-4">
                                <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🏥</div>
                                <h6 className="fw-bold" style={{ color: '#2e7d32' }}>Hospitales</h6>
                                <p style={{ fontSize: '0.9rem', color: '#666' }}>Aprobado sanitario</p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={6} lg={3} className="mb-4">
                        <Card className="border-0 shadow text-center h-100" style={{ borderRadius: '15px', backgroundColor: '#e8f5e9' }}>
                            <Card.Body className="p-4">
                                <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🏪</div>
                                <h6 className="fw-bold" style={{ color: '#2e7d32' }}>Negocios</h6>
                                <p style={{ fontSize: '0.9rem', color: '#666' }}>Confidencial y discreto</p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* SECCIÓN 7: CTA Final */}
            <div style={{ 
                background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
                color: 'white',
                padding: '80px 0',
                textAlign: 'center'
            }}>
                <Container>
                    <h2 className="fw-bold display-4 mb-4">¿Listo para tomar acción?</h2>
                    <p style={{ fontSize: '1.2rem', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
                        Ordena ahora y obtén protección inmediata contra plagas. Envío rápido a Quito.
                    </p>
                    <div className="d-flex gap-3 justify-content-center flex-wrap">
                        <Button as={Link} to="/productos" size="lg" className="fw-bold px-5" style={{ backgroundColor: '#4caf50', border: 'none' }}>
                            🛒 Comprar Ahora
                        </Button>
                        <Button as={Link} to="/contacto" variant="outline-light" size="lg" className="fw-bold px-5">
                            💬 Contactar Soporte
                        </Button>
                    </div>
                </Container>
            </div>

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
            `}</style>
        </div>
    );
};

export default Home;