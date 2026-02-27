import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:3000/api/auth/login', { usuario, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('rol', res.data.rol);
            localStorage.setItem('usuario', res.data.usuario);
            navigate('/admin/dashboard');
        } catch (err) {
            setError(err.response?.data?.mensaje || 'Error al iniciar sesión');
        }
    };

    return (
        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
            <Card className="p-4 shadow-lg border-0" style={{ width: '100%', maxWidth: '400px', borderRadius: '20px' }}>
                <Card.Body>
                    <h2 className="text-center mb-4 fw-bold" style={{ color: '#1b5e20' }}>Acceso Staff</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleLogin}>
                        <Form.Group className="mb-3">
                            <Form.Label>Usuario</Form.Label>
                            <Form.Control 
                                type="text" 
                                required 
                                value={usuario}
                                onChange={(e) => setUsuario(e.target.value)}
                                style={{ borderRadius: '10px' }}
                            />
                        </Form.Group>
                        <Form.Group className="mb-4">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control 
                                type="password" 
                                required 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ borderRadius: '10px' }}
                            />
                        </Form.Group>
                        <Button type="submit" className="w-100 fw-bold py-2" style={{ backgroundColor: '#2e7d32', border: 'none', borderRadius: '10px' }}>
                            Ingresar
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Login;