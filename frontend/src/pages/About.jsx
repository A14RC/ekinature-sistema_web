import { Container, Row, Col, Card } from 'react-bootstrap';

const About = () => {
  return (
    <div style={{ backgroundColor: '#f9f9f9', paddingBottom: '50px' }}>
      {/* Sección Hero */}
      <div style={{ 
        background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)', 
        color: 'white', 
        padding: '60px 0',
        textAlign: 'center'
      }}>
        <Container>
          <h1 className="fw-bold display-4" style={{ marginBottom: '20px' }}>🌿 Sobre EkiNature</h1>
          <p className="lead" style={{ fontSize: '1.3rem', fontWeight: '500' }}>
            Innovación biotecnológica para el control de plagas en Quito 🇪🇨
          </p>
        </Container>
      </div>

      <Container className="my-5">
        {/* Sección 1: Propuesta Técnica */}
        <Row className="align-items-center mb-5" style={{ marginTop: '40px' }}>
          <Col lg={6} className="mb-4 mb-lg-0">
            <Card className="border-0 shadow-lg h-100" style={{ borderRadius: '25px', backgroundColor: '#f1f8e9' }}>
              <Card.Body className="p-5">
                <h3 style={{ color: '#1b5e20' }} className="fw-bold mb-4">
                  🧬 Nuestra Propuesta Técnica
                </h3>
                <p style={{ 
                  textAlign: 'justify',
                  lineHeight: '1.8',
                  color: '#333',
                  fontSize: '1.05rem'
                }}>
                  EkiNature nace como una respuesta profesional ante la proliferación de plagas urbanas en el Distrito Metropolitano de Quito. Nuestra solución se basa en un gel insecticida formulado con ingredientes de grado alimenticio. Este enfoque permite una aplicación segura en cocinas, hospitales y hogares con presencia de niños y mascotas, eliminando la necesidad de desalojar los espacios. ✨
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={6}>
            <Card className="border-0 shadow-lg h-100" style={{ 
              borderRadius: '25px', 
              background: 'linear-gradient(135deg, #2e7d32 0%, #388e3c 100%)',
              color: 'white'
            }}>
              <Card.Body className="p-5">
                <h4 className="fw-bold mb-4">⚗️ Tecnología de Efecto Dominó</h4>
                <p style={{ 
                  textAlign: 'justify',
                  lineHeight: '1.8',
                  fontSize: '1.05rem'
                }}>
                  Utilizamos feromonas de atracción que incitan a los insectos a ingerir el producto y transportarlo al núcleo de la colonia. Este método garantiza una erradicación masiva y persistente, logrando una eficiencia superior a las fumigaciones tradicionales sin contaminar el aire de su entorno. 🎯
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Sección 2: Beneficios principales */}
        <div style={{ textAlign: 'center', marginBottom: '50px', marginTop: '60px' }}>
          <h2 className="fw-bold mb-5" style={{ color: '#1b5e20', fontSize: '2.5rem' }}>
            ¿Por qué elegir EkiNature?
          </h2>
          <Row>
            <Col md={4} className="mb-4">
              <Card className="border-0 shadow-lg h-100" style={{ borderRadius: '20px', transition: 'transform 0.3s', backgroundColor: '#e8f5e9' }}>
                <Card.Body className="p-4">
                  <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🛡️</div>
                  <h5 className="fw-bold mb-3" style={{ color: '#2e7d32' }}>Seguridad Total</h5>
                  <p style={{ 
                    textAlign: 'justify',
                    color: '#555',
                    lineHeight: '1.6'
                  }}>
                    Certificación Pet-Friendly. Completamente seguro para hogares con niños y mascotas, sin riesgos de toxicidad aérea. 🐾
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="border-0 shadow-lg h-100" style={{ borderRadius: '20px', transition: 'transform 0.3s', backgroundColor: '#f1f8e9' }}>
                <Card.Body className="p-4">
                  <div style={{ fontSize: '3rem', marginBottom: '15px' }}>💥</div>
                  <h5 className="fw-bold mb-3" style={{ color: '#2e7d32' }}>Efecto Dominó</h5>
                  <p style={{ 
                    textAlign: 'justify',
                    color: '#555',
                    lineHeight: '1.6'
                  }}>
                    Tecnología de atracción feromonal que permite la erradicación total desde el núcleo del nido. Máxima efectividad garantizada. 🎯
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="border-0 shadow-lg h-100" style={{ borderRadius: '20px', transition: 'transform 0.3s', backgroundColor: '#e8f5e9' }}>
                <Card.Body className="p-4">
                  <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🌍</div>
                  <h5 className="fw-bold mb-3" style={{ color: '#2e7d32' }}>Eco-Responsable</h5>
                  <p style={{ 
                    textAlign: 'justify',
                    color: '#555',
                    lineHeight: '1.6'
                  }}>
                    Componentes biodegradables que no contaminan superficies de grado alimenticio ni dejan residuos químicos persistentes. ♻️
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>

        {/* Sección 3: Características destacadas */}
        <div className="my-5" style={{ 
          background: 'linear-gradient(135deg, #f1f8e9 0%, #e8f5e9 100%)',
          padding: '40px',
          borderRadius: '25px',
          border: '2px solid #2e7d32'
        }}>
          <h3 className="fw-bold text-center mb-5" style={{ color: '#1b5e20', fontSize: '2rem' }}>
            ✨ Características Destacadas
          </h3>
          <Row>
            <Col md={6} className="mb-3">
              <div className="d-flex gap-3 mb-3">
                <div style={{ fontSize: '2rem' }}>⏱️</div>
                <div>
                  <h5 className="fw-bold" style={{ color: '#2e7d32' }}>Sin Olor</h5>
                  <p style={{ 
                    textAlign: 'justify',
                    color: '#333',
                    margin: 0
                  }}>
                    No requiere desalojar el área tras la aplicación. Continúa tu vida normalmente mientras trabaja el producto.
                  </p>
                </div>
              </div>
            </Col>
            <Col md={6} className="mb-3">
              <div className="d-flex gap-3 mb-3">
                <div style={{ fontSize: '2rem' }}>🏥</div>
                <div>
                  <h5 className="fw-bold" style={{ color: '#2e7d32' }}>Uso Versátil</h5>
                  <p style={{ 
                    textAlign: 'justify',
                    color: '#333',
                    margin: 0
                  }}>
                    Ideal para cocinas, hospitales, restaurantes y cualquier espacio donde la seguridad sea prioritaria.
                  </p>
                </div>
              </div>
            </Col>
            <Col md={6} className="mb-3">
              <div className="d-flex gap-3 mb-3">
                <div style={{ fontSize: '2rem' }}>📅</div>
                <div>
                  <h5 className="fw-bold" style={{ color: '#2e7d32' }}>Persistencia Prolongada</h5>
                  <p style={{ 
                    textAlign: 'justify',
                    color: '#333',
                    margin: 0
                  }}>
                    Protección activa hasta por 3 meses. Máxima durabilidad y valor por tu inversión.
                  </p>
                </div>
              </div>
            </Col>
            <Col md={6} className="mb-3">
              <div className="d-flex gap-3 mb-3">
                <div style={{ fontSize: '2rem' }}>🎯</div>
                <div>
                  <h5 className="fw-bold" style={{ color: '#2e7d32' }}>Precisión Científica</h5>
                  <p style={{ 
                    textAlign: 'justify',
                    color: '#333',
                    margin: 0
                  }}>
                    Formulado basado en investigación biotecnológica para máxima efectividad contra plagas urbanas.
                  </p>
                </div>
              </div>
            </Col>
          </Row>
        </div>

        {/* Sección 4: Misión */}
        <Row className="mt-5 mb-5">
          <Col>
            <Card className="border-0 shadow-lg" style={{ 
              borderRadius: '25px',
              background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)',
              color: 'white'
            }}>
              <Card.Body className="p-5 text-center">
                <h3 className="fw-bold mb-4">🎯 Nuestra Misión</h3>
                <p style={{ 
                  textAlign: 'justify',
                  lineHeight: '1.8',
                  fontSize: '1.1rem'
                }}>
                  Proporcionar soluciones innovadoras y seguras para el control de plagas que respeten el bienestar de nuestras familias, mascotas y el medio ambiente. En EkiNature creemos que la tecnología y la naturaleza pueden convivir en armonía para crear espacios más seguros y saludables. 🌱
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default About;